import React, { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User,
  CheckCircle,
  XCircle,
  Edit3
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'

export function Appointments() {
  const { appointments, cancelAppointment } = useData()
  const { user, isSubscribed } = useAuth()
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(appointmentId)
      setSelectedAppointment(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="container py-6">
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="heading-2 mb-2">Sign in to view appointments</h3>
              <p className="text-text-secondary mb-4">
                Please sign in to access your appointment history and manage bookings.
              </p>
              <Button>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="heading-1 mb-2">My Appointments</h1>
          <p className="body text-text-secondary">
            View and manage your healthcare appointments
          </p>
        </div>

        {/* Subscription Notice */}
        {!isSubscribed && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="heading-2 text-primary mb-2">Upgrade to Premium</h3>
                  <p className="body mb-4">
                    Get access to direct appointment booking, priority support, and advanced filtering.
                  </p>
                  <Button>
                    Upgrade Now - $5/month
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="heading-2 mb-2">No appointments scheduled</h3>
              <p className="text-text-secondary mb-4">
                Book your first appointment to get started with local healthcare.
              </p>
              <Button>Find Providers</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card 
                key={appointment.appointmentId}
                className={`transition-all ${
                  selectedAppointment?.appointmentId === appointment.appointmentId 
                    ? 'ring-2 ring-primary' 
                    : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="heading-2 mb-1">{appointment.provider.name}</h3>
                      <p className="caption text-text-secondary mb-2">
                        {appointment.provider.specialty}
                      </p>
                      <Badge className={getStatusColor(appointment.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
                        </span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="heading-2 text-primary">
                        {format(new Date(appointment.dateTime), 'MMM d')}
                      </div>
                      <div className="caption text-text-secondary">
                        {format(new Date(appointment.dateTime), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center text-text-secondary mb-4">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="caption">{appointment.provider.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-text-secondary">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="caption">
                        {format(new Date(appointment.dateTime), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {appointment.status === 'confirmed' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Reschedule
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.appointmentId)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Office
                      </Button>
                    </div>
                  </div>

                  {appointment.status === 'confirmed' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-success mr-2" />
                        <span className="text-sm text-success">
                          Appointment confirmed - You'll receive a reminder 24 hours before
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Helpful Tips */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="heading-2">Appointment Tips</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Before Your Appointment</h3>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Arrive 15 minutes early</li>
                  <li>• Bring insurance cards and ID</li>
                  <li>• List current medications</li>
                  <li>• Prepare questions to ask</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Managing Appointments</h3>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Cancel at least 24 hours in advance</li>
                  <li>• Call if running late</li>
                  <li>• Update insurance information</li>
                  <li>• Schedule follow-ups as needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}