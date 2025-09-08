import React from 'react'
import { MapPin, Navigation } from 'lucide-react'

export function Map({ providers = [], selectedProvider, onProviderSelect, className }) {
  return (
    <div className={`bg-gray-100 rounded-lg relative overflow-hidden ${className}`}>
      {/* Map placeholder with grid pattern */}
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 relative">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Location markers */}
        {providers.map((provider, index) => (
          <button
            key={provider.providerId}
            onClick={() => onProviderSelect?.(provider)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
              selectedProvider?.providerId === provider.providerId 
                ? 'z-20 scale-125' 
                : 'z-10'
            }`}
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${25 + (index * 12) % 50}%`
            }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
              selectedProvider?.providerId === provider.providerId
                ? 'bg-primary text-white ring-4 ring-primary/30'
                : 'bg-white text-primary hover:bg-primary hover:text-white'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
          </button>
        ))}

        {/* User location */}
        <div 
          className="absolute w-4 h-4 bg-accent rounded-full shadow-lg animate-pulse"
          style={{ left: '30%', top: '40%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75" />
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Navigation className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}