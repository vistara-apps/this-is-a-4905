import React, { useState } from 'react'
import { 
  Clock, 
  MapPin, 
  Phone, 
  Navigation, 
  AlertCircle,
  Heart,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Map } from '../components/Map'
import { useData } from '../contexts/DataContext'

export function UrgentCare() {
  const [selectedFacility, setSelectedFacility] = useState(null)
  const { facilities } = useData()

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'text-success bg-green-50'
      case 'Busy': return 'text-orange-600 bg-orange-50'
      case 'Full': return 'text-error bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getWaitTimeColor = (waitTime) => {
    const minutes = parseInt(waitTime)
    if (minutes <= 20) return 'text-success'
    if (minutes <= 45) return 'text-orange-600'
    return 'text-error'
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="heading-1 mb-2">Urgent Care & Emergency Services</h1>
          <p className="body text-text-secondary">Find immediate medical care when you need it most</p>
        </div>

        {/* Emergency Alert */}
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-error flex-shrink-0 mt-1" />
              <div>
                <h3 className="heading-2 text-error mb-2">Medical Emergency?</h3>
                <p className="body mb-4">
                  If you're experiencing a life-threatening emergency, call 911 immediately.
                </p>
                <Button variant="destructive">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="heading-2 mb-2">Urgent Care</h3>
              <p className="caption text-text-secondary mb-4">
                Non-life threatening conditions
              </p>
              <p className="text-sm mb-4">• Minor injuries • Fever • Cold/Flu</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <Activity className="w-12 h-12 text-error mx-auto mb-4" />
              <h3 className="heading-2 mb-2">Emergency Room</h3>
              <p className="caption text-text-secondary mb-4">
                Serious or life-threatening conditions
              </p>
              <p className="text-sm mb-4">• Chest pain • Severe injury • Stroke</p>
            </CardContent>
          </Card>
        </div>

        {/* Facilities List and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Facilities List */}
          <div className="space-y-4">
            <h2 className="heading-2">Nearby Facilities</h2>
            
            {facilities.map((facility) => (
              <Card 
                key={facility.facilityId}
                className={`transition-all cursor-pointer ${
                  selectedFacility?.facilityId === facility.facilityId ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedFacility(facility)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="heading-2 mb-1">{facility.name}</h3>
                      <Badge 
                        className={facility.type === 'Emergency Room' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
                      >
                        {facility.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getWaitTimeColor(facility.currentWaitTime)}`}>
                        {facility.currentWaitTime} wait
                      </div>
                      <Badge className={getStatusColor(facility.capacityStatus)}>
                        {facility.capacityStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center text-text-secondary mb-4">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="caption">{facility.address}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>

                  {facility.capacityStatus === 'Available' && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-success mr-2" />
                        <span className="text-sm text-success">
                          Currently accepting patients
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map */}
          <div>
            <h2 className="heading-2 mb-4">Map View</h2>
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <Map 
                  providers={facilities.map(f => ({
                    providerId: f.facilityId,
                    name: f.name,
                    address: f.address,
                    type: f.type
                  }))}
                  selectedProvider={selectedFacility ? {
                    providerId: selectedFacility.facilityId
                  } : null}
                  onProviderSelect={(facility) => {
                    const original = facilities.find(f => f.facilityId === facility.providerId)
                    setSelectedFacility(original)
                  }}
                  className="h-96"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="heading-2">When to Use Urgent Care vs Emergency Room</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="heading-2 text-primary mb-3">Urgent Care</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Minor cuts and burns</li>
                  <li>• Sprains and strains</li>
                  <li>• Fever and flu symptoms</li>
                  <li>• Ear and eye infections</li>
                  <li>• Minor allergic reactions</li>
                  <li>• Urinary tract infections</li>
                </ul>
              </div>
              <div>
                <h3 className="heading-2 text-error mb-3">Emergency Room</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Chest pain or difficulty breathing</li>
                  <li>• Severe injuries or trauma</li>
                  <li>• Signs of stroke or heart attack</li>
                  <li>• Severe allergic reactions</li>
                  <li>• High fever with confusion</li>
                  <li>• Sudden severe headache</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}