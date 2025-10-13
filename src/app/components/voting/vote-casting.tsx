'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface VoteOption {
  id: string
  name: string
  description: string
  image?: string
}

interface VoteCastingProps {
  election: {
    id: string
    title: string
    description: string
    options: VoteOption[]
    maxSelections?: number
    timeRemaining: string
  }
  onVoteSubmit: (selectedOptions: string[]) => void
}

export function VoteCasting({ election, onVoteSubmit }: VoteCastingProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<'selection' | 'confirmation'>('selection')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxSelections = election.maxSelections || 1
  const canSelectMore = selectedOptions.length < maxSelections
  const isSingleSelection = maxSelections === 1

  const handleOptionSelect = (optionId: string) => {
    if (isSingleSelection) {
      setSelectedOptions([optionId])
    } else {
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId)
        } else if (canSelectMore) {
          return [...prev, optionId]
        }
        return prev
      })
    }
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    onVoteSubmit(selectedOptions)
    setIsSubmitting(false)
  }

  const handleBackToSelection = () => {
    setCurrentStep('selection')
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Confirm Your Vote</CardTitle>
            <CardDescription>
              Please review your selection before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Options */}
            <div className="space-y-3">
              <h4 className="font-semibold">Your Selection:</h4>
              {selectedOptions.map(optionId => {
                const option = election.options.find(opt => opt.id === optionId)
                return (
                  <div key={optionId} className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{option?.name}</div>
                      <div className="text-sm text-gray-600">{option?.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Your vote is secure and anonymous</p>
                  <p className="text-blue-600 mt-1">
                    Once submitted, your vote cannot be changed. All votes are encrypted and stored on the blockchain.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBackToSelection}
                disabled={isSubmitting}
                className="flex-1"
              >
                Back to Selection
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Confirm & Submit Vote'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Election Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription className="mt-2">{election.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {election.timeRemaining}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Selection Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Make Your Selection</h3>
              <p className="text-sm text-gray-600">
                {isSingleSelection 
                  ? 'Select one option' 
                  : `Select up to ${maxSelections} options (${selectedOptions.length}/${maxSelections} selected)`
                }
              </p>
            </div>
            {!isSingleSelection && (
              <Progress value={(selectedOptions.length / maxSelections) * 100} className="w-24" />
            )}
          </div>

          {!canSelectMore && !isSingleSelection && (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              Maximum selections reached. Deselect an option to choose another.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voting Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {election.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id)
          return (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all border-2 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Selection Indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Option Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{option.name}</h3>
                      {isSelected && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedOptions.length > 0 ? (
                <span className="text-green-600 font-medium">
                  {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} selected
                </span>
              ) : (
                'No options selected yet'
              )}
            </div>
            <Button
              onClick={() => setCurrentStep('confirmation')}
              disabled={selectedOptions.length === 0}
              size="lg"
            >
              Continue to Confirmation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}