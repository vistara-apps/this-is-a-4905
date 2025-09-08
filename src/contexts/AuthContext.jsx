import React, { createContext, useContext, useState, useEffect } from 'react'
import { stripeService } from '../services'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      // Mock user for demo
      setUser({
        userId: '1',
        email: 'demo@healthlocal.com',
        name: 'Demo User',
        preferences: {
          location: 'San Francisco, CA',
          insurance: 'Blue Cross Blue Shield'
        }
      })
      setIsSubscribed(Math.random() > 0.5) // Random subscription status for demo
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const login = async (email, password) => {
    // Mock login
    setUser({
      userId: '1',
      email,
      name: 'Demo User',
      preferences: {
        location: 'San Francisco, CA',
        insurance: 'Blue Cross Blue Shield'
      }
    })
  }

  const logout = () => {
    setUser(null)
    setIsSubscribed(false)
  }

  const subscribe = async (planId = 'premium') => {
    try {
      if (!user) {
        throw new Error('User must be logged in to subscribe')
      }

      const plans = stripeService.getPricingPlans()
      const selectedPlan = plans.find(plan => plan.id === planId)
      
      if (!selectedPlan || !selectedPlan.stripePriceId) {
        // For free plan or plans without Stripe integration
        setIsSubscribed(planId !== 'free')
        return { success: true, plan: selectedPlan }
      }

      // Initialize Stripe and create checkout session
      await stripeService.initialize()
      const result = await stripeService.createSubscriptionCheckout(
        selectedPlan.stripePriceId,
        user.userId
      )

      if (result.success) {
        setIsSubscribed(true)
      }

      return result
    } catch (error) {
      console.error('Subscription error:', error)
      throw error
    }
  }

  const cancelSubscription = async () => {
    try {
      // In a real app, this would call your backend to cancel the subscription
      setIsSubscribed(false)
      return { success: true, message: 'Subscription cancelled successfully' }
    } catch (error) {
      console.error('Cancellation error:', error)
      throw error
    }
  }

  const getPricingPlans = () => {
    return stripeService.getPricingPlans()
  }

  const getSubscriptionStatus = () => {
    return {
      isSubscribed,
      plan: isSubscribed ? 'premium' : 'free',
      features: isSubscribed 
        ? [
            'Unlimited provider search',
            'Advanced filtering',
            'Direct appointment booking',
            'Real-time availability',
            'Insurance verification',
            'Priority support'
          ]
        : [
            'Basic provider directory',
            'Location search',
            'Basic filtering',
            'Up to 5 searches per day'
          ]
    }
  }

  const value = {
    user,
    isSubscribed,
    loading,
    login,
    logout,
    subscribe,
    cancelSubscription,
    getPricingPlans,
    getSubscriptionStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
