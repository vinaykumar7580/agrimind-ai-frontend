'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Cloud, Droplet, Wind, Thermometer, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function WeatherPage() {
  const [location, setLocation] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchWeather = async () => {
    if (!location) {
      toast.error('Please enter a location')
      return
    }

    setLoading(true)
    
    // Simulate API call to OpenWeather API through your backend
    setTimeout(() => {
      setWeatherData({
        location: location,
        temperature: 28,
        feels_like: 30,
        humidity: 65,
        wind_speed: 12,
        pressure: 1012,
        description: 'Partly cloudy',
        forecast: [
          { day: 'Tomorrow', temp: 29, condition: 'Sunny' },
          { day: 'Day 2', temp: 27, condition: 'Light rain' },
          { day: 'Day 3', temp: 26, condition: 'Rainy' },
          { day: 'Day 4', temp: 28, condition: 'Cloudy' },
          { day: 'Day 5', temp: 30, condition: 'Sunny' },
        ]
      })
      setLoading(false)
      toast.success('Weather data fetched successfully')
    }, 1000)
  }

  const getWeatherRecommendation = () => {
    if (!weatherData) return null
    
    if (weatherData.temperature > 35) {
      return "High temperature alert! Provide adequate irrigation to prevent crop stress. Consider mulching to retain soil moisture."
    }
    if (weatherData.temperature < 10) {
      return "Low temperature alert! Protect sensitive crops with covers or consider using frost protection methods."
    }
    if (weatherData.humidity > 80) {
      return "High humidity may increase disease risk. Monitor for fungal infections and ensure proper air circulation."
    }
    if (weatherData.wind_speed > 25) {
      return "Strong winds detected. Protect tall crops with windbreaks and delay spraying activities."
    }
    return "Current weather conditions are favorable for most crops. Maintain regular irrigation schedule."
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Weather Intelligence</h1>
          <p className="text-gray-600 mt-2">Real-time weather data and forecasts for your farm</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter city or location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchWeather} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Fetching...' : 'Get Weather'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {weatherData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
                    <p className="text-sm">Feels like {weatherData.feels_like}°C</p>
                  </div>
                  <Thermometer className="h-12 w-12 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="text-3xl font-bold">{weatherData.humidity}%</p>
                  </div>
                  <Droplet className="h-12 w-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Wind Speed</p>
                    <p className="text-3xl font-bold">{weatherData.wind_speed} km/h</p>
                  </div>
                  <Wind className="h-12 w-12 text-gray-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="text-3xl font-bold capitalize">{weatherData.description}</p>
                  </div>
                  <Cloud className="h-12 w-12 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Farming Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">{getWeatherRecommendation()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="font-semibold">{day.day}</p>
                    <p className="text-2xl mt-2">{day.temp}°C</p>
                    <p className="text-sm text-gray-500">{day.condition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}