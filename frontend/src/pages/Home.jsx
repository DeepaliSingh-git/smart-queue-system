import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DoctorCard from '../components/DoctorCard'
import { api } from '../services/api'
import './Home.css'

/**
 * Home Page Component
 * Displays all doctors with their queue information and wait times
 */
function Home() {
  const navigate = useNavigate()
  const doctorsSectionRef = useRef(null)
  const [doctors, setDoctors] = useState([])
  const [queueData, setQueueData] = useState({}) // Map of doctorId -> queueCount
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [expandedFeature, setExpandedFeature] = useState(null)

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

  // Fetch queue data for all doctors
  const fetchQueueDataForAllDoctors = async () => {
    try {
      const queueMap = {}
      
      // Fetch queue for each doctor
      for (const doctor of doctors) {
        try {
          const queue = await api.getQueueByDoctor(doctor.id)
          queueMap[doctor.id] = queue ? queue.length : 0
        } catch (err) {
          console.error(`Error fetching queue for doctor ${doctor.id}:`, err)
          queueMap[doctor.id] = 0
        }
      }
      
      setQueueData(queueMap)
    } catch (err) {
      console.error('Error fetching queue data:', err)
    }
  }

  // Fetch queue data when doctors change
  useEffect(() => {
    if (doctors.length > 0) {
      fetchQueueDataForAllDoctors()
    }
  }, [doctors])

  // Auto-refresh queue data every 5 seconds
  useEffect(() => {
    if (!autoRefresh || doctors.length === 0) return

    const interval = setInterval(() => {
      fetchQueueDataForAllDoctors()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, doctors])

  // Handle book appointment click
  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment?doctorId=${doctorId}`)
  }

  // Scroll to doctors section
  const scrollToDoctors = () => {
    doctorsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Queue Management System</h1>
          <p>Manage your doctor appointments efficiently</p>
        </div>
      </section>

      <section className="doctors-section" ref={doctorsSectionRef}>
        <div className="container">
          <h2>Available Doctors</h2>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading doctors...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && doctors.length === 0 && (
            <div className="empty-state">
              <p>No doctors available at the moment.</p>
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <div className="doctors-grid">
              {doctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  queueCount={queueData[doctor.id] || 0}
                  waitTime={(queueData[doctor.id] || 0) * 10}
                  onBookClick={() => handleBookAppointment(doctor.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <h2>System Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{doctors.length}</div>
              <div className="stat-label">Doctors Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {Object.values(queueData).reduce((sum, count) => sum + count, 0)}
              </div>
              <div className="stat-label">Patients in Queue</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Smart Queue?</h2>
          <div className="features-grid">
            {/* Easy Booking */}
            <div 
              className={`feature-card ${expandedFeature === 'booking' ? 'expanded' : ''}`}
              onClick={() => setExpandedFeature(expandedFeature === 'booking' ? null : 'booking')}
            >
              <div className="feature-icon">📱</div>
              <h3>Easy Booking</h3>
              <p>Book appointments in just a few clicks without long waits</p>
              {expandedFeature === 'booking' && (
                <div className="feature-details">
                  <ul>
                    <li>✓ Simple form-based booking</li>
                    <li>✓ Choose preferred date & time</li>
                    <li>✓ Instant confirmation</li>
                    <li>✓ No registration required</li>
                    <li>✓ Mobile-friendly interface</li>
                  </ul>
                  <button className="feature-btn" onClick={(e) => {
                    e.stopPropagation()
                    navigate('/book-appointment')
                  }}>Book Now</button>
                </div>
              )}
            </div>

            {/* Real-time Updates */}
            <div 
              className={`feature-card main-feature ${expandedFeature === 'updates' ? 'expanded' : ''}`}
              onClick={() => setExpandedFeature(expandedFeature === 'updates' ? null : 'updates')}
            >
              <div className="feature-icon">⏱️</div>
              <h3>Real-time Updates</h3>
              <p>Track your position in queue and estimated wait time</p>
              {expandedFeature === 'updates' && (
                <div className="feature-details">
                  <ul>
                    <li>✓ Live queue position tracking</li>
                    <li>✓ Estimated wait time</li>
                    <li>✓ Automatic updates every 5 seconds</li>
                    <li>✓ Push notifications</li>
                    <li>✓ Doctor status updates</li>
                  </ul>
                  <button className="feature-btn" onClick={(e) => {
                    e.stopPropagation()
                    navigate('/queue-status')
                  }}>Check Queue</button>
                </div>
              )}
            </div>

            {/* Expert Doctors */}
            <div 
              className={`feature-card ${expandedFeature === 'doctors' ? 'expanded' : ''}`}
              onClick={() => setExpandedFeature(expandedFeature === 'doctors' ? null : 'doctors')}
            >
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Doctors</h3>
              <p>Access to experienced specialists in various fields</p>
              {expandedFeature === 'doctors' && (
                <div className="feature-details">
                  <ul>
                    <li>✓ {doctors.length} qualified specialists</li>
                    <li>✓ Multiple specializations</li>
                    <li>✓ Years of experience</li>
                    <li>✓ Board certified professionals</li>
                    <li>✓ Patient reviews & ratings</li>
                  </ul>
                  <button className="feature-btn" onClick={(e) => {
                    e.stopPropagation()
                    scrollToDoctors()
                  }}>View Doctors</button>
                </div>
              )}
            </div>

            {/* Secure Data - Positioned below Real-time Updates */}
            <div 
              className={`feature-card secure-card ${expandedFeature === 'secure' ? 'expanded' : ''}`}
              onClick={() => setExpandedFeature(expandedFeature === 'secure' ? null : 'secure')}
            >
              <div className="feature-icon">🔒</div>
              <h3>Secure Data</h3>
              <p>Your personal and medical information is fully protected</p>
              {expandedFeature === 'secure' && (
                <div className="feature-details">
                  <ul>
                    <li>✓ End-to-end encryption</li>
                    <li>✓ HIPAA compliant</li>
                    <li>✓ Regular security audits</li>
                    <li>✓ Data backup & recovery</li>
                    <li>✓ Privacy policy protected</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
