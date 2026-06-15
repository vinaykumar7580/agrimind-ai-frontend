'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Upload, FileText, Search, Trash2, Download, Eye, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Wheat_Cultivation_Guide.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'indexed',
      pages: 45,
      category: 'Crop Guide'
    },
    {
      id: 2,
      name: 'Soil_Health_Report_Spring.xlsx',
      type: 'excel',
      size: '1.2 MB',
      uploadDate: '2024-01-10',
      status: 'indexed',
      category: 'Soil Report'
    },
    {
      id: 3,
      name: 'Government_Schemes_2024.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadDate: '2024-01-05',
      status: 'processing',
      pages: 120,
      category: 'Policy'
    },
    {
      id: 4,
      name: 'Pest_Management_Research.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: '2023-12-28',
      status: 'indexed',
      pages: 32,
      category: 'Research'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDoc, setSelectedDoc] = useState(null)

  const categories = ['all', 'Crop Guide', 'Soil Report', 'Policy', 'Research', 'Manual']

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF or Excel files only')
      return
    }

    setUploading(true)
    
    // Simulate upload and processing
    setTimeout(() => {
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'excel',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'indexed',
        pages: Math.floor(Math.random() * 100) + 10,
        category: 'Uploaded'
      }
      
      setDocuments([newDoc, ...documents])
      setUploading(false)
      toast.success('Document uploaded and indexed successfully!')
    }, 2000)
  }

  const handleDeleteDocument = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setDocuments(documents.filter(doc => doc.id !== id))
      toast.success('Document deleted successfully')
    }
  }

  const handleViewDocument = (doc) => {
    setSelectedDoc(doc)
    toast.info(`Opening ${doc.name}...`)
  }

  const getFileIcon = (type) => {
    if (type === 'pdf') return <FileText className="h-8 w-8 text-red-500" />
    return <FileText className="h-8 w-8 text-green-500" />
  }

  const getStatusBadge = (status) => {
    if (status === 'indexed') {
      return <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="h-3 w-3" /> Indexed</span>
    }
    return <span className="flex items-center gap-1 text-yellow-600 text-xs"><Loader className="h-3 w-3 animate-spin" /> Processing</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage your agricultural documents for RAG-based querying</p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.xlsx,.xls"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Button disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Documents</p>
                <p className="text-3xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pages</p>
                <p className="text-3xl font-bold">{documents.reduce((sum, doc) => sum + (doc.pages || 0), 0)}</p>
              </div>
              <FileText className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="text-3xl font-bold">8.5 MB</p>
              </div>
              <FileText className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Knowledge Base</p>
                <p className="text-3xl font-bold">Active</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No documents found</p>
              <p className="text-sm text-gray-400 mt-1">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {getFileIcon(doc.type)}
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-gray-500">{doc.size}</p>
                        <p className="text-xs text-gray-500">📅 {doc.uploadDate}</p>
                        {doc.pages && <p className="text-xs text-gray-500">📄 {doc.pages} pages</p>}
                        <p className="text-xs text-gray-500">🏷️ {doc.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(doc.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDocument(doc.id, doc.name)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Base Info */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">How Document RAG Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="font-semibold text-sm mb-1">1. Upload</h4>
              <p className="text-xs text-blue-800">Upload PDF or Excel documents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="font-semibold text-sm mb-1">2. Process</h4>
              <p className="text-xs text-blue-800">Extract text and create embeddings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="font-semibold text-sm mb-1">3. Query</h4>
              <p className="text-xs text-blue-800">Ask questions and get answers from documents</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}