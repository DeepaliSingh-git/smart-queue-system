# Smart Queue System - Frontend

React + Vite frontend for the Smart Queue Management System.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.jsx              # Navigation bar with links
│   │   ├── Navbar.css
│   │   ├── DoctorCard.jsx          # Doctor display card component
│   │   ├── DoctorCard.css
│   │   ├── QueueList.jsx           # Queue table display component
│   │   ├── QueueList.css
│   │   ├── AppointmentForm.jsx     # Reusable appointment form
│   │   └── AppointmentForm.css
│   ├── pages/              # Page components for different routes
│   │   ├── Home.jsx               # Doctor list with system overview
│   │   ├── Home.css
│   │   ├── BookAppointment.jsx    # Appointment booking page
│   │   ├── BookAppointment.css
│   │   ├── QueueStatus.jsx        # Real-time queue viewing with auto-refresh
│   │   ├── QueueStatus.css
│   │   ├── AdminDashboard.jsx     # Queue management interface for doctors
│   │   └── AdminDashboard.css
│   ├── services/           # API and service functions
│   │   └── api.js                 # Axios client with 15+ API functions
│   ├── styles/             # Global styles
│   │   ├── index.css              # Global styles and utilities
│   │   └── App.css                # Application-wide styles
│   ├── App.jsx             # Main routing component
│   ├── main.jsx            # React entry point
│   └── index.html          # HTML template
├── vite.config.js          # Vite configuration with dev server
└── package.json            # Dependencies and scripts

```

## 🚀 Features

### Pages

| Page | Path | Description | Features |
|------|------|-------------|----------|
| **Home** | `/` | Doctor list with system overview | Lists all doctors, shows queue counts, system statistics, features showcase |
| **Book Appointment** | `/book-appointment` | Appointment booking interface | Form validation, doctor selection, date/time picker, confirmation step |
| **Queue Status** | `/queue-status` | Real-time queue monitoring | Auto-refresh every 5 seconds, wait time calculation, current doctor info, queue statistics |
| **Admin Dashboard** | `/admin-dashboard` | Doctor's queue management | Doctor selection, call next patient, mark as in-progress/completed, statistics |

### Components

| Component | Purpose | Props |
|-----------|---------|-------|
| **Navbar** | Navigation & branding | - |
| **DoctorCard** | Display doctor info with action | `doctor`, `onBookClick` |
| **QueueList** | Display patients in queue/table format | `queue`, `onStatusChange`, `isAdmin` |
| **AppointmentForm** | Reusable booking form | `doctors`, `onSubmit`, `loading` |

## 🔌 API Integration

The frontend connects to the backend API at `http://backend:8080/api` with the following endpoints:

### API Functions

```javascript
// Doctor APIs
getDoctors()                          // GET /doctors
addDoctor(doctorData)                // POST /doctors

// Patient APIs
addPatient(patientData)              // POST /patients

// Appointment APIs
bookAppointment(appointmentData)     // POST /appointments
getAppointmentsByDoctor(doctorId)   // GET /appointments/doctor/{id}
updateAppointmentStatus(id, status) // PUT /appointments/{id}/status
getQueueByDoctor(doctorId)          // GET /queue/doctor/{id}
```

## 🎨 Styling System

- **Global Colors**: Green (#4CAF50), Yellow (#ffc107), Red (#f44336), Blue (#2196f3)
- **Wait Time Indicators**: 
  - Green: Low wait (≤30 min)
  - Yellow: Medium wait (31-60 min)
  - Red: High wait (>60 min)
- **Responsive Design**: Mobile-first with breakpoints at 768px and 480px

## ⚙️ Tech Stack

- **React 18.2.0**: UI framework
- **React Router 6.14.0**: Client-side routing
- **Axios 1.4.0**: HTTP client
- **Vite 4.3.9**: Build tool & dev server
- **PropTypes**: Type checking for React components

## 🏃 Running the Application

### Development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` with API proxy to `http://localhost:8080`

### Build

```bash
npm run build
```

## 📱 Key Features

### Auto-refresh Queue
- Queue Status page auto-refreshes every 5 seconds
- Toggleable auto-refresh control
- Manual refresh button

### Form Validation
- Client-side validation for all forms
- Email format validation
- Date/time constraints (today or later, 09:00-17:00)
- Error messages with field highlighting

### Loading States
- Loading spinners on data fetch
- Disabled submit buttons during submission
- Empty state messages

### Real-time Updates
- Queue counts update automatically
- Wait time calculations (15 minutes per patient)
- Status badges with color coding

## 🔐 Security

- CORS-enabled Axios client
- Email validation
- Form input sanitization
- Safe error messages to users

## 📊 Component Hierarchy

```
App
├── Navbar
└── Routes
    ├── Home
    │   └── DoctorCard (for each doctor)
    ├── BookAppointment
    │   └── AppointmentForm
    ├── QueueStatus
    │   └── QueueList
    └── AdminDashboard
        ├── QueueList
        └── QuickActions
```

## 🎯 Next Steps

- Add doctor authentication
- Implement notifications/alerts
- Add appointment history page
- Mobile app version
- Push notifications for queue updates
- Analytics dashboard
