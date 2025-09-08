import React, { useState } from 'react'
import { 
  Search, 
  MapPin, 
  Phone, 
  Users, 
  Calendar,
  Info,
  Heart,
  Brain,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Badge } from '../components/Badge'
import { useData } from '../contexts/DataContext'

export function Programs() {
  const [searchQuery, setSearchQuery] = useState('')
  const { programs } = useData()

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const programCategories = [
    {
      title: 'Preventive Care',
      icon: Heart,
      color: 'bg-green-100 text-green-600',
      description: 'Screenings and wellness programs'
    },
    {
      title: 'Mental Health',
      icon: Brain,
      color: 'bg-purple-100 text-purple-600',
      description: 'Support groups and counseling'
    },
    {
      title: 'Fitness & Wellness',
      icon: Activity,
      color: 'bg-blue-100 text-blue-600',
      description: 'Exercise and nutrition programs'
    },
    {
      title: 'Community Support',
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      description: 'Local health initiatives'
    }
  ]

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="heading-1 mb-2">Local Health Programs</h1>
          <p className="body text-text-secondary">
            Discover community health programs, screenings, and wellness initiatives in your area
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Input
              variant="withIcon"
              icon={<Search className="w-4 h-4 text-gray-400" />}
              placeholder="Search health programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Program Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {programCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index} className="hover:shadow-card transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="caption text-text-secondary">{category.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Programs List */}
        <div className="space-y-6">
          <h2 className="heading-2">Available Programs</h2>
          
          {filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="heading-2 mb-2">No programs found</h3>
                <p className="text-text-secondary">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredPrograms.map((program) => (
              <Card key={program.programId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="heading-2 mb-2">{program.name}</h3>
                      <Badge className="bg-primary/10 text-primary mb-3">
                        Free Program
                      </Badge>
                    </div>
                    <Button variant="outline">
                      <Info className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="body text-text-secondary mb-4">
                    {program.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-text-secondary" />
                        Eligibility
                      </h4>
                      <p className="caption text-text-secondary">{program.eligibility}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-text-secondary" />
                        Location
                      </h4>
                      <p className="caption text-text-secondary">{program.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-text-secondary">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="caption">{program.contactInfo.phone}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="heading-2 text-primary mb-2">How to Access Programs</h3>
                <div className="space-y-2 text-sm">
                  <p>• Most community health programs are free or low-cost</p>
                  <p>• Some programs may require registration or enrollment</p>
                  <p>• Eligibility requirements vary by program</p>
                  <p>• Contact the program directly for specific requirements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}