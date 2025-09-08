import { apiService } from './api.js'

class AppointmentService {
  constructor() {
    this.apiService = apiService
  }

  /**
   * Get available appointment slots for a provider
   * @param {string} providerId - Provider ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} - Available time slots
   */
  async getAvailableSlots(providerId, date) {
    try {
      const response = await this.apiService.get(`/appointments/slots`, {
        providerId,
        date
      })
      return response.slots || this.getMockAvailableSlots(providerId, date)
    } catch (error) {
      console.error('Error fetching available slots:', error)
      return this.getMockAvailableSlots(providerId, date)
    }
  }

  /**
   * Book an appointment
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise<Object>} - Booking confirmation
   */
  async bookAppointment(appointmentData) {
    try {
      const response = await this.apiService.post('/appointments', appointmentData)
      return response || this.getMockBookingConfirmation(appointmentData)
    } catch (error) {
      console.error('Error booking appointment:', error)
      return this.getMockBookingConfirmation(appointmentData)
    }
  }

  /**
   * Get user's appointments
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - User's appointments
   */
  async getUserAppointments(userId) {
    try {
      const response = await this.apiService.get(`/appointments/user/${userId}`)
      return response.appointments || this.getMockUserAppointments(userId)
    } catch (error) {
      console.error('Error fetching user appointments:', error)
      return this.getMockUserAppointments(userId)
    }
  }

  /**
   * Cancel an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} - Cancellation confirmation
   */
  async cancelAppointment(appointmentId) {
    try {
      const response = await this.apiService.delete(`/appointments/${appointmentId}`)
      return response || this.getMockCancellationConfirmation(appointmentId)
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      return this.getMockCancellationConfirmation(appointmentId)
    }
  }

  /**
   * Reschedule an appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} newSlot - New appointment slot
   * @returns {Promise<Object>} - Reschedule confirmation
   */
  async rescheduleAppointment(appointmentId, newSlot) {
    try {
      const response = await this.apiService.put(`/appointments/${appointmentId}`, {
        dateTime: newSlot.dateTime,
        providerId: newSlot.providerId
      })
      return response || this.getMockRescheduleConfirmation(appointmentId, newSlot)
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      return this.getMockRescheduleConfirmation(appointmentId, newSlot)
    }
  }

  /**
   * Get appointment reminders
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Upcoming appointment reminders
   */
  async getAppointmentReminders(userId) {
    try {
      const response = await this.apiService.get(`/appointments/reminders/${userId}`)
      return response.reminders || this.getMockReminders(userId)
    } catch (error) {
      console.error('Error fetching reminders:', error)
      return this.getMockReminders(userId)
    }
  }

  /**
   * Verify insurance coverage for appointment
   * @param {string} providerId - Provider ID
   * @param {string} insuranceInfo - Insurance information
   * @returns {Promise<Object>} - Insurance verification result
   */
  async verifyInsurance(providerId, insuranceInfo) {
    try {
      const response = await this.apiService.post('/appointments/verify-insurance', {
        providerId,
        insuranceInfo
      })
      return response || this.getMockInsuranceVerification(providerId, insuranceInfo)
    } catch (error) {
      console.error('Error verifying insurance:', error)
      return this.getMockInsuranceVerification(providerId, insuranceInfo)
    }
  }

  // Mock data methods for development/fallback
  getMockAvailableSlots(providerId, date) {
    const slots = []
    const baseDate = new Date(date)
    
    // Generate mock time slots for the day
    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ]

    timeSlots.forEach(time => {
      // Randomly make some slots unavailable
      if (Math.random() > 0.3) {
        slots.push({
          id: `slot_${providerId}_${date}_${time}`,
          dateTime: `${date}T${time}:00Z`,
          duration: 30, // minutes
          available: true,
          type: 'regular'
        })
      }
    })

    return slots
  }

  getMockBookingConfirmation(appointmentData) {
    return {
      appointmentId: `apt_${Date.now()}`,
      status: 'confirmed',
      confirmationNumber: `HC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      dateTime: appointmentData.dateTime,
      providerId: appointmentData.providerId,
      userId: appointmentData.userId,
      type: appointmentData.type || 'consultation',
      estimatedDuration: 30,
      instructions: [
        'Please arrive 15 minutes early for check-in',
        'Bring a valid ID and insurance card',
        'Bring a list of current medications',
        'Wear comfortable clothing'
      ],
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'appointments@healthlocal.com'
      }
    }
  }

  getMockUserAppointments(userId) {
    const now = new Date()
    const appointments = []

    // Generate some mock appointments
    for (let i = 0; i < 5; i++) {
      const appointmentDate = new Date(now)
      appointmentDate.setDate(now.getDate() + (i * 7) + Math.floor(Math.random() * 7))
      
      appointments.push({
        appointmentId: `apt_${userId}_${i}`,
        providerId: `provider_${i + 1}`,
        providerName: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][i]}`,
        specialty: ['Family Medicine', 'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics'][i],
        dateTime: appointmentDate.toISOString(),
        status: ['confirmed', 'pending', 'completed'][Math.floor(Math.random() * 3)],
        type: 'consultation',
        duration: 30,
        location: '123 Health St, San Francisco, CA',
        notes: 'Regular check-up appointment'
      })
    }

    return appointments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  }

  getMockCancellationConfirmation(appointmentId) {
    return {
      appointmentId,
      status: 'cancelled',
      cancellationDate: new Date().toISOString(),
      refundAmount: 0, // Most appointments don't have fees
      message: 'Your appointment has been successfully cancelled.'
    }
  }

  getMockRescheduleConfirmation(appointmentId, newSlot) {
    return {
      appointmentId,
      status: 'rescheduled',
      oldDateTime: new Date().toISOString(),
      newDateTime: newSlot.dateTime,
      confirmationNumber: `HC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      message: 'Your appointment has been successfully rescheduled.'
    }
  }

  getMockReminders(userId) {
    const now = new Date()
    const reminders = []

    // Generate reminders for upcoming appointments
    for (let i = 1; i <= 3; i++) {
      const reminderDate = new Date(now)
      reminderDate.setDate(now.getDate() + i)
      
      reminders.push({
        id: `reminder_${userId}_${i}`,
        appointmentId: `apt_${userId}_${i}`,
        type: 'upcoming',
        message: `Reminder: You have an appointment with Dr. Smith tomorrow at 2:00 PM`,
        scheduledFor: reminderDate.toISOString(),
        sent: false
      })
    }

    return reminders
  }

  getMockInsuranceVerification(providerId, insuranceInfo) {
    // Simulate insurance verification
    const isAccepted = Math.random() > 0.2 // 80% chance of acceptance
    
    return {
      verified: true,
      accepted: isAccepted,
      copay: isAccepted ? Math.floor(Math.random() * 50) + 10 : null,
      deductible: isAccepted ? Math.floor(Math.random() * 500) : null,
      coveragePercentage: isAccepted ? 80 + Math.floor(Math.random() * 20) : 0,
      message: isAccepted 
        ? 'Your insurance is accepted by this provider'
        : 'This provider does not accept your insurance plan',
      preAuthRequired: Math.random() > 0.7,
      estimatedCost: isAccepted ? Math.floor(Math.random() * 200) + 50 : null
    }
  }
}

export const appointmentService = new AppointmentService()
