import PropTypes from 'prop-types'
import './QueueList.css'

/**
 * Queue List Component
 * Displays list of patients in queue
 */
function QueueList({ queue, appointments, onStatusChange, loading, isAdmin }) {
  // Support both 'queue' and 'appointments' prop names
  const data = queue || appointments || []

  // Get status color class
  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace('_', '-')}`
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading queue...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>No appointments</h3>
        <p>No patients in queue at the moment</p>
      </div>
    )
  }

  return (
    <div className="queue-list">
      <table className="queue-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Patient Name</th>
            <th>Status</th>
            <th>Wait Time</th>
            {isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((apt) => (
            <tr key={apt.id} className={`queue-row status-${apt.status.toLowerCase()}`}>
              <td className="token-cell">
                <span className="token-badge">{apt.tokenNumber || '-'}</span>
              </td>
              <td className="patient-cell">
                <div className="patient-info">
                  <p className="patient-name">{apt.name || apt.patientName}</p>
                </div>
              </td>
              <td className="status-cell">
                <span className={`badge ${getStatusClass(apt.status)}`}>
                  {apt.status}
                </span>
              </td>
              <td className="wait-time-cell">
                {apt.estimatedWaitTime ? `${apt.estimatedWaitTime} min` : '-'}
              </td>
              {isAdmin && (
                <td className="action-cell">
                  {apt.status === 'WAITING' && (
                    <button
                      className="btn-warning btn-sm"
                      onClick={() => onStatusChange(apt.id, 'IN_PROGRESS')}
                    >
                      Start
                    </button>
                  )}
                  {apt.status === 'IN_PROGRESS' && (
                    <button
                      className="btn-success btn-sm"
                      onClick={() => onStatusChange(apt.id, 'COMPLETED')}
                    >
                      Complete
                    </button>
                  )}
                  {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => onStatusChange(apt.id, 'CANCELLED')}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

QueueList.propTypes = {
  queue: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      patientName: PropTypes.string,
      tokenNumber: PropTypes.number,
      status: PropTypes.string.isRequired,
      estimatedWaitTime: PropTypes.number,
    })
  ),
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      patientName: PropTypes.string.isRequired,
      tokenNumber: PropTypes.number,
      status: PropTypes.string.isRequired,
      estimatedWaitTime: PropTypes.number,
    })
  ),
  onStatusChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isAdmin: PropTypes.bool,
}

QueueList.defaultProps = {
  queue: null,
  appointments: [],
  loading: false,
  isAdmin: false,
}

export default QueueList
