use anchor_lang::prelude::*;

declare_id!("3XkfBi8AkX3Ce9nYYMcNG3Ai9xNKwQzxULexxJaPFQ37");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_election(
        ctx: Context<InitializeElection>,
        election_id: [u8; 32],
        candidate_count: u16,
    ) -> Result<()> {
        require!(candidate_count > 0, VotingError::InvalidCandidateCount);

        let election = &mut ctx.accounts.election;
        election.authority = ctx.accounts.authority.key();
        election.election_id = election_id;
        election.candidate_count = candidate_count;
        election.open = true;
        Ok(())
    }

    pub fn set_election_status(ctx: Context<SetElectionStatus>, election_open: bool) -> Result<()> {
        require_keys_eq!(ctx.accounts.authority.key(), ctx.accounts.election.authority, VotingError::Unauthorized);
        ctx.accounts.election.open = election_open;
        Ok(())
    }

    pub fn cast_vote(ctx: Context<CastVote>, candidate_index: u16) -> Result<()> {
        let election = &ctx.accounts.election;
        require!(election.open, VotingError::ElectionClosed);
        require!((candidate_index as usize) < election.candidate_count as usize, VotingError::InvalidCandidate);

        let receipt = &mut ctx.accounts.receipt;
        receipt.election = election.key();
        receipt.voter = ctx.accounts.voter.key();
        receipt.candidate_index = candidate_index;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(election_id: [u8; 32], candidate_count: u16)]
pub struct InitializeElection<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Election::INIT_SPACE,
        seeds = [b"election", &election_id],
        bump,
    )]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetElectionStatus<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(
        init,
        payer = voter,
        space = 8 + VoteReceipt::INIT_SPACE,
        seeds = [b"receipt", election.key().as_ref(), voter.key().as_ref()],
        bump,
    )]
    pub receipt: Account<'info, VoteReceipt>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Election {
    pub authority: Pubkey,
    pub election_id: [u8; 32],
    pub candidate_count: u16,
    pub open: bool,
}

#[account]
#[derive(InitSpace)]
pub struct VoteReceipt {
    pub election: Pubkey,
    pub voter: Pubkey,
    pub candidate_index: u16,
}

#[error_code]
pub enum VotingError {
    #[msg("The election is closed")]
    ElectionClosed,
    #[msg("The candidate index is invalid")]
    InvalidCandidate,
    #[msg("The candidate count must be greater than zero")]
    InvalidCandidateCount,
    #[msg("Only the election authority may perform this action")]
    Unauthorized,
}
