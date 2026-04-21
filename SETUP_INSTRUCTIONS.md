# Smart Queue System - Complete Setup Guide

This guide will help you set up and run the complete Smart Queue Management System with sample doctors.

## 🚀 Quick Start (Recommended - Using Docker)

### Prerequisites
- Docker installed and running
- Docker Compose installed

### Step 1: Start All Services

```bash
# Navigate to the project root
cd smart-queue-system

# Start MySQL and Backend using Docker Compose
docker-compose up -d

# Wait for services to be healthy (about 30 seconds)
docker-compose ps
```

The backend will automatically:
- Create the MySQL database
- Initialize 5 sample doctors:
  - 🏥 Dr. Rajesh Kumar (Cardiology)
  - 🧠 Dr. Priya Sharma (Neurology)
  - 🦴 Dr. Amit Singh (Orthopedics)
  - 💆 Dr. Sneha Patel (Dermatology)
  - 🩺 Dr. Vikram Gupta (General Medicine)

### Step 2: Start Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies (if not done before)
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3001**

### Step 3: Test the Application

1. **View Doctors**: Go to http://localhost:3001 to see the list of doctors with statistics
2. **Book Appointment**:
   - Click "Book Appointment" from the navbar
   - Fill in patient details
   - Select a doctor from the dropdown (now populated!)
   - Choose date and time
   - Click "Book Appointment"
3. **View Queue**: Click "Queue Status" to see real-time queue updates
4. **Admin Dashboard**: Access at http://localhost:3001/admin-dashboard to manage queue

---

## 💻 Local Development Setup (Without Docker)

### Prerequisites
- Java 17 or higher installed
- MySQL 8.0 running locally
- Node.js 16+ installed
- Maven 3.8.4+

### Backend Setup

#### Step 1: Database Setup

Create database and user in MySQL:

```bash
mysql -u root -p

# Inside MySQL CLI:
CREATE DATABASE smart_queue_db;
CREATE USER 'smartqueue'@'localhost' IDENTIFIED BY 'smartqueue123';
GRANT ALL PRIVILEGES ON smart_queue_db.* TO 'smartqueue'@'localhost';
FLUSH PRIVILEGES;
```

#### Step 2: Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_queue_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

server.port=8080
server.servlet.context-path=/api

spring.application.name=smart-queue-management
logging.level.root=WARN
logging.level.com.smartqueue=DEBUG
```

#### Step 3: Build and Run Backend

```bash
cd backend

# Build the project
mvn clean package -DskipTests

# Run the backend
mvn spring-boot:run
```

Backend will be available at: **http://localhost:8080/api**

When backend starts, it will automatically create 5 sample doctors in the database.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3001**

---

## 📋 Sample Doctors Information

When the system starts, these 5 doctors are automatically created:

| Doctor | Specialization | Available Slots | ID |
|--------|----------------|----------------|----|
| Dr. Rajesh Kumar | Cardiology | 20 | 1 |
| Dr. Priya Sharma | Neurology | 18 | 2 |
| Dr. Amit Singh | Orthopedics | 22 | 3 |
| Dr. Sneha Patel | Dermatology | 15 | 4 |
| Dr. Vikram Gupta | General Medicine | 25 | 5 |

---

## 🔌 API Endpoint

**Base URL**: `http://localhost:8080/api` (or `http://backend:8080/api` in Docker)

### Key Endpoints

```bash
# Get all doctors
curl http://localhost:8080/api/doctors

# Get queue for a doctor
curl http://localhost:8080/api/appointments/queue/1

# Book appointment (replace with actual IDs and datetime)
curl -X POST "http://localhost:8080/api/appointments/book?patientId=1&doctorId=1&appointmentTime=2026-04-22T10:00:00"
```

---

## 🛑 Stop All Services

### Docker Setup
```bash
docker-compose down

# To remove volumes (clear database)
docker-compose down -v
```

### Local Development
Press `Ctrl+C` in terminal running backend and frontend

---

## 🐛 Troubleshooting

### Problem: Doctor dropdown is empty

**Solution**: Ensure backend is running and connected to database
```bash
# Check backend logs
docker-compose logs backend

# Or check if backend is running
curl http://localhost:8080/api/doctors
```

### Problem: Can't connect to MySQL in Docker

**Solution**: Check if MySQL service is healthy
```bash
docker-compose ps  # Check STATUS column for mysql service
docker-compose logs mysql  # View MySQL logs
```

### Problem: Port 3001 already in use

**Solution**: Kill the process on that port
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3001
kill -9 <PID>
```

### Problem: Frontend can't connect to backend

**Solution**: Update `frontend/src/services/api.js`:
```javascript
// For Docker (use service name)
const API_BASE_URL = 'http://backend:8080/api'

// For local development
const API_BASE_URL = 'http://localhost:8080/api'
```

---

## 📊 Features Enabled

✅ **Doctor List** - View all 5 pre-loaded doctors  
✅ **Doctor Card** - See doctor info and queue status  
✅ **Appointment Booking** - Book with auto-populated doctors  
✅ **Queue Status** - Track real-time queue (auto-refresh every 5 seconds)  
✅ **Admin Dashboard** - Manage queue, call next patient, mark complete  
✅ **Form Validation** - Email, date, time constraints  
✅ **Mobile Responsive** - Works on all devices  

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs: `docker-compose logs backend`
3. Review frontend console: Open browser DevTools (F12)
4. Check database connection in application.properties

**Current Date**: April 21, 2026  
**Version**: 1.0.0  
**Backend**: Spring Boot 3.1.4 (Java 17)  
**Frontend**: React 18.2.0 (Vite 4.3.9)
