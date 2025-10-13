import { WelcomeSection } from '@/components/dashboard/welcome-section'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { ActiveElections } from '@/components/dashboard/active-election'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { NotificationsPanel } from '@/components/dashboard/notification-panel'
import { SystemStatus } from '@/components/dashboard/system-status'

// Mock data for the ActiveElections component
const mockElections = [
  {
    id: '1',
    title: 'Student Union Elections 2024',
    location: 'University-wide',
    timeRemaining: '3 days remaining',
    eligibleVoters: '2,247',
    votedCount: '1,170',
    participationRate: 52,
    status: 'active' as const,
    canVote: true
  },
  {
    id: '2',
    title: 'Faculty Computing Representative',
    location: 'Computing Faculty',
    timeRemaining: '5 hours remaining',
    eligibleVoters: '610',
    votedCount: '372',
    participationRate: 61,
    status: 'ending-soon' as const,
    canVote: false
  }
]

// Mock data for other components - FIXED TO MATCH PROPS
const mockUser = {
  name: 'Victor',
  studentId: 'CSC7J8U403',
  email: 'victor@student.edu',
  walletAddress: '0x1234...5678'
}

const mockStats = {
  totalElections: 3,
  votedCount: 5,  // ✅ Fixed: changed from 'votesCast' to 'votedCount'
  activeElections: 1,
  upcomingElections: 2
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeSection user={mockUser} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <QuickStats stats={mockStats} />
          <ActiveElections elections={mockElections} />
          <RecentActivity />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <NotificationsPanel />
          <SystemStatus />
        </div>
      </div>
    </div>
  )
}