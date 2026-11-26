'use client'

import Link from 'next/link'
import { Shield, Vote, Users, Lock, ArrowRight } from 'lucide-react'
import { Footer } from '@/app/components/layout/footer'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Transparent & Verifiable',
      description: 'Votes are submitted through a connected wallet and can be verified on Solana Devnet.',
    },
    {
      icon: Vote,
      title: 'Easy Voting',
      description: 'A clear voting experience designed to work across desktop and mobile devices.',
    },
    {
      icon: Users,
      title: 'Election Information',
      description: 'Review election details and candidate information before making a selection.',
    },
    {
      icon: Lock,
      title: 'Wallet-Controlled',
      description: 'Your wallet asks you to approve transactions; the app never asks for your private key.',
    },
  ]

  const steps = [
    { step: '1', title: 'Connect your wallet', desc: 'Use a Solana wallet configured for Devnet.' },
    { step: '2', title: 'Review elections', desc: 'Check the election details and available choices.' },
    { step: '3', title: 'Approve a transaction', desc: 'Review and sign the vote transaction in your wallet.' },
  ]

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Shield className="mr-3 h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VoteChain</span>
          </div>
          <Link href="/dashboard" className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700">
            Enter Dashboard
          </Link>
        </div>
      </nav>

      <section className="px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Transparent Solana
            <span className="block text-blue-600">Voting Demo</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            Explore a wallet-based voting application on Solana Devnet. This project is a demonstration and is not designed for confidential or legally binding elections.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700">
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl bg-gray-50 p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-gray-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">How it works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <article key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">{item.step}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-white">Ready to explore the demo?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">Connect a Devnet wallet and explore the application.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-colors hover:bg-gray-100">
          Enter Voting Dashboard <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <Footer showNewsletter={true} compact={false} />
    </div>
  )
}
