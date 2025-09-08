import React, { createContext, useContext, useState, useEffect } from 'react'

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

  const subscribe = () => {
    setIsSubscribed(true)
  }

  const value = {
    user,
    isSubscribed,
    loading,
    login,
    logout,
    subscribe
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}