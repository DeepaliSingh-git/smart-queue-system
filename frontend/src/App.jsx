import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BookAppointment from './pages/BookAppointment'
import QueueStatus from './pages/QueueStatus'
import AdminDashboard from './pages/AdminDashboard'
import DoctorQueue from './pages/DoctorQueue'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/queue-status" element={<QueueStatus />} />
            <Route path="/queue/:doctorId" element={<DoctorQueue />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
