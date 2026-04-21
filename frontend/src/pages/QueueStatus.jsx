import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import QueueList from '../components/QueueList'
import { api } from '../services/api'
import './QueueStatus.css'

/**
 * Queue Status Page
 * Displays live queue for a doctor with auto-refresh every 5 seconds
 */
function QueueStatus() {
  const [searchParams] = useSearchParams()
  const [queue, setQueue] = useState([])
  const [doctors, setDoctors] = useState([])
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedDoctorId, setSelectedDoctorId] = useState(parseInt(searchParams.get('doctorId')) || 1)

  const doctorId = selectedDoctorId

  // Fetch all doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsResponse = await api.getDoctors()
        setDoctors(doctorsResponse || [])
      } catch (err) {
        console.error('Error fetching doctors:', err)
      }
    }
    fetchDoctors()
  }, [])

  // Fetch queue data
  const fetchQueue = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await api.getQueueByDoctor(doctorId)
      setQueue(response || [])
      setLastUpdated(new Date())

      // Get doctor info from doctors list
      const doctor = doctors.find(d => d.id === parseInt(doctorId))
      if (doctor) {
        setDoctorInfo(doctor)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error fetching queue:', err)
      setError('Failed to load queue. Please check your connection.')
      setLoading(false)
    }
  }, [doctorId, doctors])

  // Handle doctor selection change
  const handleDoctorChange = (e) => {
    const newDoctorId = parseInt(e.target.value)
    setSelectedDoctorId(newDoctorId)
  }

  // Fetch queue when doctor changes
  useEffect(() => {
    if (doctors.length > 0) {
      fetchQueue()
    }
  }, [selectedDoctorId, doctors])

  // Auto-refresh queue every 5 seconds
  useEffect(() => {
    if (!autoRefresh || doctors.length === 0) return

    const interval = setInterval(() => {
      fetchQueue()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, selectedDoctorId, doctors, fetchQueue])

  // Calculate average wait time
  const getAverageWaitTime = () => {
    if (queue.length === 0) return 0
    return queue.length * 15 // 15 minutes per patient
  }

  const handleStatusUpdate = (appointmentId, newStatus) => {
    // Update the status of an appointment
    setQueue(prev =>
      prev.map(item =>
        item.id === appointmentId ? { ...item, status: newStatus } : item
      )
    )
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  const getWaitTimeColor = (waitTime) => {
    if (waitTime === 0) return 'low'
    if (waitTime <= 30) return 'low'
    if (waitTime <= 60) return 'medium'
    return 'high'
  }

  return (
    <div className="queue-status-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Queue Status</h1>
          <div className="doctor-selector-wrapper">
            <label htmlFor="doctor-select" className="select-label">Select Doctor:</label>
            <select
              id="doctor-select"
              className="doctor-select"
              value={selectedDoctorId}
              onChange={handleDoctorChange}
            >
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
          {doctorInfo && (
            <div className="doctor-header">
              <span className="doctor-name">{doctorInfo.name}</span>
              <span className="doctor-spec">{doctorInfo.specialization}</span>
            </div>
          )}
        </div>

        <div className="header-controls">
          <button
            className={`btn-refresh ${autoRefresh ? 'active' : ''}`}
            onClick={toggleAutoRefresh}
            title={autoRefresh ? 'Auto-refresh is ON' : 'Auto-refresh is OFF'}
          >
            <span className={autoRefresh ? 'spinner-mini' : ''}>⟳</span>
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          <button className="btn-refresh" onClick={fetchQueue} title="Refresh now">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading queue...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchQueue}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="queue-stats">
            <div className="stat-box">
              <div className="stat-value">{queue.length}</div>
              <div className="stat-label">Patients in Queue</div>
            </div>
            <div className={`stat-box wait-${getWaitTimeColor(getAverageWaitTime())}`}>
              <div className="stat-value">~{getAverageWaitTime()} min</div>
              <div className="stat-label">Average Wait Time</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">
                {queue.filter(p => p.status === 'IN_PROGRESS').length}
              </div>
              <div className="stat-label">Currently Serving</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{lastUpdated && lastUpdated.toLocaleTimeString()}</div>
              <div className="stat-label">Last Updated</div>
            </div>
          </div>

          {queue.length === 0 ? (
            <div className="empty-queue">
              <div className="empty-icon">✓</div>
              <h3>Queue is Empty!</h3>
              <p>No patients are waiting at the moment.</p>
            </div>
          ) : (
            <div className="queue-container">
              <QueueList queue={queue} onStatusChange={handleStatusUpdate} />
            </div>
          )}

          <div className="queue-info">
            <h4>Queue Information</h4>
            <ul>
              <li>
                <strong>Automatic Refresh:</strong>{' '}
                {autoRefresh ? 'Queue updates every 5 seconds' : 'Manual refresh only'}
              </li>
              <li>
                <strong>Wait Time Calculation:</strong> Based on 15 minutes per patient
              </li>
              <li>
                <strong>Status Codes:</strong> WAITING (in queue), IN_PROGRESS (being treated),
                COMPLETED (finished)
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default QueueStatus
