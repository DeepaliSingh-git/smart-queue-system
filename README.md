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

## Usage

### For Patients
1. **Home Page** - View available doctors with profiles and features overview
2. **Book Appointment** - Fill form with personal details, select doctor and time
3. **View Queue Status** - Check real-time queue with estimated wait time
4. **Track Position** - See your position and status in the queue

### For Staff/Doctors
1. **Doctor Queue** - Click "View Queue" on doctor card to access dashboard
2. **Update Status** - Mark patients as "In Progress" → "Complete"
3. **Monitor Waiting** - Red counter shows current waiting patients (updates in real-time)
4. **Auto-Refresh** - Queue updates every 5 seconds (toggle ON/OFF available)

## Features in Detail

### Doctor Cards
- Doctor profile image (circular avatar)
- Name, specialization, available slots
- Current queue position count
- "View Queue" button for queue dashboard

### Doctor Queue Page
- Doctor profile with square image on right
- Doctor name and specialization on left
- Queue statistics (waiting patients in red, total, available slots)
- Table with:
  - Token number (blue badge)
  - Patient name and email
  - Appointment time
  - Current status (color-coded)
  - Queue position
  - Action buttons (In Progress / Complete)

### Queue Status Page
- Doctor selector dropdown to switch queues
- Live statistics display
- Real-time queue table
- Auto-refresh every 5 seconds
- Manual refresh button

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all available doctors |
| GET | `/api/doctors/:id` | Get doctor by ID |
| POST | `/api/patients` | Register new patient |
| GET | `/api/patients/:email` | Get patient by email |
| POST | `/api/appointments/book` | Book appointment |
| GET | `/api/appointments/queue/:doctorId` | Get queue for doctor |
| PUT | `/api/appointments/:id/status` | Update appointment status |

## Color Scheme

- **Primary Blue**: `#2563eb` (buttons, badges)
- **Background**: `#E8F4F8` (light blue pastel)
- **Cards**: `#F5FBFD` (lighter blue)
- **Accent Green**: `#81C784` (hero section)
- **Status Colors**:
  - Waiting: `#fef3c7` (yellow)
  - In Progress: `#dbeafe` (light blue)
  - Completed: `#dcfce7` (light green)

## Responsive Design

- **Desktop (1024px+)** - Full layout with side-by-side elements
- **Tablet (768-1023px)** - Optimized single column with adjustments
- **Mobile (<768px)** - Fully stacked, touch-friendly buttons

## Future Improvements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Authentication & authorization (JWT)
- [ ] Email notifications for confirmations
- [ ] SMS alerts for queue updates
- [ ] Admin analytics dashboard
- [ ] Appointment rescheduling
- [ ] Payment integration
- [ ] Doctor availability calendar
- [ ] Patient medical history
- [ ] Multi-language support
- [ ] WebSocket for real-time updates

## Troubleshooting

**Port Already in Use**
```bash
# Windows - Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Clear Frontend Cache**
```bash
cd frontend
rm -r node_modules/.vite
npm run dev
```

**Clear npm Cache**
```bash
npm cache clean --force
npm install
```

**API Not Responding**
- Check if `api-server.js` is running on port 8080
- Verify backend terminal shows "Waiting for requests..."

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Open for personal and commercial use

## Author

**Developed:** April 2026  
**Repository:** [GitHub Link]

---

For issues or questions, please create an issue on GitHub.
WAITING
   ↓
IN_PROGRESS
   ↓
COMPLETED

Alternative:
WAITING/IN_PROGRESS → CANCELLED (anytime)
```

### Queue Operations

1. **Book Appointment** - Patient joins queue (token assigned)
2. **View Queue** - See all waiting patients for a doctor
3. **Get Next Patient** - Doctor calls next patient from queue
4. **Update Status** - Mark patient as IN_PROGRESS or COMPLETED
5. **Auto-Recalculate** - Wait times update when status changes

---

## 💾 Database Schema

### Doctors Table
```sql
CREATE TABLE doctors (
  doctor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  available_slots INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Patients Table
```sql
CREATE TABLE patients (
  patient_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(15),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  appointment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT NOT NULL,
  appointment_time DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
  token_number INT,
  estimated_wait_time INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);
