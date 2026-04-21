import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import QueueList from '../components/QueueList'
import { api } from '../services/api'
import './AdminDashboard.css'

/**
 * Admin Dashboard Page
 * For doctors to manage appointments and update queue status
 */
function AdminDashboard() {
  const [searchParams] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    searchParams.get('doctorId') || null
  )
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updateError, setUpdateError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response = await api.getDoctors()
        setDoctors(response)

        // Auto-select first doctor if none selected
        if (!selectedDoctorId && response.length > 0) {
          setSelectedDoctorId(response[0].id)
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError('Failed to load doctors')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // Fetch queue when doctor is selected
  useEffect(() => {
    if (!selectedDoctorId) return

    const fetchQueue = async () => {
      try {
        setError(null)
        const response = await api.getQueueByDoctor(selectedDoctorId)
        setQueue(response || [])
      } catch (err) {
        console.error('Error fetching queue:', err)
        setError('Failed to load queue')
      }
    }

    fetchQueue()
  }, [selectedDoctorId])

  // Auto-refresh queue every 5 seconds
  useEffect(() => {
    if (!autoRefresh || !selectedDoctorId) return

    const interval = setInterval(() => {
      const fetchQueue = async () => {
        try {
          const response = await api.getQueueByDoctor(selectedDoctorId)
          setQueue(response || [])
        } catch (err) {
          console.error('Error refreshing queue:', err)
        }
      }

      fetchQueue()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, selectedDoctorId])

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setUpdateError(null)

      // Call API to update status
      await api.updateAppointmentStatus(appointmentId, newStatus)

      // Update local state
      setQueue(prev =>
        prev.map(item =>
          item.id === appointmentId ? { ...item, status: newStatus } : item
        )
      )

      // Show success message
      setSuccess(`Appointment marked as ${newStatus}`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error updating status:', err)
      setUpdateError('Failed to update appointment status')
      setTimeout(() => setUpdateError(null), 3000)
    }
  }

  // Get current patient being served
  const getCurrentPatient = () => {
    return queue.find(p => p.status === 'IN_PROGRESS')
  }

  // Get statistics
  const stats = {
    total: queue.length,
    waiting: queue.filter(p => p.status === 'WAITING').length,
    inProgress: queue.filter(p => p.status === 'IN_PROGRESS').length,
    completed: queue.filter(p => p.status === 'COMPLETED').length,
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage appointments and queue</p>
      </div>

      <div className="dashboard-controls">
        <div className="doctor-selector">
          <label htmlFor="doctor-select">Select Doctor:</label>
          <select
            id="doctor-select"
            value={selectedDoctorId || ''}
            onChange={e => setSelectedDoctorId(parseInt(e.target.value) || null)}
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`btn-auto-refresh ${autoRefresh ? 'active' : ''}`}
          onClick={() => setAutoRefresh(!autoRefresh)}
          title={autoRefresh ? 'Auto-refresh is ON' : 'Auto-refresh is OFF'}
        >
          {autoRefresh ? '✓ Auto-refresh ON' : '⟳ Auto-refresh OFF'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {updateError && (
        <div className="error-banner error">
          <p>{updateError}</p>
        </div>
      )}

      {success && (
        <div className="success-banner">
          <p>✓ {success}</p>
        </div>
      )}

      {selectedDoctorId && (
        <>
          {/* Current Patient Card */}
          {getCurrentPatient() && (
            <div className="current-patient-card">
              <div className="card-header">Currently Serving</div>
              <div className="patient-info">
                <div className="patient-name">{getCurrentPatient().name}</div>
                <div className="patient-token">Token: {getCurrentPatient().tokenNumber}</div>
                <button
                  className="btn-mark-complete"
                  onClick={() => handleStatusUpdate(getCurrentPatient().id, 'COMPLETED')}
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          )}

          {/* Statistics Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total in Queue</div>
            </div>
            <div className="stat-card waiting">
              <div className="stat-number">{stats.waiting}</div>
              <div className="stat-label">Waiting</div>
            </div>
            <div className="stat-card inprogress">
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card completed">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Next Patient Button */}
          {stats.waiting > 0 && !getCurrentPatient() && (
            <div className="next-patient-section">
              <p>Queue is ready. Call the next patient:</p>
              <button
                className="btn-next-patient"
                onClick={() => {
                  const nextPatient = queue.find(p => p.status === 'WAITING')
                  if (nextPatient) {
                    handleStatusUpdate(nextPatient.id, 'IN_PROGRESS')
                  }
                }}
              >
                Call Next Patient (Token {queue.find(p => p.status === 'WAITING')?.tokenNumber})
              </button>
            </div>
          )}

          {/* Queue List */}
          <div className="queue-section">
            <h3>Queue Details</h3>
            {queue.length === 0 ? (
              <div className="empty-queue-message">
                <p>✓ No patients in queue</p>
              </div>
            ) : (
              <QueueList queue={queue} onStatusChange={handleStatusUpdate} isAdmin={true} />
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button
                className="action-btn"
                onClick={() => {
                  const waiting = queue.filter(p => p.status === 'WAITING')
                  if (waiting.length > 0) {
                    handleStatusUpdate(waiting[0].id, 'IN_PROGRESS')
                  }
                }}
                disabled={stats.waiting === 0}
              >
                👆 Call Next Patient
              </button>
              <button
                className="action-btn"
                onClick={() => {
                  const inProgress = queue.find(p => p.status === 'IN_PROGRESS')
                  if (inProgress) {
                    handleStatusUpdate(inProgress.id, 'COMPLETED')
                  }
                }}
                disabled={stats.inProgress === 0}
              >
                ✓ Mark Current as Done
              </button>
              <button
                className="action-btn refresh"
                onClick={() => {
                  const fetchQueue = async () => {
                    const response = await api.getQueueByDoctor(selectedDoctorId)
                    setQueue(response || [])
                  }
                  fetchQueue()
                }}
              >
                🔄 Refresh Queue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard
