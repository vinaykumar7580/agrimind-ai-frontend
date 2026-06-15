'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send, Upload, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m AgriMind AI, your farming assistant. How can I help you today? You can ask me about crops, fertilizers, weather, or upload documents for analysis.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate API call to your FastAPI backend
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: getAIResponse(input)
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const getAIResponse = (question) => {
    // This would be replaced with actual API call to your backend
    const responses = {
      'cotton': 'Based on your location and current season, cotton can be grown next month. The weather forecast shows suitable conditions with temperatures between 20-30°C. Ensure your soil has good drainage and consider using NPK 20:20:20 fertilizer.',
      'wheat': 'For wheat cultivation, we recommend using DAP (Diammonium Phosphate) at the time of sowing and Urea in split applications. Apply 120-150 kg N, 60-70 kg P2O5, and 40-50 kg K2O per hectare based on your soil test results.',
      'soybean': 'To increase soybean production: 1) Use high-yielding varieties, 2) Maintain proper spacing (45cm x 10cm), 3) Apply Rhizobium culture for nitrogen fixation, 4) Ensure adequate irrigation during flowering and pod formation stages, 5) Control weeds through timely intercultivation.'
    }

    for (const [key, value] of Object.entries(responses)) {
      if (question.toLowerCase().includes(key)) {
        return value
      }
    }

    return "I understand you're asking about farming. To give you the best recommendation, could you provide more details? For example: crop type, your location, or specific concerns you have? I can help with crop selection, fertilizer recommendations, disease identification, and market insights."
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.includes('pdf') && !file.name.includes('.xlsx') && !file.type.includes('image')) {
      toast.error('Please upload PDF, Excel, or image files')
      return
    }

    toast.loading('Uploading and processing document...')
    
    // Simulate upload
    setTimeout(() => {
      toast.dismiss()
      toast.success('Document uploaded successfully! You can now ask questions about it.')
      
      setMessages(prev => [...prev, {
        role: 'system',
        content: `📄 Document uploaded: ${file.name}. I've processed this document and can now answer questions about its content.`
      }])
    }, 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold">AI Agriculture Assistant</h3>
            <p className="text-sm text-gray-500">Ask about crops, fertilizers, diseases, or upload documents</p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.xlsx,.jpg,.png"
              onChange={handleFileUpload}
            />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : message.role === 'system'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-white border text-gray-800'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">AI</span>
                  </div>
                  <span className="text-xs text-gray-500">AgriMind Assistant</span>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          placeholder="Ask about crop management, fertilizers, weather, or market prices..."
          className="flex-1"
          rows="2"
        />
        <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}