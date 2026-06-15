'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { Bell, Moon, Globe, Database, Shield, User, Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General Settings
    language: 'english',
    timezone: 'asia/kolkata',
    dateFormat: 'dd/mm/yyyy',
    
    // Notification Settings
    emailNotifications: true,
    weatherAlerts: true,
    marketAlerts: true,
    diseaseAlerts: true,
    documentUpdates: false,
    
    // Appearance Settings
    darkMode: false,
    compactView: false,
    fontSize: 'medium',
    
    // AI Settings
    aiModel: 'llama2',
    responseLength: 'balanced',
    ragConfidence: 70,
    autoSuggest: true,
    
    // Privacy Settings
    shareAnalytics: true,
    saveChatHistory: true,
    twoFactorAuth: false
  })

  const [profile, setProfile] = useState({
    name: 'John Farmer',
    email: 'john@example.com',
    phone: '+91 9876543210',
    farmLocation: 'Punjab, India',
    farmSize: '5 acres',
    primaryCrops: 'Wheat, Rice, Cotton'
  })

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} updated`)
  }

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const saveSettings = () => {
    toast.success('Settings saved successfully!')
    // Here you would make API call to save settings
  }

  const saveProfile = () => {
    toast.success('Profile updated successfully!')
    // Here you would make API call to save profile
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and application settings</p>
      </div>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'general' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <User className="inline h-4 w-4 mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'notifications' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Bell className="inline h-4 w-4 mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'appearance' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Moon className="inline h-4 w-4 mr-2" />
          Appearance
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'ai' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Database className="inline h-4 w-4 mr-2" />
          AI Settings
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'privacy' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Shield className="inline h-4 w-4 mr-2" />
          Privacy
        </button>
      </div>

      {activeTab === 'general' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and farm information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Farm Location</Label>
                  <Input
                    name="farmLocation"
                    value={profile.farmLocation}
                    onChange={handleProfileChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Farm Size</Label>
                  <Input
                    name="farmSize"
                    value={profile.farmSize}
                    onChange={handleProfileChange}
                    className="mt-1"
                    placeholder="e.g., 5 acres"
                  />
                </div>
                <div>
                  <Label>Primary Crops</Label>
                  <Input
                    name="primaryCrops"
                    value={profile.primaryCrops}
                    onChange={handleProfileChange}
                    className="mt-1"
                    placeholder="Comma separated"
                  />
                </div>
              </div>
              <Button onClick={saveProfile} className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Language</Label>
                  <select
                    className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                  </select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <select
                    className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="asia/kolkata">IST (UTC+5:30)</option>
                    <option value="asia/dubai">GST (UTC+4)</option>
                    <option value="asia/singapore">SGT (UTC+8)</option>
                  </select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <select
                    className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2"
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy/mm/dd">YYYY/MM/DD</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose which alerts you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Weather Alerts</h4>
                <p className="text-sm text-gray-500">Get notified about severe weather conditions</p>
              </div>
              <Switch
                checked={settings.weatherAlerts}
                onCheckedChange={(checked) => handleSettingChange('weatherAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Market Alerts</h4>
                <p className="text-sm text-gray-500">Price changes and market trends</p>
              </div>
              <Switch
                checked={settings.marketAlerts}
                onCheckedChange={(checked) => handleSettingChange('marketAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Disease Alerts</h4>
                <p className="text-sm text-gray-500">Crop disease outbreaks in your area</p>
              </div>
              <Switch
                checked={settings.diseaseAlerts}
                onCheckedChange={(checked) => handleSettingChange('diseaseAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium">Document Updates</h4>
                <p className="text-sm text-gray-500">When documents are processed</p>
              </div>
              <Switch
                checked={settings.documentUpdates}
                onCheckedChange={(checked) => handleSettingChange('documentUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>Customize how AgriMind AI looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-gray-500">Switch between light and dark theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Compact View</h4>
                <p className="text-sm text-gray-500">Show more content on screen</p>
              </div>
              <Switch
                checked={settings.compactView}
                onCheckedChange={(checked) => handleSettingChange('compactView', checked)}
              />
            </div>
            <div>
              <Label>Font Size</Label>
              <select
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2"
                value={settings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ai' && (
        <Card>
          <CardHeader>
            <CardTitle>AI Model Settings</CardTitle>
            <CardDescription>Configure how the AI assistant works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>AI Model</Label>
              <select
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2"
                value={settings.aiModel}
                onChange={(e) => handleSettingChange('aiModel', e.target.value)}
              >
                <option value="llama2">Llama 2 (Balanced)</option>
                <option value="mistral">Mistral (Fast)</option>
                <option value="codellama">CodeLlama (Technical)</option>
              </select>
            </div>
            <div>
              <Label>Response Length</Label>
              <select
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2"
                value={settings.responseLength}
                onChange={(e) => handleSettingChange('responseLength', e.target.value)}
              >
                <option value="concise">Concise</option>
                <option value="balanced">Balanced</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
            <div>
              <Label>RAG Confidence Threshold: {settings.ragConfidence}%</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.ragConfidence}
                onChange={(e) => handleSettingChange('ragConfidence', parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Lower values return more results, higher values return more accurate results</p>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium">Auto-suggest Questions</h4>
                <p className="text-sm text-gray-500">Show suggested questions based on context</p>
              </div>
              <Switch
                checked={settings.autoSuggest}
                onCheckedChange={(checked) => handleSettingChange('autoSuggest', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Share Anonymous Analytics</h4>
                <p className="text-sm text-gray-500">Help improve AgriMind AI</p>
              </div>
              <Switch
                checked={settings.shareAnalytics}
                onCheckedChange={(checked) => handleSettingChange('shareAnalytics', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">Save Chat History</h4>
                <p className="text-sm text-gray-500">Keep your conversation history</p>
              </div>
              <Switch
                checked={settings.saveChatHistory}
                onCheckedChange={(checked) => handleSettingChange('saveChatHistory', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
              />
            </div>
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={saveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}