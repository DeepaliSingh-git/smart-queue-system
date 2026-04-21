import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './AppointmentForm.css'

/**
 * Appointment Form Component
 * Form to register patient and book appointment
 */
function AppointmentForm({ doctors, onSubmit, loading }) {
  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required'
    }

    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Email is invalid'
    }

    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = 'Phone number is required'
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor'
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Date is required'
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Time is required'
    }

    return newErrors
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Combine date and time to ISO format
    const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`

    onSubmit({
      name: formData.patientName,
      email: formData.patientEmail,
      phoneNumber: formData.patientPhone,
      doctorId: parseInt(formData.doctorId),
      appointmentTime: appointmentDateTime,
    })
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Patient Information</h3>

        {/* Patient Name */}
        <div className="form-group">
          <label htmlFor="patientName">Full Name *</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            className={errors.patientName && touched.patientName ? 'error' : ''}
          />
          {errors.patientName && touched.patientName && (
            <span className="error-text">{errors.patientName}</span>
          )}
        </div>

        {/* Patient Email */}
        <div className="form-group">
          <label htmlFor="patientEmail">Email Address *</label>
          <input
            type="email"
            id="patientEmail"
            name="patientEmail"
            value={formData.patientEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="your.email@example.com"
            className={errors.patientEmail && touched.patientEmail ? 'error' : ''}
          />
          {errors.patientEmail && touched.patientEmail && (
            <span className="error-text">{errors.patientEmail}</span>
          )}
        </div>

        {/* Patient Phone */}
        <div className="form-group">
          <label htmlFor="patientPhone">Phone Number *</label>
          <input
            type="tel"
            id="patientPhone"
            name="patientPhone"
            value={formData.patientPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="9876543210"
            className={errors.patientPhone && touched.patientPhone ? 'error' : ''}
          />
          {errors.patientPhone && touched.patientPhone && (
            <span className="error-text">{errors.patientPhone}</span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Appointment Details</h3>

        {/* Doctor Selection */}
        <div className="form-group">
          <label htmlFor="doctorId">Select Doctor *</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.doctorId && touched.doctorId ? 'error' : ''}
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
          {errors.doctorId && touched.doctorId && (
            <span className="error-text">{errors.doctorId}</span>
          )}
        </div>

        {/* Appointment Date */}
        <div className="form-group">
          <label htmlFor="appointmentDate">Date *</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            onBlur={handleBlur}
            min={getMinDate()}
            className={errors.appointmentDate && touched.appointmentDate ? 'error' : ''}
          />
          {errors.appointmentDate && touched.appointmentDate && (
            <span className="error-text">{errors.appointmentDate}</span>
          )}
        </div>

        {/* Appointment Time */}
        <div className="form-group">
          <label htmlFor="appointmentTime">Time *</label>
          <input
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            onBlur={handleBlur}
            min="09:00"
            max="17:00"
            className={errors.appointmentTime && touched.appointmentTime ? 'error' : ''}
          />
          {errors.appointmentTime && touched.appointmentTime && (
            <span className="error-text">{errors.appointmentTime}</span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary btn-block"
        disabled={loading}
      >
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  )
}

AppointmentForm.propTypes = {
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      specialization: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

AppointmentForm.defaultProps = {
  loading: false,
}

export default AppointmentForm
