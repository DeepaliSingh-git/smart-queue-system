# Smart Queue Management System

A modern, real-time queue management application for healthcare facilities. Track patient appointments, manage doctor queues, and display live queue status with professional UI and interactive features.

## Key Features

- **Doctor Profiles** - Browse available doctors with profile images, specializations, and available slots
- **Appointment Booking** - Simple form to register patients and book appointments with preferred doctors
- **Real-Time Queue Tracking** - Live queue status with automatic refresh every 5 seconds
- **Queue Management** - Doctors can mark patients as "In Progress" or "Complete" with instant counter updates
- **Waiting Patients Counter** - Prominent display of current waiting queue size (decreases when patient marked complete)
- **Doctor Selection Dropdown** - Switch between doctor queues instantly on Queue Status page
- **Professional UI** - Light blue pastel theme with responsive design for all devices
- **Multi-Status Support** - Track appointments through WAITING → IN_PROGRESS → COMPLETED states

## Tech Stack

**Frontend:**
- React 18+ (Vite)
- React Router v6
- Axios (API calls)
- CSS3 (Flexbox, Grid)
- PropTypes (type validation)

**Backend:**
- Node.js (built-in modules only)
- Mock API Server (port 8080)
- In-memory data storage

## Project Structure

```
smart-queue-system/
├── frontend/                          # React Vite application
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── DoctorCard.jsx       # Doctor profile cards with images
│   │   │   ├── Navbar.jsx
│   │   │   └── QueueList.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx             # Landing page with features
│   │   │   ├── BookAppointment.jsx  # Appointment booking
│   │   │   ├── DoctorQueue.jsx      # Queue management dashboard
│   │   │   ├── QueueStatus.jsx      # Live queue viewer with doctor selector
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js               # API service (Axios)
│   │   ├── assets/
│   │   │   └── doctors/             # Doctor profile images (PNG)
│   │   └── styles/                   # Global & component styles
│   └── package.json
├── api-server.js                      # Node.js mock API server
├── docker-compose.yml
├── SETUP_INSTRUCTIONS.md
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm (v8+)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-queue-system.git
   cd smart-queue-system
   ```

2. **Start Backend API Server** (Terminal 1)
   ```bash
   node api-server.js
   ```
   ✅ API will start on `http://localhost:8080`

3. **Start Frontend Development Server** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   ✅ Frontend will start on `http://localhost:3002` (or next available port)

4. **Access the Application**
   - Open browser: `http://localhost:3002` (or shown port in terminal)
   - Backend API: `http://localhost:8080/api`



## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)








