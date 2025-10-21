'use client'

import { ReactNode } from 'react'
import { DashboardHeader } from '@/app/components/layout/header'
import { DashboardSidebar } from '@/app/components/layout/sidebar'
import { MobileNavigation } from '@/app/components/layout/mobile-nav'
import { Footer } from '@/components/layout/footer'

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      {/* === HEADER === */}
      <div className="backdrop-blur-md bg-white/80 sticky top-0 z-50 shadow-sm border-b border-gray-200">
        <DashboardHeader />
      </div>

      {/* === MAIN BODY === */}
      <div className="flex flex-1 overflow-hidden">
        {/* === SIDEBAR (Desktop only) - FIXED POSITION === */}
        <aside className="hidden lg:flex w-64 flex-col bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-md fixed left-0 top-16 h-[calc(100vh-4rem)] z-40">
          <DashboardSidebar />
        </aside>

        {/* === MAIN CONTENT - WITH SIDEBAR OFFSET === */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-64">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* === MOBILE NAVIGATION === */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md bg-white/90 border-t border-gray-200 shadow-md z-50">
        <MobileNavigation />
      </div>

      {/* === FOOTER === */}
      <Footer compact={true} />
    </div>
  )
}