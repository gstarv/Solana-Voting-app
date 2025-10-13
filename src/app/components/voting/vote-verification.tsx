'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { CheckCircle2, XCircle, Search, Shield, FileText, Copy } from 'lucide-react'

interface VerificationResult {
  isValid: boolean
  voteDetails?: {
    electionTitle: string
    timestamp: Date
    selectedOptions: string[]
    blockNumber: number
    voterId: string // anonymized
  }
  error?: string
}

interface VoteVerificationProps {
  onVerifyTransaction: (txHash: string) => Promise<VerificationResult>
}

export function VoteVerification({ onVerifyTransaction }: VoteVerificationProps) {
  const [transactionHash, setTransactionHash] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [searchedHash, setSearchedHash] = useState('')

  const handleVerify = async () => {
    if (!transactionHash.trim()) return

    setIsVerifying(true)
    setSearchedHash(transactionHash)
    
    try {
      const result = await onVerifyTransaction(transactionHash)
      setVerificationResult(result)
    } catch (error) {
      setVerificationResult({
        isValid: false,
        error: 'Failed to verify transaction. Please try again.'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClear = () => {
    setTransactionHash('')
    setVerificationResult(null)
    setSearchedHash('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Verification Input */}
      <Card>
        <CardHeader>
          <CardTitle>Verify Your Vote</CardTitle>
          <CardDescription>
            Enter your transaction hash to verify that your vote was recorded correctly on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Enter transaction hash..."
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                className="pl-10 font-mono text-sm"
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={!transactionHash.trim() || isVerifying}
              className="flex items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </div>

          {searchedHash && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(searchedHash)}
                  className="flex items-center gap-1 h-6"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              </div>
              <code className="text-xs break-all font-mono mt-1">
                {searchedHash}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Result */}
      {verificationResult && (
        <Card className={verificationResult.isValid ? 'border-green-200' : 'border-red-200'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {verificationResult.isValid ? (
                <>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-green-800">Vote Verified Successfully!</CardTitle>
                    <CardDescription className="text-green-700">
                      Your vote has been confirmed on the blockchain
                    </CardDescription>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-red-800">Verification Failed</CardTitle>
                    <CardDescription className="text-red-700">
                      {verificationResult.error || 'Unable to verify this transaction'}
                    </CardDescription>
                  </div>
                </>
              )}
            </div>

            {verificationResult.isValid && verificationResult.voteDetails && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Election:</span>
                    <p className="font-semibold mt-1">{verificationResult.voteDetails.electionTitle}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Time Cast:</span>
                    <p className="font-semibold mt-1">{formatDate(verificationResult.voteDetails.timestamp)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Block Number:</span>
                    <p className="font-semibold mt-1">#{verificationResult.voteDetails.blockNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Voter ID:</span>
                    <p className="font-semibold mt-1 font-mono text-xs">
                      {verificationResult.voteDetails.voterId}
                    </p>
                  </div>
                </div>

                {/* Selected Options */}
                <div>
                  <span className="font-medium text-gray-600">Selected Options:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {verificationResult.voteDetails.selectedOptions.map((option, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">How Vote Verification Works</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your vote is encrypted and stored on the blockchain</li>
                <li>• Each vote generates a unique transaction hash</li>
                <li>• This hash serves as cryptographic proof of your vote</li>
                <li>• Verification confirms your vote was recorded without revealing your identity</li>
                <li>• You can verify your vote anytime using this transaction hash</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {verificationResult && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            Verify Another Vote
          </Button>
          {verificationResult.isValid && (
            <Button className="flex items-center gap-2 flex-1">
              <FileText className="h-4 w-4" />
              Download Verification Certificate
            </Button>
          )}
        </div>
      )}
    </div>
  )
}