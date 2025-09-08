import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Clock, 
  Shield, 
  Star,
  Heart,
  Calendar,
  Users
} from 'lucide-react'
import { Card, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

export function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const { providers, facilities } = useData()
  const { isSubscribed } = useAuth()

  const categories = [
    {
      title: 'Medical Facilities',
      icon: Heart,
      color: 'bg-red-100 text-red-600',
      description: 'Find doctors and specialists',
      link: '/providers'
    },
    {
      title: 'Pharmacies', 
      icon: Shield,
      color: 'bg-green-100 text-green-600',
      description: 'Locate nearby pharmacies',
      link: '/providers?type=pharmacy'
    },
    {
      title: 'Emergencies',
      icon: Clock,
      color: 'bg-orange-100 text-orange-600', 
      description: 'Urgent care & ER locations',
      link: '/urgent-care'
    },
    {
      title: 'Emergency Services',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      description: 'Critical emergency services',
      link: '/urgent-care?type=emergency'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/providers?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="display mb-4">
              Find healthcare, 
              <span className="block text-accent">instantly.</span>
            </h1>
            <p className="body-large mb-8 text-blue-100">
              Discover local healthcare providers, book appointments, and access health programs in your area.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <Input
                  variant="withIcon"
                  icon={<Search className="w-4 h-4 text-gray-400" />}
                  placeholder="Search doctors, specialists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">{providers.length}+</div>
                <div className="text-sm text-blue-200">Providers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{facilities.length}+</div>
                <div className="text-sm text-blue-200">Facilities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-blue-200">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container">
          <h2 className="heading-1 text-center mb-8">Find what you need</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Link key={index} to={category.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="heading-2 mb-2">{category.title}</h3>
                      <p className="caption text-text-secondary">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-1">Top-rated providers</h2>
            <Link to="/providers">
              <Button variant="outline">View all</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.slice(0, 3).map((provider) => (
              <Card key={provider.providerId} variant="featured">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="heading-2 mb-1">{provider.name}</h3>
                      <p className="caption text-text-secondary">{provider.specialty}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{provider.reviews.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-text-secondary mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="caption">{provider.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="caption text-success">Available today</span>
                    <Link to={`/providers?id=${provider.providerId}`}>
                      <Button size="sm">
                        {isSubscribed ? 'Book Now' : 'View Details'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12">
        <div className="container">
          <Card variant="featured" className="bg-gradient-to-r from-accent/10 to-primary/10">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="heading-1 mb-4">Ready to get started?</h2>
              <p className="body-large text-text-secondary mb-6">
                {isSubscribed 
                  ? 'You have premium access to all features!' 
                  : 'Upgrade to premium for advanced features like direct booking and priority support.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/providers">
                  <Button size="lg">Find Providers</Button>
                </Link>
                {!isSubscribed && (
                  <Link to="/profile">
                    <Button variant="outline" size="lg">Upgrade to Premium</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}