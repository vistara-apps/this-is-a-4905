import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  googleMapsService, 
  openFDAService, 
  appointmentService 
} from '../services'

const DataContext = createContext()

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Mock data
const mockProviders = [
  {
    providerId: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    address: '123 Health St, San Francisco, CA 94102',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'contact@drjohnson.com'
    },
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Kaiser'],
    onlineBookingAvailable: true,
    reviews: {
      rating: 4.8,
      count: 127
    },
    nextAvailable: '2024-01-15T10:00:00Z'
  },
  {
    providerId: '2',
    name: 'SF Medical Center',
    specialty: 'Internal Medicine',
    address: '456 Care Ave, San Francisco, CA 94103',
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'info@sfmedical.com'
    },
    insuranceAccepted: ['Blue Cross', 'United', 'Cigna'],
    onlineBookingAvailable: true,
    reviews: {
      rating: 4.6,
      count: 89
    },
    nextAvailable: '2024-01-16T14:30:00Z'
  },
  {
    providerId: '3',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    address: '789 Heart Blvd, San Francisco, CA 94104',
    contactInfo: {
      phone: '(555) 345-6789',
      email: 'office@drchen.com'
    },
    insuranceAccepted: ['Kaiser', 'Aetna', 'Blue Cross'],
    onlineBookingAvailable: false,
    reviews: {
      rating: 4.9,
      count: 156
    },
    nextAvailable: '2024-01-18T09:00:00Z'
  }
]

const mockFacilities = [
  {
    facilityId: '1',
    name: 'SF General Urgent Care',
    type: 'Urgent Care',
    address: '1001 Emergency Way, San Francisco, CA 94110',
    contactInfo: {
      phone: '(555) 911-1234'
    },
    currentWaitTime: '15 mins',
    capacityStatus: 'Available'
  },
  {
    facilityId: '2',
    name: 'Bay Area Emergency',
    type: 'Emergency Room',
    address: '2002 Critical St, San Francisco, CA 94111',
    contactInfo: {
      phone: '(555) 911-5678'
    },
    currentWaitTime: '45 mins',
    capacityStatus: 'Busy'
  }
]

const mockPrograms = [
  {
    programId: '1',
    name: 'Free Health Screenings',
    description: 'Annual community health screenings including blood pressure, cholesterol, and diabetes testing.',
    eligibility: 'Open to all residents',
    location: 'Community Center, 500 Public Health Dr',
    contactInfo: {
      phone: '(555) 555-0123'
    }
  },
  {
    programId: '2',
    name: 'Mental Health Support Group',
    description: 'Weekly support groups for anxiety and depression management.',
    eligibility: 'Adults 18+ experiencing mental health challenges',
    location: 'Wellness Center, 600 Mind St',
    contactInfo: {
      phone: '(555) 555-0124'
    }
  }
]

export function DataProvider({ children }) {
  const [providers, setProviders] = useState([])
  const [facilities, setFacilities] = useState([])
  const [programs, setPrograms] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    // Initialize location and load initial data
    initializeData()
  }, [])

  const initializeData = async () => {
    setLoading(true)
    try {
      // Get user's current location
      const location = await googleMapsService.getCurrentLocation()
      setUserLocation(location)

      // Load initial mock data
      setProviders(mockProviders)
      setFacilities(mockFacilities)
      setAppointments([
        {
          appointmentId: '1',
          userId: '1',
          providerId: '1',
          dateTime: '2024-01-15T10:00:00Z',
          status: 'confirmed',
          provider: mockProviders[0]
        }
      ])

      // Load health programs for the user's location
      const healthPrograms = await openFDAService.getHealthPrograms('San Francisco, CA')
      setPrograms([...mockPrograms, ...healthPrograms])
    } catch (error) {
      console.error('Error initializing data:', error)
      // Fallback to mock data
      setProviders(mockProviders)
      setFacilities(mockFacilities)
      setPrograms(mockPrograms)
    } finally {
      setLoading(false)
    }
  }

  const searchNearbyProviders = async (query, type = 'hospital', radius = 5000) => {
    if (!userLocation) return []

    setLoading(true)
    try {
      const results = await googleMapsService.searchNearbyHealthcare(
        userLocation.lat,
        userLocation.lng,
        type,
        radius
      )
      setSearchResults(results)
      return results
    } catch (error) {
      console.error('Error searching providers:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const geocodeAddress = async (address) => {
    try {
      return await googleMapsService.geocodeAddress(address)
    } catch (error) {
      console.error('Error geocoding address:', error)
      return null
    }
  }

  const bookAppointment = async (appointmentData) => {
    setLoading(true)
    try {
      const confirmation = await appointmentService.bookAppointment(appointmentData)
      
      // Add the new appointment to local state
      const provider = providers.find(p => p.providerId === appointmentData.providerId)
      const newAppointment = {
        appointmentId: confirmation.appointmentId,
        userId: appointmentData.userId,
        providerId: appointmentData.providerId,
        dateTime: appointmentData.dateTime,
        status: 'confirmed',
        type: appointmentData.type || 'consultation',
        confirmationNumber: confirmation.confirmationNumber,
        provider
      }
      
      setAppointments(prev => [...prev, newAppointment])
      return confirmation
    } catch (error) {
      console.error('Error booking appointment:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    setLoading(true)
    try {
      const confirmation = await appointmentService.cancelAppointment(appointmentId)
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.appointmentId === appointmentId 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      )
      
      return confirmation
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getAvailableSlots = async (providerId, date) => {
    try {
      return await appointmentService.getAvailableSlots(providerId, date)
    } catch (error) {
      console.error('Error fetching available slots:', error)
      return []
    }
  }

  const verifyInsurance = async (providerId, insuranceInfo) => {
    try {
      return await appointmentService.verifyInsurance(providerId, insuranceInfo)
    } catch (error) {
      console.error('Error verifying insurance:', error)
      return { verified: false, message: 'Unable to verify insurance at this time' }
    }
  }

  const searchDrugs = async (query) => {
    try {
      return await openFDAService.searchDrugs(query)
    } catch (error) {
      console.error('Error searching drugs:', error)
      return []
    }
  }

  const searchRecalls = async (query, type = 'device') => {
    try {
      if (type === 'device') {
        return await openFDAService.searchDeviceRecalls(query)
      } else if (type === 'food') {
        return await openFDAService.searchFoodRecalls(query)
      }
      return []
    } catch (error) {
      console.error('Error searching recalls:', error)
      return []
    }
  }

  const searchProviders = (query, filters = {}) => {
    let filtered = providers

    if (query) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(query.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (filters.specialty) {
      filtered = filtered.filter(provider => 
        provider.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      )
    }

    if (filters.insurance) {
      filtered = filtered.filter(provider =>
        provider.insuranceAccepted.some(ins => 
          ins.toLowerCase().includes(filters.insurance.toLowerCase())
        )
      )
    }

    return filtered
  }

  const value = {
    // Data
    providers,
    facilities,
    programs,
    appointments,
    userLocation,
    searchResults,
    loading,
    
    // Setters
    setProviders,
    setFacilities,
    setPrograms,
    setAppointments,
    
    // Methods
    searchNearbyProviders,
    geocodeAddress,
    bookAppointment,
    cancelAppointment,
    getAvailableSlots,
    verifyInsurance,
    searchDrugs,
    searchRecalls,
    searchProviders,
    initializeData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
