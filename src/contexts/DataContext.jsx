import React, { createContext, useContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    // Simulate API calls
    const timer = setTimeout(() => {
      setProviders(mockProviders)
      setFacilities(mockFacilities)
      setPrograms(mockPrograms)
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
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const bookAppointment = (providerId, dateTime) => {
    const provider = providers.find(p => p.providerId === providerId)
    const newAppointment = {
      appointmentId: Date.now().toString(),
      userId: '1',
      providerId,
      dateTime,
      status: 'confirmed',
      provider
    }
    setAppointments(prev => [...prev, newAppointment])
    return newAppointment
  }

  const cancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.appointmentId !== appointmentId))
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
    providers,
    facilities,
    programs,
    appointments,
    loading,
    bookAppointment,
    cancelAppointment,
    searchProviders
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}