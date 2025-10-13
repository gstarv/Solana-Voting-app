'use client'

import {
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  Globe,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 rounded-full border border-gray-200 hover:bg-gray-50 shadow-sm px-3 py-1.5"
        >
          <User className="h-4 w-4 text-gray-700" />
          <span className="hidden sm:inline font-medium text-gray-700">Victor M.</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 border border-gray-100 shadow-md rounded-xl bg-white"
      >
        <div className="px-3 py-2">
          <div className="font-semibold text-gray-800">Victor Manzo</div>
          <div className="text-xs text-gray-500">CSC/19U/403</div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
          <User className="h-4 w-4 mr-2 text-gray-600" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
          <Shield className="h-4 w-4 mr-2 text-gray-600" />
          Wallet Settings
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
          <Bell className="h-4 w-4 mr-2 text-gray-600" />
          Notification Preferences
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
          <Settings className="h-4 w-4 mr-2 text-gray-600" />
          Privacy & Security
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
          <Globe className="h-4 w-4 mr-2 text-gray-600" />
          Language Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
