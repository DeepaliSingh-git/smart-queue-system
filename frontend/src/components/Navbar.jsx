import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

/**
 * Navigation Bar Component
 * Displays navigation links and app branding
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-icon">🏥</span>
          <span className="navbar-title">Smart Queue</span>
        </Link>

        {/* Hamburger Menu */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
              🏥 Home
            </Link>
          </li>
          <li>
            <Link to="/book-appointment" className="navbar-link" onClick={() => setIsOpen(false)}>
              📅 Book Appointment
            </Link>
          </li>
          <li>
            <Link to="/queue-status" className="navbar-link" onClick={() => setIsOpen(false)}>
              📊 Queue Status
            </Link>
          </li>
          <li>
            <Link to="/admin-dashboard" className="navbar-link" onClick={() => setIsOpen(false)}>
              ⚙️ Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
