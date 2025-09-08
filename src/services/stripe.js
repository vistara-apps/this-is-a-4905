import { API_CONFIG } from './api.js'

class StripeService {
  constructor() {
    this.publishableKey = API_CONFIG.STRIPE_PUBLISHABLE_KEY
    this.stripe = null
    this.initialized = false
  }

  /**
   * Initialize Stripe
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return

    if (!this.publishableKey) {
      console.warn('Stripe publishable key not configured')
      this.initialized = true
      return
    }

    try {
      // Load Stripe.js dynamically
      if (!window.Stripe) {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        document.head.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      this.stripe = window.Stripe(this.publishableKey)
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize Stripe:', error)
      this.initialized = true
    }
  }

  /**
   * Create a subscription checkout session
   * @param {string} priceId - Stripe price ID
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async createSubscriptionCheckout(priceId, userId) {
    await this.initialize()

    if (!this.stripe) {
      console.warn('Stripe not available, using mock checkout')
      return this.mockCheckout()
    }

    try {
      // In a real app, this would call your backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          mode: 'subscription'
        }),
      })

      const session = await response.json()

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      return this.mockCheckout()
    }
  }

  /**
   * Create payment method for future use
   * @param {Object} cardElement - Stripe card element
   * @returns {Promise<Object>} - Payment method
   */
  async createPaymentMethod(cardElement) {
    await this.initialize()

    if (!this.stripe) {
      console.warn('Stripe not available, using mock payment method')
      return this.mockPaymentMethod()
    }

    try {
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        throw new Error(error.message)
      }

      return paymentMethod
    } catch (error) {
      console.error('Payment method creation error:', error)
      return this.mockPaymentMethod()
    }
  }

  /**
   * Confirm payment intent
   * @param {string} clientSecret - Payment intent client secret
   * @param {Object} paymentMethod - Payment method
   * @returns {Promise<Object>} - Payment result
   */
  async confirmPayment(clientSecret, paymentMethod) {
    await this.initialize()

    if (!this.stripe) {
      console.warn('Stripe not available, using mock payment confirmation')
      return this.mockPaymentConfirmation()
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod
        }
      )

      if (error) {
        throw new Error(error.message)
      }

      return paymentIntent
    } catch (error) {
      console.error('Payment confirmation error:', error)
      return this.mockPaymentConfirmation()
    }
  }

  /**
   * Get subscription pricing plans
   * @returns {Array} - Available pricing plans
   */
  getPricingPlans() {
    return [
      {
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
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 5,
        interval: 'month',
        stripePriceId: 'price_premium_monthly', // This would be your actual Stripe price ID
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
      }
    ]
  }

  // Mock methods for development/fallback
  mockCheckout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock checkout completed')
        resolve({ success: true, mock: true })
      }, 2000)
    })
  }

  mockPaymentMethod() {
    return {
      id: 'pm_mock_' + Date.now(),
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242'
      },
      mock: true
    }
  }

  mockPaymentConfirmation() {
    return {
      id: 'pi_mock_' + Date.now(),
      status: 'succeeded',
      amount: 500, // $5.00
      currency: 'usd',
      mock: true
    }
  }
}

export const stripeService = new StripeService()
