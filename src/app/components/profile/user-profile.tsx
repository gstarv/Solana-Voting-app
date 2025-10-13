'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { User, Mail, Shield, Calendar, MapPin, Edit } from 'lucide-react'

interface UserProfileProps {
  user?: {
    name: string
    studentId: string
    email: string
    faculty: string
    department: string
    year: number
    isVerified: boolean
    walletAddress?: string
    joinDate: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const userData = user || {
    name: 'Victor',
    studentId: 'CSC7J8U403',
    email: 'victor@student.edu',
    faculty: 'Faculty of Computing',
    department: 'Computer Science',
    year: 3,
    isVerified: true,
    walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    joinDate: '2022-09-15'
  }

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', value: userData.name, icon: User },
        { label: 'Student ID', value: userData.studentId, icon: User },
        { label: 'Email', value: userData.email, icon: Mail },
        { label: 'Verification Status', value: userData.isVerified ? 'Verified' : 'Not Verified', icon: Shield, status: userData.isVerified ? 'success' : 'warning' as const }
      ]
    },
    {
      title: 'Academic Information',
      items: [
        { label: 'Faculty', value: userData.faculty, icon: MapPin },
        { label: 'Department', value: userData.department, icon: MapPin },
        { label: 'Year', value: `Year ${userData.year}`, icon: Calendar },
        { label: 'Join Date', value: new Date(userData.joinDate).toLocaleDateString(), icon: Calendar }
      ]
    },
    {
      title: 'Blockchain Information',
      items: [
        { label: 'Wallet Address', value: userData.walletAddress ? `${userData.walletAddress.slice(0, 8)}...${userData.walletAddress.slice(-6)}` : 'Not connected', icon: Shield }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-gray-600">{userData.studentId}</p>
                  <Badge variant={userData.isVerified ? "default" : "secondary"} className={userData.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {userData.isVerified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profileSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <item.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600 mt-1 break-all">{item.value}</p>
                    </div>
                  </div>
                  {item.status && (
                    <Badge 
                      variant={item.status === 'success' ? "default" : "secondary"}
                      className={item.status === 'success' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {item.value}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Voting Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Voting Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600 mt-1">Total Votes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600 mt-1">Participation Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600 mt-1">Active Elections</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600 mt-1">Upcoming</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}