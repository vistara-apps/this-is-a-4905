import React, { useState } from 'react'
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  MapPin, 
  Shield,
  Star,
  Calendar,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import { useAuth } from '../contexts/AuthContext'

export function Profile() {
  const { user, isSubscribed, subscribe, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!user) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="container py-6">
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="heading-2 mb-2">Sign in to your account</h3>
              <p className="text-text-secondary mb-4">
                Access your profile, appointments, and subscription settings.
              </p>
              <Button>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="heading-1 mb-2">Profile Settings</h1>
          <p className="body text-text-secondary">
            Manage your account, preferences, and subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <h2 className="heading-2">Profile Information</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input defaultValue={user.name} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input defaultValue={user.email} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <Input 
                        variant="withIcon"
                        icon={<MapPin className="w-4 h-4 text-gray-400" />}
                        defaultValue={user.preferences?.location}
                        placeholder="Enter your location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Insurance</label>
                      <Select defaultValue={user.preferences?.insurance}>
                        <option value="">Select insurance</option>
                        <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                        <option value="Aetna">Aetna</option>
                        <option value="Kaiser">Kaiser</option>
                        <option value="United">United Healthcare</option>
                        <option value="Cigna">Cigna</option>
                      </Select>
                    </div>

                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="heading-2">Subscription Status</h2>
                      <Badge className={isSubscribed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {isSubscribed ? 'Premium' : 'Free'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isSubscribed ? (
                      <div>
                        <p className="body mb-4">
                          You have access to all premium features including direct appointment booking, 
                          priority support, and advanced filtering.
                        </p>
                        <div className="flex items-center space-x-4">
                          <Button variant="outline">Manage Billing</Button>
                          <Button variant="destructive">Cancel Subscription</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="body mb-4">
                          Upgrade to premium for enhanced features and priority support.
                        </p>
                        <Button onClick={subscribe}>
                          Upgrade to Premium - $5/month
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Features Comparison */}
                <Card>
                  <CardHeader>
                    <h2 className="heading-2">Features</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-2 text-gray-400" />
                          Provider Directory Access
                        </span>
                        <div className="flex space-x-4">
                          <span className="text-success">✓ Free</span>
                          <span className="text-success">✓ Premium</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Direct Appointment Booking
                        </span>
                        <div className="flex space-x-4">
                          <span className="text-gray-400">✗ Free</span>
                          <span className="text-success">✓ Premium</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-gray-400" />
                          Advanced Filtering
                        </span>
                        <div className="flex space-x-4">
                          <span className="text-gray-400">✗ Free</span>
                          <span className="text-success">✓ Premium</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-gray-400" />
                          Priority Support
                        </span>
                        <div className="flex space-x-4">
                          <span className="text-gray-400">✗ Free</span>
                          <span className="text-success">✓ Premium</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <Card>
                <CardHeader>
                  <h2 className="heading-2">Preferences</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Search Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Preferred Search Radius</label>
                          <Select defaultValue="10">
                            <option value="5">5 miles</option>
                            <option value="10">10 miles</option>
                            <option value="25">25 miles</option>
                            <option value="50">50 miles</option>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Default View</label>
                          <Select defaultValue="list">
                            <option value="list">List View</option>
                            <option value="map">Map View</option>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Appointment Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Preferred Time</label>
                          <Select defaultValue="morning">
                            <option value="morning">Morning (8AM - 12PM)</option>
                            <option value="afternoon">Afternoon (12PM - 5PM)</option>
                            <option value="evening">Evening (5PM - 8PM)</option>
                            <option value="any">Any Time</option>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <h2 className="heading-2">Notification Settings</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Email Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          Appointment reminders
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          Appointment confirmations
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          New provider recommendations
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          Health program updates
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">SMS Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          Appointment reminders (24h before)
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          Emergency alerts
                        </label>
                      </div>
                    </div>

                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}