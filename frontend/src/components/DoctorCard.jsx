import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import DrRajesh from '../assets/doctors/DrRajesh.png'
import DrPriya from '../assets/doctors/DrPriya.png'
import DrAmit from '../assets/doctors/DrAmit.png'
import DrSneha from '../assets/doctors/DrSneha.png'
import DrVikram from '../assets/doctors/DrVikram.png'
import './DoctorCard.css'

// Map doctor names to their images
const doctorImages = {
  'Dr. Rajesh Kumar': DrRajesh,
  'Dr. Priya Sharma': DrPriya,
  'Dr. Amit Singh': DrAmit,
  'Dr. Sneha Patel': DrSneha,
  'Dr. Vikram Gupta': DrVikram,
}

/**
 * Doctor Card Component
 * Displays doctor information and queue status
 */
function DoctorCard({ doctor, queueCount, waitTime }) {
  const navigate = useNavigate()

  // Determine wait time color
  const getWaitTimeClass = (time) => {
    if (time <= 15) return 'low'
    if (time <= 45) return 'medium'
    return 'high'
  }

  const handleViewQueue = () => {
    navigate(`/queue/${doctor.id}`)
  }

  const handleBookAppointment = () => {
    navigate(`/book-appointment?doctorId=${doctor.id}`)
  }

  const handleImageError = (e) => {
    // Fallback to avatar if image fails to load
    e.target.style.display = 'none'
  }

  // Get the doctor's image
  const doctorImage = doctorImages[doctor.name]

  return (
    <div className="doctor-card card">
      {/* Doctor Header */}
      <div className="doctor-card-header">
        {doctorImage ? (
          <img 
            src={doctorImage} 
            alt={doctor.name}
            className="doctor-avatar doctor-image"
            onError={handleImageError}
          />
        ) : (
          <div className="doctor-avatar">
            {doctor.name.charAt(0)}
          </div>
        )}
        <div className="doctor-info">
          <h3>{doctor.name}</h3>
          <p className="doctor-specialization">{doctor.specialization}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Queue Status */}
      <div className="doctor-queue-info">
        <div className="queue-item">
          <span className="queue-label">Patients in Queue</span>
          <span className="queue-value">{queueCount || 0}</span>
        </div>
        <div className="queue-item">
          <span className="queue-label">Available Slots</span>
          <span className="queue-value">{doctor.availableSlots}</span>
        </div>
      </div>

      {/* Wait Time */}
      {waitTime !== undefined && (
        <div className={`wait-time ${getWaitTimeClass(waitTime)}`}>
          <span className={`wait-indicator-dot`}></span>
          <span className="wait-text">
            ~{waitTime} min wait
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="doctor-card-actions">
        <button 
          className="btn-primary"
          onClick={handleViewQueue}
        >
          View Queue
        </button>
        <button 
          className="btn-secondary"
          onClick={handleBookAppointment}
        >
          Book
        </button>
      </div>
    </div>
  )
}

DoctorCard.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    availableSlots: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
  queueCount: PropTypes.number,
  waitTime: PropTypes.number,
}

DoctorCard.defaultProps = {
  queueCount: 0,
  waitTime: 0,
}

export default DoctorCard
