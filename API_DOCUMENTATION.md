# HealthLocal API Documentation

This document outlines the API integrations and service layer architecture for the HealthLocal application.

## 🏗️ Service Architecture

The application uses a service-oriented architecture with the following layers:

```
Frontend (React) → Services Layer → External APIs
                 ↓
              Local State Management (Context API)
```

## 🔧 Core Services

### 1. API Service (`src/services/api.js`)

Base service for HTTP requests with error handling and configuration management.

#### Configuration
```javascript
const API_CONFIG = {
  GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
  BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
}
```

#### Methods
- `get(endpoint, params)` - GET request with query parameters
- `post(endpoint, data)` - POST request with JSON body
- `put(endpoint, data)` - PUT request with JSON body
- `delete(endpoint)` - DELETE request

## 🗺️ Google Maps Service (`src/services/googleMaps.js`)

Handles geolocation, geocoding, and places search functionality.

### Methods

#### `geocodeAddress(address)`
Converts an address string to coordinates.

**Parameters:**
- `address` (string) - The address to geocode

**Returns:**
```javascript
{
  lat: number,
  lng: number,
  formattedAddress: string,
  placeId: string
}
```

#### `searchNearbyHealthcare(lat, lng, type, radius)`
Searches for nearby healthcare providers using Google Places API.

**Parameters:**
- `lat` (number) - Latitude
- `lng` (number) - Longitude  
- `type` (string) - Place type ('hospital', 'doctor', 'pharmacy')
- `radius` (number) - Search radius in meters (default: 5000)

**Returns:**
```javascript
[{
  placeId: string,
  name: string,
  address: string,
  location: { lat: number, lng: number },
  rating: number,
  userRatingsTotal: number,
  types: string[],
  openNow: boolean
}]
```

#### `getPlaceDetails(placeId)`
Gets detailed information about a specific place.

**Parameters:**
- `placeId` (string) - Google Places ID

**Returns:**
```javascript
{
  name: string,
  address: string,
  phone: string,
  website: string,
  rating: number,
  userRatingsTotal: number,
  openingHours: string[],
  reviews: object[]
}
```

#### `getCurrentLocation()`
Gets the user's current location using browser geolocation.

**Returns:**
```javascript
{
  lat: number,
  lng: number,
  accuracy: number,
  fallback?: boolean
}
```

## 💳 Stripe Service (`src/services/stripe.js`)

Handles payment processing and subscription management.

### Methods

#### `initialize()`
Initializes Stripe.js library.

#### `createSubscriptionCheckout(priceId, userId)`
Creates a Stripe Checkout session for subscription.

**Parameters:**
- `priceId` (string) - Stripe price ID
- `userId` (string) - User identifier

#### `createPaymentMethod(cardElement)`
Creates a payment method from card element.

**Parameters:**
- `cardElement` (object) - Stripe card element

**Returns:**
```javascript
{
  id: string,
  type: string,
  card: {
    brand: string,
    last4: string
  }
}
```

#### `getPricingPlans()`
Returns available subscription plans.

**Returns:**
```javascript
[{
  id: string,
  name: string,
  price: number,
  interval: string,
  features: string[],
  stripePriceId?: string,
  popular?: boolean
}]
```

## 🏥 OpenFDA Service (`src/services/openFDA.js`)

Integrates with FDA APIs for drug information and health programs.

### Methods

#### `searchDrugs(query, limit)`
Searches FDA drug database.

**Parameters:**
- `query` (string) - Search query
- `limit` (number) - Number of results (default: 10)

**Returns:**
```javascript
[{
  id: string,
  brandName: string,
  genericName: string,
  manufacturer: string,
  activeIngredient: string,
  dosageForm: string,
  route: string
}]
```

#### `searchDeviceRecalls(query, limit)`
Searches for medical device recalls.

**Parameters:**
- `query` (string) - Search query
- `limit` (number) - Number of results (default: 10)

**Returns:**
```javascript
[{
  id: string,
  productDescription: string,
  reason: string,
  recallDate: string,
  classification: string,
  status: string,
  company: string
}]
```

