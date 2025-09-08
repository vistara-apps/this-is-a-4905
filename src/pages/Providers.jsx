import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Phone, 
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import { Map } from '../components/Map'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

export function Providers() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '')
  const [specialty, setSpecialty] = useState('')
  const [insurance, setInsurance] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [filteredProviders, setFilteredProviders] = useState([])

  const { providers, searchProviders, bookAppointment } = useData()
  const { isSubscribed } = useAuth()

  useEffect(() => {
    const results = searchProviders(searchQuery, { specialty, insurance })
    setFilteredProviders(results)
  }, [searchQuery, specialty, insurance, providers, searchProviders])

  const handleBookAppointment = (provider) => {
    if (!isSubscribed) {
      alert('Premium subscription required for direct booking. Please upgrade!')
      return
    }
    
    const appointmentDate = new Date()
    appointmentDate.setDate(appointmentDate.getDate() + 1)
    appointmentDate.setHours(10, 0, 0, 0)
    
    bookAppointment(provider.providerId, appointmentDate.toISOString())
    alert(`Appointment booked with ${provider.name} for tomorrow at 10:00 AM`)
  }

  const specialties = ['Family Medicine', 'Internal Medicine', 'Cardiology', 'Dermatology', 'Pediatrics']
  const insuranceOptions = ['Blue Cross', 'Aetna', 'Kaiser', 'United', 'Cigna']

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="heading-1 mb-2">Find Healthcare Providers</h1>
          <p className="body text-text-secondary">Discover and connect with local healthcare professionals</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <Input
                  variant="withIcon"
                  icon={<Search className="w-4 h-4 text-gray-400" />}
                  placeholder="Search providers, specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'primary' : 'outline'}
                  onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-2">Specialty</label>
                    <Select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                      <option value="">All Specialties</option>
                      {specialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Insurance</label>
                    <Select value={insurance} onChange={(e) => setInsurance(e.target.value)}>
                      <option value="">All Insurance</option>
                      {insuranceOptions.map(ins => (
                        <option key={ins} value={ins}>{ins}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('')
                        setSpecialty('')
                        setInsurance('')
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider List */}
          <div className={`${viewMode === 'map' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
            {filteredProviders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="heading-2 mb-2">No providers found</h3>
                  <p className="text-text-secondary">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredProviders.map((provider) => (
                <Card 
                  key={provider.providerId}
                  className={`transition-all cursor-pointer ${
                    selectedProvider?.providerId === provider.providerId ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedProvider(provider)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="heading-2 mb-1">{provider.name}</h3>
                        <p className="caption text-text-secondary mb-2">{provider.specialty}</p>
                        
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{provider.reviews.rating}</span>
                          <span className="text-sm text-text-secondary">({provider.reviews.count} reviews)</span>
                        </div>

                        <div className="flex items-center text-text-secondary mb-3">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="caption">{provider.address}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {provider.insuranceAccepted.slice(0, 3).map(ins => (
                            <Badge key={ins} variant="outline">{ins}</Badge>
                          ))}
                          {provider.insuranceAccepted.length > 3 && (
                            <Badge variant="outline">+{provider.insuranceAccepted.length - 3} more</Badge>
                          )}
                        </div>

                        {provider.onlineBookingAvailable && (
                          <div className="flex items-center text-success mb-3">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="caption">Online booking available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-text-secondary">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="caption">Next: Tomorrow 10:00 AM</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        {provider.onlineBookingAvailable && (
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBookAppointment(provider)
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {isSubscribed ? 'Book' : 'Upgrade to Book'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <Map 
                    providers={filteredProviders}
                    selectedProvider={selectedProvider}
                    onProviderSelect={setSelectedProvider}
                    className="h-96"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}