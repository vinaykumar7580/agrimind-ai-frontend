'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  Video, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  Users,
  Award,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'How do I get started with AgriMind AI?',
      answer: 'Getting started is easy! Simply create an account, explore the dashboard, and start chatting with our AI assistant. You can upload documents, check weather, analyze soil reports, and detect crop diseases. Check our video tutorials for a quick walkthrough.'
    },
    {
      id: 2,
      question: 'What types of documents can I upload?',
      answer: 'AgriMind AI supports PDF and Excel files. You can upload crop guides, research papers, government schemes, soil reports, and any agricultural documentation. The system will process these documents and make them available for RAG-based queries.'
    },
    {
      id: 3,
      question: 'How accurate is the disease detection?',
      answer: 'Our YOLO-based disease detection model achieves over 90% accuracy for common crop diseases including Leaf Spot, Powdery Mildew, Bacterial Blight, and Rust. For best results, upload clear, well-lit images of affected leaves.'
    },
    {
      id: 4,
      question: 'Is my data secure?',
      answer: 'Yes, we take data security seriously. All your documents and conversations are encrypted. You have full control over your data and can delete it anytime. We do not share your personal information with third parties.'
    },
    {
      id: 5,
      question: 'How does the soil analysis work?',
      answer: 'Upload your soil test report in Excel format. Our system analyzes parameters like pH, Nitrogen, Phosphorus, Potassium, and Organic Carbon. You receive a comprehensive soil health score, nutrient analysis, and customized fertilizer recommendations.'
    },
    {
      id: 6,
      question: 'Can I use AgriMind AI on mobile?',
      answer: 'Currently, AgriMind AI is optimized for web browsers on desktop and mobile devices. A dedicated mobile app is planned for future release. The web interface works well on smartphones and tablets.'
    },
    {
      id: 7,
      question: 'How do I get weather updates for my farm?',
      answer: 'Enter your location in the Weather Intelligence section. We provide real-time temperature, humidity, wind speed, and 5-day forecasts. You can also enable weather alerts in settings to get notified about severe conditions.'
    },
    {
      id: 8,
      question: 'What crops does AgriMind AI support?',
      answer: 'We support major crops including wheat, rice, maize, soybean, cotton, sugarcane, potato, tomato, onion, and many more. The system continuously learns and expands its crop database based on uploaded documents and user interactions.'
    }
  ]

  const videoTutorials = [
    { title: 'Getting Started with AgriMind AI', duration: '5:23', level: 'Beginner' },
    { title: 'Using the AI Chat Assistant', duration: '8:15', level: 'Beginner' },
    { title: 'Uploading and Managing Documents', duration: '6:42', level: 'Intermediate' },
    { title: 'Disease Detection Guide', duration: '7:30', level: 'Intermediate' },
    { title: 'Soil Analysis Interpretation', duration: '10:15', level: 'Advanced' },
    { title: 'Market Intelligence Tips', duration: '9:45', level: 'Advanced' }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const handleContactSupport = () => {
    toast.success('Support request sent! We\'ll get back to you within 24 hours.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-gray-600 mt-2">Find answers, tutorials, and support for AgriMind AI</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-1">Documentation</h3>
            <p className="text-xs text-gray-500">Read user guides</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Video className="h-10 w-10 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-1">Video Tutorials</h3>
            <p className="text-xs text-gray-500">Watch how-to videos</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-10 w-10 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-1">Live Chat</h3>
            <p className="text-xs text-gray-500">Chat with support</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Users className="h-10 w-10 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-1">Community Forum</h3>
            <p className="text-xs text-gray-500">Ask other farmers</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle>🚀 Getting Started with AgriMind AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Create Account</h4>
                <p className="text-xs text-gray-600 mt-1">Sign up with email or phone number to access all features</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Set Up Profile</h4>
                <p className="text-xs text-gray-600 mt-1">Add farm location and crop details for personalized recommendations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Start Exploring</h4>
                <p className="text-xs text-gray-600 mt-1">Use chat, upload documents, or try disease detection features</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="border rounded-lg">
                <button
                  className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-3 text-gray-600 text-sm border-t pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <CardTitle>📹 Video Tutorials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoTutorials.map((video, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{video.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                      <span>•</span>
                      <Award className="h-3 w-3" />
                      <span>{video.level}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-500">support@agrimind.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-500">+91 1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
            <div>
              <Button className="w-full" onClick={handleContactSupport}>
                Contact Support Team
              </Button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Average response time: &lt; 24 hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-semibold text-green-900">System Status: All Systems Operational</p>
              <p className="text-xs text-green-700">Last updated: Today, 10:30 AM IST</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            View Status Page
          </Button>
        </div>
      </div>
    </div>
  )
}