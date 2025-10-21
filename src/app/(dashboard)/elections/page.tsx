import { ElectionList } from '@/components/elections/election-list'

export default function ElectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Elections</h1>
          <p className="text-gray-600 mt-2">Browse and participate in available elections</p>
        </div>
      </div>
      
      <ElectionList />
    </div>
  )
}