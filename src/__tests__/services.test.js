/**
 * Service Layer Tests
 * Tests for all service integrations and API functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  apiService, 
  googleMapsService, 
  stripeService, 
  openFDAService, 
  appointmentService 
} from '../services'

// Mock fetch globally
global.fetch = vi.fn()

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should make GET requests with query parameters', async () => {
    const mockResponse = { data: 'test' }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await apiService.get('/test', { param: 'value' })
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test?param=value'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('should make POST requests with JSON body', async () => {
    const mockResponse = { success: true }
    const postData = { name: 'test' }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await apiService.post('/test', postData)
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    await expect(apiService.get('/nonexistent')).rejects.toThrow('HTTP error! status: 404')
  })
})

describe('Google Maps Service', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should geocode addresses successfully', async () => {
    const mockResponse = {
      status: 'OK',
      results: [{
        geometry: {
          location: { lat: 37.7749, lng: -122.4194 }
        },
        formatted_address: 'San Francisco, CA, USA',
        place_id: 'test_place_id'
      }]
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await googleMapsService.geocodeAddress('San Francisco, CA')
    
    expect(result).toEqual({
      lat: 37.7749,
      lng: -122.4194,
      formattedAddress: 'San Francisco, CA, USA',
      placeId: 'test_place_id'
    })
  })

  it('should search nearby healthcare providers', async () => {
    const mockResponse = {
      status: 'OK',
      results: [{
        place_id: 'test_place_id',
        name: 'Test Hospital',
        vicinity: '123 Test St',
        geometry: {
          location: { lat: 37.7749, lng: -122.4194 }
        },
        rating: 4.5,
        user_ratings_total: 100,
        types: ['hospital', 'health'],
        opening_hours: { open_now: true }
      }]
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await googleMapsService.searchNearbyHealthcare(37.7749, -122.4194, 'hospital')
    
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      placeId: 'test_place_id',
      name: 'Test Hospital',
      address: '123 Test St',
      location: { lat: 37.7749, lng: -122.4194 },
      rating: 4.5,
      userRatingsTotal: 100,
      types: ['hospital', 'health'],
      openNow: true,
      priceLevel: undefined
    })
  })

  it('should fallback to mock data when API fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await googleMapsService.geocodeAddress('Test Address')
    
    expect(result).toHaveProperty('lat')
    expect(result).toHaveProperty('lng')
    expect(result).toHaveProperty('formattedAddress', 'Test Address')
    expect(result.placeId).toMatch(/^mock_/)
  })

  it('should get current location with geolocation API', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => {
        success({
          coords: {
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 10
          }
        })
      })
    }

    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true
    })

    const result = await googleMapsService.getCurrentLocation()
    
    expect(result).toEqual({
      lat: 37.7749,
      lng: -122.4194,
      accuracy: 10
    })
  })
})

describe('Stripe Service', () => {
  it('should return pricing plans', () => {
    const plans = stripeService.getPricingPlans()
    
    expect(plans).toHaveLength(2)
    expect(plans[0]).toEqual({
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Basic provider directory',
        'Location search',
        'Basic filtering',
        'Up to 5 searches per day'
      ],
      limitations: [
        'Limited search results',
        'No direct booking',
        'Basic support'
      ]
    })
    expect(plans[1]).toEqual({
      id: 'premium',
      name: 'Premium',
      price: 5,
      interval: 'month',
      stripePriceId: 'price_premium_monthly',
      features: [
        'Unlimited provider search',
        'Advanced filtering',
        'Direct appointment booking',
        'Real-time availability',
        'Insurance verification',
        'Priority support',
        'Appointment reminders',
        'Health program recommendations'
      ],
      popular: true
    })
  })

  it('should create mock payment method when Stripe is not available', async () => {
    const result = await stripeService.createPaymentMethod({})
    
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('type', 'card')
    expect(result).toHaveProperty('card')
    expect(result.card).toHaveProperty('brand', 'visa')
    expect(result.card).toHaveProperty('last4', '4242')
    expect(result).toHaveProperty('mock', true)
  })
})

describe('OpenFDA Service', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should search drugs successfully', async () => {
    const mockResponse = {
      results: [{
        application_number: 'NDA021436',
        openfda: {
          brand_name: ['Lipitor'],
          generic_name: ['atorvastatin calcium'],
          manufacturer_name: ['Pfizer Inc'],
          substance_name: ['atorvastatin calcium'],
          dosage_form: ['tablet'],
          route: ['oral']
        }
      }]
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await openFDAService.searchDrugs('lipitor')
    
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'NDA021436',
      brandName: 'Lipitor',
      genericName: 'atorvastatin calcium',
      manufacturer: 'Pfizer Inc',
      activeIngredient: 'atorvastatin calcium',
      dosageForm: 'tablet',
      route: 'oral'
    })
  })

  it('should get health programs', async () => {
    const result = await openFDAService.getHealthPrograms('San Francisco, CA')
    
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('programId')
    expect(result[0]).toHaveProperty('name')
    expect(result[0]).toHaveProperty('description')
    expect(result[0]).toHaveProperty('eligibility')
    expect(result[0]).toHaveProperty('contactInfo')
  })

  it('should search device recalls', async () => {
    const mockResponse = {
      results: [{
        recall_number: 'Z-1234-2024',
        product_description: 'Blood Glucose Monitoring System',
        reason_for_recall: 'Potential for inaccurate readings',
        recall_initiation_date: '2024-01-15',
        classification: 'Class II',
        status: 'Ongoing',
        recalling_firm: 'Medical Device Corp'
      }]
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await openFDAService.searchDeviceRecalls('glucose monitor')
    
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'Z-1234-2024',
      productDescription: 'Blood Glucose Monitoring System',
      reason: 'Potential for inaccurate readings',
      recallDate: '2024-01-15',
      classification: 'Class II',
      status: 'Ongoing',
      company: 'Medical Device Corp'
    })
  })
})

describe('Appointment Service', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should get available slots', async () => {
    const result = await appointmentService.getAvailableSlots('provider_1', '2024-01-15')
    
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('dateTime')
    expect(result[0]).toHaveProperty('duration')
    expect(result[0]).toHaveProperty('available', true)
  })

  it('should book appointments', async () => {
    const appointmentData = {
      userId: 'user_1',
      providerId: 'provider_1',
      dateTime: '2024-01-15T10:00:00Z',
      type: 'consultation'
    }

    const result = await appointmentService.bookAppointment(appointmentData)
    
    expect(result).toHaveProperty('appointmentId')
    expect(result).toHaveProperty('status', 'confirmed')
    expect(result).toHaveProperty('confirmationNumber')
    expect(result).toHaveProperty('dateTime', appointmentData.dateTime)
    expect(result).toHaveProperty('instructions')
    expect(result.instructions).toBeInstanceOf(Array)
  })

  it('should cancel appointments', async () => {
    const result = await appointmentService.cancelAppointment('apt_123')
    
    expect(result).toHaveProperty('appointmentId', 'apt_123')
    expect(result).toHaveProperty('status', 'cancelled')
    expect(result).toHaveProperty('cancellationDate')
    expect(result).toHaveProperty('message')
  })

  it('should verify insurance', async () => {
    const result = await appointmentService.verifyInsurance('provider_1', { plan: 'Blue Cross' })
    
    expect(result).toHaveProperty('verified', true)
    expect(result).toHaveProperty('accepted')
    expect(result).toHaveProperty('message')
    
    if (result.accepted) {
      expect(result).toHaveProperty('copay')
      expect(result).toHaveProperty('coveragePercentage')
    }
  })

  it('should get user appointments', async () => {
    const result = await appointmentService.getUserAppointments('user_1')
    
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('appointmentId')
    expect(result[0]).toHaveProperty('providerId')
    expect(result[0]).toHaveProperty('providerName')
    expect(result[0]).toHaveProperty('dateTime')
    expect(result[0]).toHaveProperty('status')
  })
})

describe('Service Integration', () => {
  it('should handle network failures gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    // All services should fallback to mock data
    const geocodeResult = await googleMapsService.geocodeAddress('Test')
    const drugsResult = await openFDAService.searchDrugs('test')
    const slotsResult = await appointmentService.getAvailableSlots('provider_1', '2024-01-15')

    expect(geocodeResult).toBeDefined()
    expect(drugsResult).toBeInstanceOf(Array)
    expect(slotsResult).toBeInstanceOf(Array)
  })

  it('should maintain consistent data formats across services', async () => {
    const healthPrograms = await openFDAService.getHealthPrograms('San Francisco')
    const appointments = await appointmentService.getUserAppointments('user_1')
    const places = await googleMapsService.searchNearbyHealthcare(37.7749, -122.4194)

    // Check that all services return arrays for list operations
    expect(healthPrograms).toBeInstanceOf(Array)
    expect(appointments).toBeInstanceOf(Array)
    expect(places).toBeInstanceOf(Array)

    // Check that objects have consistent ID fields
    if (healthPrograms.length > 0) {
      expect(healthPrograms[0]).toHaveProperty('programId')
    }
    if (appointments.length > 0) {
      expect(appointments[0]).toHaveProperty('appointmentId')
    }
    if (places.length > 0) {
      expect(places[0]).toHaveProperty('placeId')
    }
  })
})
