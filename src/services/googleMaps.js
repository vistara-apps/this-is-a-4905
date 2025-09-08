import { API_CONFIG } from './api.js'

class GoogleMapsService {
  constructor() {
    this.apiKey = API_CONFIG.GOOGLE_MAPS_API_KEY
    this.geocodingBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
    this.placesBaseUrl = 'https://maps.googleapis.com/maps/api/place'
  }

  /**
   * Geocode an address to get coordinates
   * @param {string} address - The address to geocode
   * @returns {Promise<Object>} - Geocoding result with lat/lng
   */
  async geocodeAddress(address) {
    if (!this.apiKey) {
      console.warn('Google Maps API key not configured')
      return this.getMockGeocoding(address)
    }

    try {
      const params = new URLSearchParams({
        address,
        key: this.apiKey
      })

      const response = await fetch(`${this.geocodingBaseUrl}?${params}`)
      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
          placeId: result.place_id
        }
      } else {
        throw new Error(`Geocoding failed: ${data.status}`)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      return this.getMockGeocoding(address)
    }
  }

  /**
   * Search for nearby healthcare providers using Places API
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {string} type - Place type (hospital, doctor, pharmacy, etc.)
   * @param {number} radius - Search radius in meters
   * @returns {Promise<Array>} - Array of places
   */
  async searchNearbyHealthcare(lat, lng, type = 'hospital', radius = 5000) {
    if (!this.apiKey) {
      console.warn('Google Maps API key not configured')
      return this.getMockPlaces(type)
    }

    try {
      const params = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: radius.toString(),
        type,
        key: this.apiKey
      })

      const response = await fetch(`${this.placesBaseUrl}/nearbysearch/json?${params}`)
      const data = await response.json()

      if (data.status === 'OK') {
        return data.results.map(place => ({
          placeId: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
          types: place.types,
          openNow: place.opening_hours?.open_now,
          priceLevel: place.price_level
        }))
      } else {
        throw new Error(`Places search failed: ${data.status}`)
      }
    } catch (error) {
      console.error('Places search error:', error)
      return this.getMockPlaces(type)
    }
  }

  /**
   * Get detailed information about a place
   * @param {string} placeId - Google Places ID
   * @returns {Promise<Object>} - Detailed place information
   */
  async getPlaceDetails(placeId) {
    if (!this.apiKey) {
      console.warn('Google Maps API key not configured')
      return this.getMockPlaceDetails(placeId)
    }

    try {
      const params = new URLSearchParams({
        place_id: placeId,
        fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,reviews',
        key: this.apiKey
      })

      const response = await fetch(`${this.placesBaseUrl}/details/json?${params}`)
      const data = await response.json()

      if (data.status === 'OK') {
        const place = data.result
        return {
          name: place.name,
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          website: place.website,
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
          openingHours: place.opening_hours?.weekday_text || [],
          reviews: place.reviews?.slice(0, 5) || []
        }
      } else {
        throw new Error(`Place details failed: ${data.status}`)
      }
    } catch (error) {
      console.error('Place details error:', error)
      return this.getMockPlaceDetails(placeId)
    }
  }

  /**
   * Get user's current location
   * @returns {Promise<Object>} - User's coordinates
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to San Francisco coordinates
          resolve({
            lat: 37.7749,
            lng: -122.4194,
            accuracy: null,
            fallback: true
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Mock data for development/fallback
  getMockGeocoding(address) {
    return {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
      formattedAddress: address,
      placeId: `mock_${Date.now()}`
    }
  }

  getMockPlaces(type) {
    const mockPlaces = [
      {
        placeId: 'mock_1',
        name: 'SF General Hospital',
        address: '1001 Potrero Ave, San Francisco, CA',
        location: { lat: 37.7562, lng: -122.4041 },
        rating: 4.2,
        userRatingsTotal: 1250,
        types: ['hospital', 'health'],
        openNow: true
      },
      {
        placeId: 'mock_2',
        name: 'UCSF Medical Center',
        address: '505 Parnassus Ave, San Francisco, CA',
        location: { lat: 37.7632, lng: -122.4583 },
        rating: 4.6,
        userRatingsTotal: 890,
        types: ['hospital', 'health'],
        openNow: true
      }
    ]
    return mockPlaces
  }

  getMockPlaceDetails(placeId) {
    return {
      name: 'Mock Healthcare Provider',
      address: '123 Health St, San Francisco, CA 94102',
      phone: '(555) 123-4567',
      website: 'https://example.com',
      rating: 4.5,
      userRatingsTotal: 150,
      openingHours: [
        'Monday: 8:00 AM – 6:00 PM',
        'Tuesday: 8:00 AM – 6:00 PM',
        'Wednesday: 8:00 AM – 6:00 PM',
        'Thursday: 8:00 AM – 6:00 PM',
        'Friday: 8:00 AM – 5:00 PM',
        'Saturday: 9:00 AM – 2:00 PM',
        'Sunday: Closed'
      ],
      reviews: []
    }
  }
}

export const googleMapsService = new GoogleMapsService()
