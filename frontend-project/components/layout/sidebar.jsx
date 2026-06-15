'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'
import { 
  Home, 
  MessageCircle, 
  Cloud, 
  Leaf, 
  Bug, 
  TrendingUp,
  FileText,
  Settings,
  HelpCircle
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: MessageCircle, label: 'Chat', href: '/chat' },
    { icon: Cloud, label: 'Weather', href: '/weather' },
    { icon: Leaf, label: 'Soil Analysis', href: '/soil-analysis' },
    { icon: Bug, label: 'Disease Detection', href: '/disease-detection' },
    { icon: TrendingUp, label: 'Market', href: '/market-intelligence' },
    { icon: FileText, label: 'Documents', href: '/documents' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help', href: '/help' },
  ]

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          AgriMind AI
        </h1>
        <p className="text-xs text-gray-500 mt-1">Smart Farming Assistant</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-900">Need Help?</p>
          <p className="text-xs text-green-700 mt-1">Contact our support team</p>
        </div>
      </div>
    </aside>
  )
}