import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { VotingDemo } from '@/app/components/voting/voting-demo'

export default function DemoPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-5 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
      <VotingDemo />
    </>
  )
}