#### `getHealthPrograms(location)`
Gets local health programs (currently returns mock data).

**Parameters:**
- `location` (string) - Location to search

**Returns:**
```javascript
[{
  programId: string,
  name: string,
  description: string,
  eligibility: string,
  location: string,
  contactInfo: {
    phone: string,
    email: string,
    website: string
  },
  schedule: string,
  category: string
}]
```

## 📅 Appointment Service (`src/services/appointments.js`)

Manages appointment booking, scheduling, and related functionality.

### Methods

#### `getAvailableSlots(providerId, date)`
Gets available appointment slots for a provider on a specific date.

**Parameters:**
- `providerId` (string) - Provider identifier
- `date` (string) - Date in YYYY-MM-DD format

**Returns:**
```javascript
[{
  id: string,
  dateTime: string,
  duration: number,
  available: boolean,
  type: string
}]
```

#### `bookAppointment(appointmentData)`
Books a new appointment.

**Parameters:**
```javascript
{
  userId: string,
  providerId: string,
  dateTime: string,
  type?: string
}
```

**Returns:**
```javascript
{
  appointmentId: string,
  status: string,
  confirmationNumber: string,
  dateTime: string,
  providerId: string,
  userId: string,
  type: string,
  estimatedDuration: number,
  instructions: string[],
  contactInfo: {
    phone: string,
    email: string
  }
}
```

#### `cancelAppointment(appointmentId)`
Cancels an existing appointment.

**Parameters:**
- `appointmentId` (string) - Appointment identifier

**Returns:**
```javascript
{
  appointmentId: string,
  status: string,
  cancellationDate: string,
  message: string
}
```

#### `rescheduleAppointment(appointmentId, newSlot)`
Reschedules an existing appointment.

**Parameters:**
- `appointmentId` (string) - Appointment identifier
- `newSlot` (object) - New appointment slot details

**Returns:**
```javascript
{
  appointmentId: string,
  status: string,
  oldDateTime: string,
  newDateTime: string,
  confirmationNumber: string,
  message: string
}
```

#### `verifyInsurance(providerId, insuranceInfo)`
Verifies insurance coverage for a provider.

**Parameters:**
- `providerId` (string) - Provider identifier
- `insuranceInfo` (object) - Insurance information

**Returns:**
```javascript
{
  verified: boolean,
  accepted: boolean,
  copay: number,
  deductible: number,
  coveragePercentage: number,
  message: string,
  preAuthRequired: boolean,
  estimatedCost: number
}
```

## 🔄 Data Flow

### 1. User Location Detection
```
User opens app → getCurrentLocation() → Update userLocation state → Load nearby providers
```

### 2. Provider Search
```
User searches → searchNearbyProviders() → Google Places API → Update search results
```

### 3. Appointment Booking
```
User selects slot → bookAppointment() → API call → Update appointments state → Show confirmation
```

### 4. Subscription Management
```
User subscribes → Stripe Checkout → Payment success → Update subscription status
```

## 🛡️ Error Handling

All services implement comprehensive error handling:

1. **Network Errors**: Automatic fallback to mock data
2. **API Limits**: Graceful degradation with user notification
3. **Authentication Errors**: Redirect to login
4. **Validation Errors**: User-friendly error messages

## 🔒 Security Considerations

1. **API Keys**: Stored in environment variables
2. **CORS**: Configured for production domains
3. **Rate Limiting**: Implemented on backend APIs
4. **Data Validation**: Input sanitization and validation
5. **HTTPS**: Required for production deployment

## 📊 Mock Data

For development and fallback scenarios, all services provide mock data that matches the expected API response format. This ensures the application remains functional even when external APIs are unavailable.

## 🚀 Production Deployment

### Environment Variables Required:
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL`

### API Rate Limits:
- Google Maps: 40,000 requests/month (free tier)
- Stripe: No limits on test mode
- OpenFDA: 240 requests/minute, 1000 requests/day

### Monitoring:
- API response times
- Error rates
- User geolocation success rates
- Payment success rates

---

For more detailed implementation examples, see the individual service files in `src/services/`.