```

### Relationships

```
Doctor (1) ──────────< (Many) Appointment >────────── (1) Patient
                         |
                    Many-to-One
                   Relationships
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

The project includes a complete `docker-compose.yml` configuration with:
- MySQL 8.0 database service
- Spring Boot backend service
- Health checks for both services
- Persistent volume for database data
- Custom network bridge

### Quick Start with Docker

The system includes **5 sample doctors** that are automatically created on startup:
- 🏥 Dr. Rajesh Kumar (Cardiology) 
- 🧠 Dr. Priya Sharma (Neurology)
- 🦴 Dr. Amit Singh (Orthopedics)
- 💆 Dr. Sneha Patel (Dermatology)
- 🩺 Dr. Vikram Gupta (General Medicine)

1. **Build and Start All Services:**
   ```bash
   docker-compose up -d
   ```

2. **Start Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8080/api
   - Backend Docs: http://localhost:8080/api/doctors

4. **View Service Status:**
   ```bash
   docker-compose ps
   ```

5. **Test Backend:**
   ```bash
   # Get all doctors (now populated with 5 sample doctors!)
   curl http://localhost:8080/api/doctors
   ```

6. **Stop Services:**
   ```bash
   docker-compose down
   ```

7. **Complete Cleanup (remove volumes):**
   ```bash
   docker-compose down -v
   ```

### Docker Environment Variables

Edit `docker-compose.yml` to configure:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/smart_queue_db
  SPRING_DATASOURCE_USERNAME: root
  SPRING_DATASOURCE_PASSWORD: root
  SPRING_JPA_HIBERNATE_DDL_AUTO: update
```

---

## 🎨 Frontend Setup

### Prerequisites

1. **Node.js 16 or higher** 
   - Download: [Node.js](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

### Installation

#### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

#### Step 2: Configure Backend URL

The frontend is pre-configured to connect to `http://backend:8080/api` (for Docker).

For local development, update [frontend/src/services/api.js](frontend/src/services/api.js):

```javascript
// For Docker
const API_BASE_URL = 'http://backend:8080/api'

// For local development
const API_BASE_URL = 'http://localhost:8080/api'
```

#### Step 3: Run Development Server

```bash
npm run dev
```

The frontend runs on `http://localhost:3000` with API proxy enabled.

### Build for Production

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Pages & Features

| Page | Route | Purpose |
|------|-------|---------|
| **Home** | `/` | View all doctors, system overview, statistics |
| **Book Appointment** | `/book-appointment` | Book appointment with doctor (includes form validation) |
| **Queue Status** | `/queue-status` | View real-time queue for doctor (auto-refresh every 5 seconds) |
| **Admin Dashboard** | `/admin-dashboard` | Doctor's interface to manage queue, call next patient, mark as done |

### Components

- **Navbar**: Navigation with links to all pages
- **DoctorCard**: Display doctor information and queue count
- **QueueList**: Table of patients in queue with status indicators
- **AppointmentForm**: Reusable booking form with validation

### API Integration

The frontend integrates with 15+ backend API endpoints through [frontend/src/services/api.js](frontend/src/services/api.js):

```javascript
// Example usage
import { api } from './services/api'

// Get all doctors
const doctors = await api.getDoctors()

// Book appointment
await api.bookAppointment({
  name: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '9876543210',
  doctorId: 1,
  appointmentTime: '2024-01-15T10:00:00'
})

// Get queue for doctor
const queue = await api.getQueueByDoctor(1)

// Update appointment status
await api.updateAppointmentStatus(appointmentId, 'COMPLETED')
```

### Features

✅ **Doctor List**: Browse all doctors with current queue status  
✅ **Appointment Booking**: Form validation, date/time constraints (today+, 9AM-5PM)  
✅ **Real-time Queue**: Auto-refresh every 5 seconds with manual refresh  
✅ **Wait Time Calculation**: Based on 15 minutes per patient  
✅ **Admin Dashboard**: Call next patient, mark as in-progress/completed  
✅ **Mobile Responsive**: Works on desktop, tablet, and mobile  
✅ **Loading States**: Spinners and disabled states during data fetch  
✅ **Error Handling**: User-friendly error messages  

