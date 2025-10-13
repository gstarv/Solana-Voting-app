'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react'

export function TransactionVerifier() {
  const [transactionHash, setTransactionHash] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    details?: string
  } | null>(null)

  const verifyTransaction = async () => {
    if (!transactionHash.trim()) return

    setVerifying(true)
    
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock verification result
    const isVerified = Math.random() > 0.3 // 70% chance of success for demo
    
    setVerificationResult({
      verified: isVerified,
      details: isVerified 
        ? 'Transaction confirmed on Solana blockchain'
        : 'Transaction not found or failed'
    })
    
    setVerifying(false)
  }

  const resetVerification = () => {
    setVerificationResult(null)
    setTransactionHash('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Verify Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Transaction Hash</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter transaction hash..."
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
              className="font-mono text-sm"
            />
            <Button 
              onClick={verifyTransaction} 
              disabled={!transactionHash.trim() || verifying}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Verify
            </Button>
          </div>
        </div>

        {verificationResult && (
          <div className={`p-4 border rounded-lg ${
            verificationResult.verified 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-3">
              {verificationResult.verified ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {verificationResult.verified ? 'Verified' : 'Not Verified'}
                  </span>
                  <Badge 
                    variant={verificationResult.verified ? "success" : "destructive"}
                    className={
                      verificationResult.verified 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {verificationResult.verified ? 'Success' : 'Failed'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{verificationResult.details}</p>
              </div>
            </div>
            
            {verificationResult.verified && (
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </Button>
                <Button variant="outline" size="sm" onClick={resetVerification}>
                  Verify Another
                </Button>
              </div>
            )}
          </div>
        )}

        {verifying && (
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <div>
                <p className="font-medium text-sm">Verifying transaction...</p>
                <p className="text-sm text-gray-600">Checking Solana blockchain</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}