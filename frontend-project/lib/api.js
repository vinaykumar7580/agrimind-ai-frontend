// API service for connecting to FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  // Chat endpoints
  async sendMessage(message, sessionId) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId })
    })
    return response.json()
  },

  // Weather endpoints
  async getWeather(location) {
    const response = await fetch(`${API_BASE_URL}/api/weather?location=${location}`)
    return response.json()
  },

  // Soil analysis endpoints
  async analyzeSoil(formData) {
    const response = await fetch(`${API_BASE_URL}/api/soil/analyze`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  },

  // Disease detection endpoints
  async detectDisease(formData) {
    const response = await fetch(`${API_BASE_URL}/api/disease/detect`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  },

  // Market endpoints
  async getMarketPrices(crop) {
    const response = await fetch(`${API_BASE_URL}/api/market/prices?crop=${crop}`)
    return response.json()
  },

  // Document upload endpoints
  async uploadDocument(formData) {
    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  }
}