'use client'

import { ShieldCheck } from 'lucide-react'

interface WelcomeSectionProps {
  user?: {
    name: string
    studentId: string
    isVerified?: boolean
    email?: string
    walletAddress?: string
  }
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const userData = user || { 
    name: 'Victor', 
    studentId: 'CSC/19U/403', 
    isVerified: true,
    email: 'victor@student.edu'
  }

  return (
    <section className="relative rounded-xl bg-[#0A57FF] text-white shadow-sm overflow-hidden">
      {/* Main content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-6 md:py-7">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome Back, {userData.name}!
          </h1>
          <p className="text-sm md:text-base text-blue-100">
            Student ID: <span className="font-mono text-white">{userData.studentId}</span>
          </p>
          <p className="text-blue-50 text-sm mt-1">
            You are registered and verified for voting
          </p>
        </div>

        {/* Blockchain Secured Badge */}
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 mt-4 md:mt-0 rounded-lg border border-white/20 backdrop-blur-sm">
          <ShieldCheck className="w-5 h-5 text-white" />
          <span className="font-medium text-sm">Blockchain Secured</span>
        </div>
      </div>
    </section>
  )
}
