'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Upload, Camera, AlertTriangle, CheckCircle, Loader } from 'lucide-react'
import { toast } from 'sonner'

export default function DiseaseDetectionPage() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.includes('image')) {
      toast.error('Please upload an image file')
      return
    }

    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    setResult(null)
    toast.success('Image uploaded successfully')
  }

  const detectDisease = async () => {
    if (!image) {
      toast.error('Please upload a crop image first')
      return
    }

    setLoading(true)
    
    // Simulate YOLO disease detection
    setTimeout(() => {
      const diseases = [
        { name: 'Leaf Spot', severity: 'Moderate', confidence: 92, treatment: 'Apply copper-based fungicide. Remove infected leaves. Ensure proper spacing for air circulation.' },
        { name: 'Powdery Mildew', severity: 'Mild', confidence: 88, treatment: 'Apply sulfur or potassium bicarbonate based fungicide. Improve air circulation.' },
        { name: 'Bacterial Blight', severity: 'Severe', confidence: 85, treatment: 'Apply copper oxychloride. Remove and destroy infected plants. Avoid overhead irrigation.' },
        { name: 'Rust Disease', severity: 'Moderate', confidence: 90, treatment: 'Apply fungicides containing azoxystrobin or pyraclostrobin. Remove fallen leaves.' }
      ]
      
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)]
      
      setResult({
        disease: randomDisease.name,
        severity: randomDisease.severity,
        confidence: randomDisease.confidence,
        treatment: randomDisease.treatment,
        preventiveMeasures: [
          'Use disease-resistant varieties',
          'Practice crop rotation',
          'Maintain proper plant spacing',
          'Avoid overhead irrigation',
          'Remove crop residues after harvest'
        ]
      })
      setLoading(false)
      toast.success('Disease detection completed')
    }, 2000)
  }

  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'mild': return 'bg-yellow-100 text-yellow-800'
      case 'moderate': return 'bg-orange-100 text-orange-800'
      case 'severe': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Disease Detection</h1>
        <p className="text-gray-600 mt-2">Upload crop leaf images for AI-powered disease identification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Crop" className="max-h-64 mx-auto rounded-lg" />
                    <Button variant="outline" onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                      setResult(null)
                    }}>
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload a clear image of the crop leaf</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="disease-image"
                    />
                    <label htmlFor="disease-image">
                      <Button variant="outline" as="span" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </label>
                  </>
                )}
              </div>

              <Button 
                onClick={detectDisease} 
                disabled={!image || loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  'Detect Disease'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Detection Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900">{result.disease}</h3>
                <div className="flex justify-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {result.confidence}% Confidence
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Treatment Recommendations</h4>
                  <p className="text-sm text-gray-700">{result.treatment}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Preventive Measures</h4>
                  <ul className="space-y-1">
                    {result.preventiveMeasures.map((measure, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>

                {result.severity === 'Severe' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Urgent Action Required</p>
                        <p className="text-sm text-red-800">This is a severe infection. Take immediate action to prevent spread to healthy plants.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Tips for Better Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Take photos in natural daylight for better clarity</li>
            <li>• Capture both top and bottom sides of the leaf</li>
            <li>• Include healthy leaves for comparison if possible</li>
            <li>• Ensure the image is clear and focused on the affected area</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}