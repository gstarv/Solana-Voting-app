'use client'

import { LayoutWrapper } from '@/app/components/layout/layout-wrapper'
import { WelcomeSection } from '@/components/dashboard/welcome-section'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { NotificationsPanel } from '@/components/dashboard/notification-panel'
import { SystemStatus } from '@/components/dashboard/system-status'
import { ActiveElections } from '@/components/dashboard/active-election'
import { UpcomingElections } from '@/components/dashboard/upcoming-election'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Footer } from '@/components/layout/footer' // Import the Footer component

export default function DashboardPage() {
  // ✅ Matches QuickStatsProps perfectly
  const stats = {
    totalElections: 12,
    votedCount: 2750,
    activeElections: 2,
    upcomingElections: 3,
  }

  const activeElections = [
    {
      id: '1',
      title: 'Student Union Presidential Election',
      location: 'Main Campus',
      timeRemaining: '2h 45m left',
      eligibleVoters: '3,400',
      votedCount: '2,100',
      participationRate: 62,
      status: 'active' as const,
      canVote: true,
    },
    {
      id: '2',
      title: 'Faculty Senate Election',
      location: 'Science Auditorium',
      timeRemaining: '30m left',
      eligibleVoters: '800',
      votedCount: '650',
      participationRate: 81,
      status: 'ending-soon' as const,
      canVote: false,
    },
  ]

  const upcomingElections = [
    {
      id: '3',
      title: 'Departmental Representative Election',
      location: 'ICT Hall',
      startDate: 'Oct 18, 2025',
      positions: '3',
      status: 'upcoming' as const,
    },
  ]

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Quick Stats and Notifications */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuickStats stats={stats} />
          </div>
          <div className="space-y-6">
            <NotificationsPanel />
            <SystemStatus />
          </div>
        </div>

        {/* Active Elections */}
        <ActiveElections elections={activeElections} />

        {/* Upcoming Elections & Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingElections elections={upcomingElections} />
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Footer added directly */}
        <Footer compact={true} />
      </div>
    </LayoutWrapper>
  )
}