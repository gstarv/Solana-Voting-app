import { PublicKey } from '@solana/web3.js'

export const VOTING_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_VOTING_PROGRAM_ID || '3XkfBi8AkX3Ce9nYYMcNG3Ai9xNKwQzxULexxJaPFQ37',
)

export const VOTING_AUTHORITY = new PublicKey(
  process.env.NEXT_PUBLIC_VOTING_AUTHORITY || 'EHP4V18LSoVT8EawgPjqjRmUkV3d6Df4zYQshKkKn8rr',
)

// The Anchor program expects a fixed 32-byte election ID. Encode the stable
// demo slug as UTF-8 and zero-pad it so every client derives the same PDA.
export function toElectionIdBytes(electionId: string): Uint8Array {
  const encoded = new TextEncoder().encode(electionId)
  if (encoded.length > 32) throw new Error('Election ID must be at most 32 bytes.')
  const bytes = new Uint8Array(32)
  bytes.set(encoded)
  return bytes
}

export function deriveElectionAddress(electionId: string) {
  return PublicKey.findProgramAddressSync(
    [new TextEncoder().encode('election'), toElectionIdBytes(electionId)],
    VOTING_PROGRAM_ID,
  )[0]
}

export function deriveVoteReceiptAddress(electionAddress: PublicKey, voter: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [new TextEncoder().encode('receipt'), electionAddress.toBuffer(), voter.toBuffer()],
    VOTING_PROGRAM_ID,
  )[0]
}

async function instructionDiscriminator(instructionName: string): Promise<Uint8Array> {
  const input = new TextEncoder().encode(`global:${instructionName}`)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', input)
  return new Uint8Array(digest).slice(0, 8)
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(arrays.reduce((length, array) => length + array.length, 0))
  let offset = 0
  for (const array of arrays) {
    result.set(array, offset)
    offset += array.length
  }
  return result
}

export async function makeInitializeElectionInstruction(
  electionId: string,
  candidateCount: number,
  authority: PublicKey,
) {
  if (!Number.isInteger(candidateCount) || candidateCount < 1 || candidateCount > 0xffff) {
    throw new Error('Candidate count is invalid.')
  }

  const electionAddress = deriveElectionAddress(electionId)
  const count = new Uint8Array(2)
  new DataView(count.buffer).setUint16(0, candidateCount, true)
  const data = concatBytes(
    await instructionDiscriminator('initialize_election'),
    toElectionIdBytes(electionId),
    count,
  )

  return {
    electionAddress,
    instruction: new (await import('@solana/web3.js')).TransactionInstruction({
      programId: VOTING_PROGRAM_ID,
      keys: [
        { pubkey: electionAddress, isSigner: false, isWritable: true },
        { pubkey: authority, isSigner: true, isWritable: true },
        { pubkey: new PublicKey('11111111111111111111111111111111'), isSigner: false, isWritable: false },
      ],
      data: Buffer.from(data),
    }),
  }
}

export async function makeCastVoteInstruction(
  electionAddress: PublicKey,
  voter: PublicKey,
  candidateIndex: number,
) {
  if (!Number.isInteger(candidateIndex) || candidateIndex < 0 || candidateIndex > 0xffff) {
    throw new Error('Candidate selection is invalid.')
  }

  const receiptAddress = deriveVoteReceiptAddress(electionAddress, voter)
  const index = new Uint8Array(2)
  new DataView(index.buffer).setUint16(0, candidateIndex, true)
  const data = concatBytes(await instructionDiscriminator('cast_vote'), index)

  return {
    receiptAddress,
    instruction: new (await import('@solana/web3.js')).TransactionInstruction({
      programId: VOTING_PROGRAM_ID,
      keys: [
        { pubkey: electionAddress, isSigner: false, isWritable: true },
        { pubkey: receiptAddress, isSigner: false, isWritable: true },
        { pubkey: voter, isSigner: true, isWritable: true },
        { pubkey: new PublicKey('11111111111111111111111111111111'), isSigner: false, isWritable: false },
      ],
      data: Buffer.from(data),
    }),
  }
}
