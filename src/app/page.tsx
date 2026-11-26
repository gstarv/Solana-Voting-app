'use client'

import Link from 'next/link'
import { Shield, Vote, Users, Lock, ArrowRight } from 'lucide-react'
import { Footer } from '@/app/components/layout/footer'

export default function HomePage() {
  const features = [
    { icon: Shield, title: 'Transparent & Verifiable', description: 'Explore a clearly labeled voting demo with simulated submissions.' },
    { icon: Vote, title: 'Easy Voting', description: 'Try a simple voting experience designed for desktop and mobile.' },
    { icon: Users, title: 'Election Information', description: 'Review election details and candidate information before choosing.' },
    { icon: Lock, title: 'Safe Demo', description: 'No wallet connection, account, private key, or cloud credentials are needed to try the demo.' },
  ]

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center"><Shield className="mr-3 h-8 w-8 text-blue-600" /><span className="text-xl font-bold text-gray-900">VoteChain</span></div>
          <Link href="/demo" className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">Try Demo</Link>
        </div>
      </nav>

      <section className="px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">Interactive demo · No setup required</p>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">Explore the <span className="text-blue-600">VoteChain demo</span></h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600">Try the responsive voting interface and demo API on your phone. Demo submissions are simulated and saved only in your browser; they are not real Solana transactions or valid election votes.</p>
          <Link href="/demo" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700">Start the demo <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl bg-gray-50 p-6 text-center hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"><Icon className="h-6 w-6 text-blue-600" /></div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-gray-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">How to try it</h2>
        <p className="mx-auto mb-8 max-w-2xl text-gray-600">Open the demo, select an election and candidate, then submit. The API validates the selection and returns a clearly marked demo receipt.</p>
        <Link href="/demo" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700">Open interactive demo <ArrowRight className="h-5 w-5" /></Link>
      </section>

      <Footer showNewsletter={true} compact={false} />
    </div>
  )
}
