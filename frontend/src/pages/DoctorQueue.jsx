import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import './DoctorQueue.css'

// Import doctor images
import DrRajesh from '../assets/doctors/DrRajesh.png'
import DrPriya from '../assets/doctors/DrPriya.png'
import DrAmit from '../assets/doctors/DrAmit.png'
import DrSneha from '../assets/doctors/DrSneha.png'
import DrVikram from '../assets/doctors/DrVikram.png'

// Map doctor names to images
const doctorImages = {
  'Dr. Rajesh Kumar': DrRajesh,
  'Dr. Priya Sharma': DrPriya,
  'Dr. Amit Singh': DrAmit,
  'Dr. Sneha Patel': DrSneha,
  'Dr. Vikram Gupta': DrVikram,
}

/**
 * Doctor Queue Page
 * Displays patients in queue for a specific doctor
 */
function DoctorQueue() {
  const { doctorId } = useParams()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [updating, setUpdating] = useState(null)

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.getDoctorById(doctorId)
        setDoctor(response)
      } catch (err) {
        console.error('Error fetching doctor:', err)
        setError('Failed to load doctor details')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId])

  // Fetch queue for this doctor
  const fetchQueue = async () => {
    try {
      setError(null)
      const response = await api.getQueueByDoctor(doctorId)
      setQueue(response || [])
    } catch (err) {
      console.error('Error fetching queue:', err)
      setError('Failed to load queue')
    }
  }

  useEffect(() => {
    if (doctorId) {
      fetchQueue()
    }
  }, [doctorId])

  // Auto-refresh queue every 3 seconds
  useEffect(() => {
    if (!autoRefresh || !doctorId) return

    const interval = setInterval(() => {
      fetchQueue()
    }, 3000)

    return () => clearInterval(interval)
  }, [autoRefresh, doctorId])

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'WAITING':
        return 'status-waiting'
      case 'IN_PROGRESS':
        return 'status-in-progress'
      case 'COMPLETED':
        return 'status-completed'
      case 'CANCELLED':
        return 'status-cancelled'
      default:
        return 'status-waiting'
    }
  }

  // Get status display text
  const getStatusText = (status) => {
    switch (status.toUpperCase()) {
      case 'WAITING':
        return 'Waiting'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'COMPLETED':
        return 'Completed'
      case 'CANCELLED':
        return 'Cancelled'
      default:
        return status
    }
  }

  // Calculate waiting patients count
  const waitingCount = queue.filter(apt => apt.status.toUpperCase() === 'WAITING').length

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setUpdating(appointmentId)
      await api.updateAppointmentStatus(appointmentId, newStatus)
      // Refresh queue immediately after update
      await fetchQueue()
    } catch (err) {
      console.error('Error updating appointment status:', err)
      setError('Failed to update appointment status')
    } finally {
      setUpdating(null)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="doctor-queue-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading queue details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="doctor-queue-page">
      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-content">
          <div className="doctor-header-info">
            <div className="doctor-info-left">
              <h1>Doctor Queue</h1>
              {doctor && (
                <div className="doctor-details">
                  <p className="doctor-name">{doctor.name}</p>
                  <p className="doctor-specialization">{doctor.specialization}</p>
                </div>
              )}
            </div>
            {doctor && (
              <div className="doctor-image-container">
                <img 
                  src={doctorImages[doctor.name] || ''}
                  alt={doctor.name}
                  className="doctor-profile-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button className="btn-text" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Queue Stats */}
        {doctor && (
          <div className="queue-stats">
            <div className="stat-item">
              <span className="stat-label">Waiting Patients</span>
              <span className="stat-value" style={{ color: '#dc2626' }}>{waitingCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total in Queue</span>
              <span className="stat-value">{queue.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available Slots</span>
              <span className="stat-value">{doctor.availableSlots}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Auto-Refresh</span>
              <button 
                className={`btn-toggle ${autoRefresh ? 'active' : ''}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}

        {/* Queue Table */}
        <div className="queue-container">
          {queue.length === 0 ? (
            <div className="empty-queue">
              <div className="empty-icon">📭</div>
              <h3>No Patients in Queue</h3>
              <p>The queue is empty. Check back later!</p>
            </div>
          ) : (
            <div className="queue-table-wrapper">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Token #</th>
                    <th>Patient Name</th>
                    <th>Email</th>
                    <th>Appointment Time</th>
                    <th>Status</th>
                    <th>Position</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((appointment, index) => (
                    <tr key={appointment.id} className={getStatusColor(appointment.status)}>
                      <td className="token-number">
                        <span className="badge">{appointment.tokenNumber}</span>
                      </td>
                      <td className="patient-name">{appointment.patientName}</td>
                      <td className="patient-email">{appointment.patientEmail}</td>
                      <td className="appointment-time">
                        {formatDate(appointment.appointmentTime)}
                      </td>
                      <td className="status">
                        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                      <td className="position">
                        <span className="position-badge">{index + 1}</span>
                      </td>
                      <td className="actions">
                        {appointment.status.toUpperCase() === 'WAITING' && (
                          <button
                            className="btn-action btn-in-progress"
                            onClick={() => handleStatusUpdate(appointment.id, 'IN_PROGRESS')}
                            disabled={updating === appointment.id}
                            title="Mark as In Progress"
                          >
                            {updating === appointment.id ? '...' : 'In Progress'}
                          </button>
                        )}
                        {appointment.status.toUpperCase() === 'IN_PROGRESS' && (
                          <button
                            className="btn-action btn-complete"
                            onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                            disabled={updating === appointment.id}
                            title="Mark as Completed"
                          >
                            {updating === appointment.id ? '...' : 'Complete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="queue-legend">
          <div className="legend-item">
            <span className="legend-dot status-waiting"></span>
            <span>Waiting</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot status-in-progress"></span>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot status-completed"></span>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot status-cancelled"></span>
            <span>Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorQueue
