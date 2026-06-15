import './globals.css'
import { Toaster } from 'sonner'
import Header from '../components/layout/header'
import Sidebar from '../components/layout/sidebar'

export const metadata = {
  title: 'AgriMind AI - Smart Agriculture Assistant',
  description: 'AI-powered platform for crop management, disease detection, and market intelligence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}