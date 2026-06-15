'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Upload, Download, Leaf, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SoilAnalysisPage() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.name.includes('.xlsx') && !selectedFile.type.includes('spreadsheet')) {
      toast.error('Please upload an Excel file (.xlsx)')
      return
    }

    setFile(selectedFile)
    toast.success('File uploaded successfully')
  }

  const analyzeSoil = async () => {
    if (!file) {
      toast.error('Please upload a soil report first')
      return
    }

    setLoading(true)
    
    // Simulate analysis
    setTimeout(() => {
      setAnalysis({
        healthScore: 78,
        ph: 6.8,
        nitrogen: { value: 280, status: 'optimal', range: '250-350 kg/ha' },
        phosphorus: { value: 45, status: 'low', range: '50-70 kg/ha' },
        potassium: { value: 180, status: 'optimal', range: '150-250 kg/ha' },
        organicCarbon: { value: 0.8, status: 'low', range: '>1.0%' },
        recommendations: [
          'Apply phosphorus fertilizer (SSP or DAP) at 50 kg/ha',
          'Add organic manure to improve organic carbon levels',
          'Maintain current nitrogen and potassium application',
          'Consider green manuring for long-term soil health'
        ],
        suitableCrops: ['Wheat', 'Soybean', 'Cotton', 'Maize']
      })
      setLoading(false)
      toast.success('Soil analysis completed')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Soil Analysis</h1>
        <p className="text-gray-600 mt-2">Upload your soil report for comprehensive analysis and recommendations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Soil Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload your soil analysis report (Excel format)</p>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="soil-file"
              />
              <label htmlFor="soil-file">
                <Button variant="outline" as="span" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
              {file && (
                <p className="mt-2 text-sm text-green-600">✓ {file.name}</p>
              )}
            </div>

            <Button onClick={analyzeSoil} disabled={!file || loading} className="w-full">
              {loading ? 'Analyzing...' : 'Analyze Soil Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle>Soil Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600">{analysis.healthScore}</div>
                <p className="text-gray-600 mt-2">out of 100</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-green-600 rounded-full h-2" style={{ width: `${analysis.healthScore}%` }}></div>
                </div>
                <p className="mt-4 text-sm">
                  {analysis.healthScore >= 80 
                    ? 'Excellent soil health! Maintain current practices.' 
                    : analysis.healthScore >= 60 
                    ? 'Good soil health with room for improvement.'
                    : 'Needs attention. Follow recommendations for better soil health.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutrient Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">pH Level</span>
                      <span className="text-sm">{analysis.ph}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 rounded-full h-2" style={{ width: `${(analysis.ph / 14) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{analysis.ph > 7 ? 'Slightly alkaline' : 'Optimal range'}</p>
                  </div>

                  {Object.entries({ nitrogen: 'N', phosphorus: 'P', potassium: 'K' }).map(([key, label]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{label} - {key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className={`text-sm ${analysis[key].status === 'optimal' ? 'text-green-600' : 'text-orange-600'}`}>
                          {analysis[key].value} kg/ha
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {analysis[key].status === 'optimal' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                        )}
                        <p className="text-xs text-gray-500">{analysis[key].range}</p>
                      </div>
                    </div>
                  ))}

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Organic Carbon</span>
                      <span className={`text-sm ${analysis.organicCarbon.status === 'optimal' ? 'text-green-600' : 'text-orange-600'}`}>
                        {analysis.organicCarbon.value}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysis.organicCarbon.status === 'optimal' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                      <p className="text-xs text-gray-500">{analysis.organicCarbon.range}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Suitable Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.suitableCrops.map((crop, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {crop}
                  </span>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  💡 Based on your soil analysis, we recommend focusing on {analysis.suitableCrops[0]} and {analysis.suitableCrops[1]} for maximum yield. Apply the recommended fertilizers before sowing.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}