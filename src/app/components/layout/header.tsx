'use client'

import { WalletConnector } from '@/app/components/wallet/wallet-connector'
import { NotificationBell } from '@/app/components/notifiaction/notification-bell'
import { UserMenu } from '@/app/components/layout/user-menu'

export function DashboardHeader() {
  return (
    <header className="w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* === Logo === */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md">
              <span className="text-white font-bold text-base">🏛️</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                MAU SecureVote
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                Blockchain Voting System
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-semibold text-gray-900">MAU Vote</h1>
            </div>
          </div>

          {/* === Right Section === */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:block">
              <WalletConnector />
            </div>

            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}