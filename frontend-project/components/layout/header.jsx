'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Bell, User, Menu } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}