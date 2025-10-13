'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { CheckCircle2, Shield, FileText, Clock, Download } from 'lucide-react'

interface VoteConfirmationProps {
  election: {
    id: string
    title: string
    options: Array<{
      id: string
      name: string
      description: string
    }>
  }
  selectedOptions: string[]
  transactionHash?: string
  timestamp: Date
  onViewReceipt?: () => void
  onDownloadReceipt?: () => void
  onReturnToDashboard?: () => void
}

export function VoteConfirmation({ 
  election, 
  selectedOptions, 
  transactionHash,
  timestamp,
  onViewReceipt,
  onDownloadReceipt,
  onReturnToDashboard 
}: VoteConfirmationProps) {
  const selectedOptionDetails = election.options.filter(option => 
    selectedOptions.includes(option.id)
  )

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800 mb-2">
            Vote Successfully Cast!
          </CardTitle>
          <CardDescription className="text-green-700">
            Your vote has been securely recorded on the blockchain
          </CardDescription>
        </CardContent>
      </Card>

      {/* Vote Details */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Details</CardTitle>
          <CardDescription>
            Summary of your voting activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Election Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Election:</span>
              <p className="font-semibold mt-1">{election.title}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Time Cast:</span>
              <p className="font-semibold mt-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timestamp)}
              </p>
            </div>
          </div>

          {/* Selected Options */}
          <div>
            <h4 className="font-medium text-gray-600 mb-2">Your Selection:</h4>
            <div className="space-y-2">
              {selectedOptionDetails.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {index + 1}
                  </Badge>
                  <div>
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Info */}
          {transactionHash && (
            <div>
              <h4 className="font-medium text-gray-600 mb-2">Blockchain Transaction:</h4>
              <div className="p-3 border rounded-lg bg-gray-50 font-mono text-sm break-all">
                {transactionHash}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This transaction hash serves as proof of your vote
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Assurance */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800">Your Vote is Secure</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Encrypted and stored on the blockchain</li>
                <li>• Anonymous and cannot be traced back to you</li>
                <li>• Immutable and cannot be changed</li>
                <li>• Verifiable through your transaction receipt</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onViewReceipt}
          className="flex items-center gap-2 flex-1"
        >
          <FileText className="h-4 w-4" />
          View Receipt
        </Button>
        <Button
          variant="outline"
          onClick={onDownloadReceipt}
          className="flex items-center gap-2 flex-1"
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
        <Button
          onClick={onReturnToDashboard}
          className="flex-1"
        >
          Return to Dashboard
        </Button>
      </div>

      {/* Additional Info */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">
            You can verify your vote later using the transaction hash in the &quot;My Votes&quot; section.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