---

## 🔧 Configuration

### Application Properties

File: `backend/src/main/resources/application.properties`

**Database Configuration:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_queue_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**JPA/Hibernate Configuration:**
```properties
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
```

**Server Configuration:**
```properties
server.port=8080
server.servlet.context-path=/api
spring.application.name=smart-queue-management
```

**Logging Configuration:**
```properties
logging.level.root=WARN
logging.level.com.smartqueue=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `Cannot connect to database`

**Solution:**
```bash
# Verify MySQL is running
mysql -u root -p -e "SELECT 1;"

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Verify credentials
# Edit: backend/src/main/resources/application.properties
```

### Build Failures

**Error:** `BUILD FAILURE`

**Solution:**
```bash
# Clear Maven cache
mvn clean

# Download dependencies again
mvn install -U

# Check Java version
java -version  # Should be 17 or higher
```

### Port Already in Use

**Error:** `Port 8080 already in use`

**Solution:**
```bash
# Windows PowerShell
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Application Won't Start

**Solution Steps:**
1. Check MySQL is running and credentials are correct
2. Verify database `smart_queue_db` exists
3. Check all prerequisites are installed
4. Review application logs for specific errors
5. Clear build directory: `mvn clean package`

---

## 📚 Additional Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed step-by-step terminal commands |
| [API_REFERENCE.md](API_REFERENCE.md) | Quick API endpoint reference |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Developer quick reference card |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete file descriptions |

---

## 🤝 Contributing

### Code Structure Guidelines

- Follow the layered architecture (Controller → Service → Repository)
- Use DTOs for API contracts
- Add validation annotations to entities
- Implement proper exception handling
- Write comments for complex logic
- Use meaningful commit messages

### Adding New Features

1. Create entity in `entity/` folder
2. Create repository in `repository/` folder
3. Create service in `service/` folder
4. Create controller in `controller/` folder
5. Create DTOs in `dto/` folder

### Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=DoctorServiceTest
```

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Update MySQL credentials (don't use default root:root)
- [ ] Enable HTTPS/SSL configuration
- [ ] Implement JWT authentication
- [ ] Add API rate limiting
- [ ] Configure proper logging to files
- [ ] Set up database backups
- [ ] Enable query logging for performance monitoring
- [ ] Configure CORS for specific frontend URLs
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Write unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring and alerts
- [ ] Perform security audit
- [ ] Load testing with expected traffic

---

## 📝 License

This project is created for educational and hackathon purposes.

---

## 📞 Support & Resources

- **Issues**: Check [Troubleshooting](#troubleshooting) section
- **API Usage**: See [API_REFERENCE.md](API_REFERENCE.md)
- **Setup Help**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Quick Lookup**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 🎯 Project Status

### ✅ Backend: COMPLETE
- All 17 REST API endpoints implemented
- Queue management system fully functional
- Error handling and validation in place
- Docker containerization ready

### ✅ Frontend: (COMPLETED)
- ✅ Modern React interface with Vite
- ✅ Real-time queue updates (auto-refresh every 5 seconds)
- ✅ Appointment booking with form validation
- ✅ Admin dashboard for queue management
- ✅ Mobile responsive design
- ✅ 4 page components (Home, BookAppointment, QueueStatus, AdminDashboard)
- ✅ 4 reusable components (Navbar, DoctorCard, QueueList, AppointmentForm)
- ✅ Axios API integration with 15+ endpoints
- ✅ Global styling system with semantic colors
- ✅ Loading states and error handling

### 📋 Future Enhancements
- JWT authentication and authorization
- Email notifications for appointments
- SMS alerts for queue status
- Analytics and reporting dashboard
- Mobile app (React Native)
- WebSocket for real-time updates
- Appointment reminders
- Payment integration

---

**Created**: April 21, 2026 | **Version**: 1.0.0 | **Java**: 17 | **Spring Boot**: 3.1.4
