'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function MarketIntelligencePage() {
  const [crop, setCrop] = useState('')
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(false)

  const crops = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion']

  const fetchMarketData = async () => {
    if (!crop) {
      toast.error('Please select a crop')
      return
    }

    setLoading(true)
    
    // Simulate market data API call
    setTimeout(() => {
      const mockData = {
        'Wheat': {
          price: 2250,
          priceUnit: '₹/quintal',
          trend: 'up',
          change: '+2.5%',
          demand: 'High',
          seasonality: 'Peak harvest season (March-April)',
          recommendation: 'Consider selling now as prices are favorable. Storage recommended for sale in off-season (July-August).',
          marketOutlook: 'Bullish due to reduced acreage and strong demand.',
          competitors: 'Madhya Pradesh, Punjab, Haryana'
        },
        'Rice': {
          price: 1950,
          priceUnit: '₹/quintal',
          trend: 'stable',
          change: '+0.8%',
          demand: 'Moderate',
          seasonality: 'Kharif harvest ongoing',
          recommendation: 'Hold for 2-3 weeks for better prices. Government procurement at MSP provides support.',
          marketOutlook: 'Stable with upward bias post-harvest.',
          competitors: 'West Bengal, Uttar Pradesh, Punjab'
        },
        'Soybean': {
          price: 4200,
          priceUnit: '₹/quintal',
          trend: 'up',
          change: '+4.2%',
          demand: 'High',
          seasonality: 'Processing season peak',
          recommendation: 'Sell immediately for best returns. Oil extraction demand is driving prices.',
          marketOutlook: 'Strong bullish momentum due to global demand.',
          competitors: 'Madhya Pradesh, Maharashtra, Rajasthan'
        }
      }

      setMarketData(mockData[crop] || {
        price: 2500,
        priceUnit: '₹/quintal',
        trend: 'up',
        change: '+3.1%',
        demand: 'Good',
        seasonality: 'Regular season',
        recommendation: 'Monitor market for next week before making selling decisions.',
        marketOutlook: 'Positive outlook with steady demand.',
        competitors: 'Various producing states'
      })
      setLoading(false)
      toast.success(`Market data for ${crop} fetched successfully`)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Intelligence</h1>
        <p className="text-gray-600 mt-2">Real-time crop prices, trends, and profitability insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <select
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="">Select a crop</option>
              {crops.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Button onClick={fetchMarketData} disabled={loading}>
              {loading ? 'Fetching...' : 'Get Prices'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {marketData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-3xl font-bold text-green-600">
                      {marketData.price}
                      <span className="text-sm text-gray-500 ml-1">{marketData.priceUnit}</span>
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Price Trend</p>
                    <div className="flex items-center gap-2">
                      {marketData.trend === 'up' ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      ) : marketData.trend === 'down' ? (
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      ) : (
                        <span className="text-yellow-600">→</span>
                      )}
                      <span className="text-2xl font-bold">{marketData.change}</span>
                    </div>
                  </div>
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Market Demand</p>
                    <p className="text-2xl font-bold">{marketData.demand}</p>
                  </div>
                  {marketData.demand === 'High' && <TrendingUp className="h-12 w-12 text-green-600" />}
                  {marketData.demand === 'Moderate' && <span className="text-2xl text-yellow-600">→</span>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Competitors</p>
                    <p className="text-sm font-semibold">{marketData.competitors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Seasonality</h4>
                <p className="text-sm text-gray-700">{marketData.seasonality}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Market Outlook</h4>
                <p className="text-sm text-gray-700">{marketData.marketOutlook}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Selling Recommendation</h4>
                <p className="text-sm text-green-800">{marketData.recommendation}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Profitability Insights</h4>
                <p className="text-sm text-blue-800">
                  At current prices of ₹{marketData.price}/quintal, your estimated profit margin is 
                  {marketData.trend === 'up' ? ' favorable for immediate sale' : ' moderate. Consider storage options for better returns.'}
                  Compare with neighboring markets for best prices.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Market Tips & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Quality Matters</h4>
                <p className="text-xs text-gray-600">Graded produce fetches 15-20% higher prices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Timing is Key</h4>
                <p className="text-xs text-gray-600">Off-season selling can increase profits by 30-40%</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Collective Selling</h4>
                <p className="text-xs text-gray-600">Form farmer groups for better bargaining power</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Storage Investment</h4>
                <p className="text-xs text-gray-600">Scientific storage can significantly reduce post-harvest losses</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}