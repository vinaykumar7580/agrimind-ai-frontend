import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { MessageCircle, Cloud, Leaf, Bug, TrendingUp } from 'lucide-react'

export default function Home() {
  const features = [
    {
      title: 'AI Agriculture Chat',
      description: 'Ask questions about crops, fertilizers, and farming practices',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-green-500'
    },
    {
      title: 'Weather Intelligence',
      description: 'Get real-time weather data and forecasts for your farm',
      icon: Cloud,
      href: '/weather',
      color: 'bg-blue-500'
    },
    {
      title: 'Soil Analysis',
      description: 'Upload soil reports for nutrient analysis and recommendations',
      icon: Leaf,
      href: '/soil-analysis',
      color: 'bg-yellow-600'
    },
    {
      title: 'Disease Detection',
      description: 'Upload crop images for disease identification',
      icon: Bug,
      href: '/disease-detection',
      color: 'bg-red-500'
    },
    {
      title: 'Market Intelligence',
      description: 'Get crop prices, trends, and profitability insights',
      icon: TrendingUp,
      href: '/market-intelligence',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          AgriMind AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your AI-powered agriculture intelligence platform for smarter farming decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Get Started →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            AgriMind AI combines multiple AI technologies to provide comprehensive farming assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Ask Questions</h3>
              <p className="text-sm text-gray-600">Chat about your farming needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Upload Data</h3>
              <p className="text-sm text-gray-600">Share soil reports or crop images</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">Our agents analyze your data</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Get Insights</h3>
              <p className="text-sm text-gray-600">Receive personalized recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}