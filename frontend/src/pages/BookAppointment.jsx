import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AppointmentForm from '../components/AppointmentForm'
import { api } from '../services/api'
import './BookAppointment.css'

/**
 * Book Appointment Page
 * Form for patients to book appointments with doctors
 */
function BookAppointment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.getDoctors()
        setDoctors(response)
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError('Failed to load doctors. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true)
      setError(null)

      // Book appointment via API
      await api.bookAppointment(formData)

      // Show success message
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/queue-status')
      }, 2000)
    } catch (err) {
      console.error('Error booking appointment:', err)
      const errorMessage =
        err.response?.data?.message || 'Failed to book appointment. Please try again.'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedDoctorId = searchParams.get('doctorId')
  const selectedDoctor = doctors.find(d => d.id === parseInt(selectedDoctorId))

  if (loading) {
    return (
      <div className="book-appointment-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="book-appointment-page">
      <div className="page-header">
        <h1>Book an Appointment</h1>
        <p>Fill in your details to schedule a consultation</p>
      </div>

      <div className="page-content">
        <div className="form-container">
          {success && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Appointment Booked Successfully!</h3>
              <p>You will be redirected to queue status shortly...</p>
            </div>
          )}

          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button className="btn-text" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          )}

          {!success && (
            <>
              {selectedDoctor && (
                <div className="selected-doctor-info">
                  <h3>Selected Doctor</h3>
                  <div className="doctor-info-card">
                    <div className="doctor-name">{selectedDoctor.name}</div>
                    <div className="doctor-spec">{selectedDoctor.specialization}</div>
                    <div className="doctor-email">{selectedDoctor.email}</div>
                  </div>
                </div>
              )}

              <AppointmentForm
                doctors={doctors}
                onSubmit={handleSubmit}
                loading={submitting}
              />

              <div className="form-help">
                <h4>Need Help?</h4>
                <ul>
                  <li>Available time slots are from 09:00 AM to 05:00 PM</li>
                  <li>Appointments can be scheduled starting from today</li>
                  <li>You will receive a confirmation email after booking</li>
                  <li>Arrive 10 minutes before your appointment time</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="booking-info">
          <div className="info-card">
            <h3>How it Works</h3>
            <ol>
              <li><strong>Enter Your Details:</strong> Fill in your personal information</li>
              <li><strong>Choose Doctor:</strong> Select your preferred doctor and date</li>
              <li><strong>Get Confirmation:</strong> Receive instant confirmation email</li>
              <li><strong>Track Queue:</strong> View your position in real-time queue</li>
            </ol>
          </div>

          <div className="info-card">
            <h3>Important Notes</h3>
            <ul>
              <li>✓ All fields are required</li>
              <li>✓ Valid email address is mandatory</li>
              <li>✓ Appointments can be cancelled 24 hours before</li>
              <li>✓ You'll be notified when your turn is approaching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
