# Smart Queue Management System - Backend API

A robust Spring Boot backend for managing doctor appointments and patient queues. This system handles appointment booking, queue management, and estimated wait time calculations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Docker Deployment](#docker-deployment)

---

## ✨ Features

✅ Doctor Management (CRUD operations)
✅ Patient Registration and Management
✅ Appointment Booking System
✅ Real-time Queue Management
✅ Estimated Wait Time Calculation
✅ Appointment Status Tracking (WAITING, IN_PROGRESS, COMPLETED, CANCELLED)
✅ Global Exception Handling
✅ Validation with proper error messages
✅ Standardized JSON API Responses
✅ MySQL Database with JPA/Hibernate ORM
✅ CORS enabled for frontend communication

---

## 🛠 Tech Stack

- **Framework**: Spring Boot 3.1.4
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Apache Maven
- **Logging**: SLF4J with Logback
- **Validation**: Jakarta Bean Validation
- **Additional**: Lombok (for reducing boilerplate)

---

## 📁 Project Structure

```
backend/
├── pom.xml                                    # Maven dependencies
├── src/main/
│   ├── java/com/smartqueue/
│   │   ├── SmartQueueManagementApplication.java    # Main application class
│   │   ├── controller/                              # REST Controllers
│   │   │   ├── DoctorController.java
│   │   │   ├── PatientController.java
│   │   │   └── AppointmentController.java
│   │   ├── service/                                 # Business Logic Layer
│   │   │   ├── DoctorService.java
│   │   │   ├── PatientService.java
│   │   │   └── AppointmentService.java
│   │   ├── repository/                              # Data Access Layer
│   │   │   ├── DoctorRepository.java
│   │   │   ├── PatientRepository.java
│   │   │   └── AppointmentRepository.java
│   │   ├── entity/                                  # JPA Entities
│   │   │   ├── Doctor.java
│   │   │   ├── Patient.java
│   │   │   └── Appointment.java
│   │   ├── dto/                                     # Data Transfer Objects
│   │   │   ├── DoctorDTO.java
│   │   │   ├── PatientDTO.java
│   │   │   ├── AppointmentDTO.java
│   │   │   ├── QueueDTO.java
│   │   │   └── ApiResponse.java
│   │   └── exception/                               # Exception Handling
│   │       ├── GlobalExceptionHandler.java
│   │       └── ResourceNotFoundException.java
│   └── resources/
│       └── application.properties                   # Configuration
└── README.md                                        # This file
```

---

## 📦 Prerequisites

Before running the application, ensure you have:

1. **Java 17 or higher**: [Download here](https://www.oracle.com/java/technologies/downloads/#java17)
2. **Apache Maven 3.8+**: [Download here](https://maven.apache.org/download.cgi)
3. **MySQL 8.0 or higher**: [Download here](https://dev.mysql.com/downloads/mysql/)
4. **Git**: For version control (optional)

### Verify Installations

```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check MySQL version
mysql --version
```

---

## 🚀 Setup Instructions

### Step 1: Create MySQL Database

Open MySQL and execute:

```sql
-- Create database
CREATE DATABASE smart_queue_db;

-- Verify database
SHOW DATABASES;
```

Or use command line:

```bash
mysql -u root -p -e "CREATE DATABASE smart_queue_db;"
```

### Step 2: Configure Database Credentials

Navigate to `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_queue_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```

**Note**: Change `root` password to your MySQL password if different.

### Step 3: Download Dependencies

Navigate to the backend folder and run:

```bash
cd backend
mvn clean install
```

This will download all required dependencies from Maven Central Repository.

---

## 🏃 Running the Application

### Option 1: Using Maven (Recommended)

```bash
cd backend
mvn spring-boot:run
```

**Expected Output:**
```
==========================================
Smart Queue Management System - Backend API
Server running on: http://localhost:8080/api
==========================================
```

### Option 2: Using JAR File

First, build the project:

```bash
cd backend
mvn clean package
```

Then run:

```bash
java -jar target/smart-queue-management-1.0.0.jar
```

### Verify the Application

Test if the server is running:

```bash
# Using curl
curl http://localhost:8080/api/doctors

# Or open in browser
http://localhost:8080/api/doctors
```

---

## 📡 API Endpoints

### Base URL: `http://localhost:8080/api`

### 1️⃣ Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/doctors` | Add a new doctor |
| GET | `/doctors` | Get all doctors |
| GET | `/doctors/{id}` | Get doctor by ID |
| GET | `/doctors/specialization/{specialization}` | Get doctors by specialization |
| PUT | `/doctors/{id}` | Update doctor information |
| DELETE | `/doctors/{id}` | Delete doctor |

**Add Doctor Example:**
```bash
curl -X POST http://localhost:8080/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "specialization": "Cardiology",
    "availableSlots": 10
  }'
```

---

### 2️⃣ Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patients` | Register a new patient |
| GET | `/patients` | Get all patients |
| GET | `/patients/{id}` | Get patient by ID |
| GET | `/patients/email/{email}` | Get patient by email |
| PUT | `/patients/{id}` | Update patient information |
| DELETE | `/patients/{id}` | Delete patient |

**Register Patient Example:**
```bash
curl -X POST http://localhost:8080/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210"
  }'
```

---

### 3️⃣ Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/appointments/book` | Book an appointment |
| GET | `/appointments/doctor/{doctorId}` | Get all appointments for a doctor |
| GET | `/appointments/queue/{doctorId}` | Get queue status for a doctor |
| GET | `/appointments/{id}` | Get appointment by ID |
| PUT | `/appointments/{id}/status` | Update appointment status |
| GET | `/appointments/wait-time/{doctorId}` | Get estimated wait time |
| GET | `/appointments/next-patient/{doctorId}` | Get next patient in queue |
| DELETE | `/appointments/{id}` | Delete appointment |

**Book Appointment Example:**
```bash
curl -X POST "http://localhost:8080/api/appointments/book?patientId=1&doctorId=1&appointmentTime=2026-04-25T10:00:00" \
  -H "Content-Type: application/json"
```

**Get Queue Example:**
```bash
curl -X GET http://localhost:8080/api/appointments/queue/1
```

**Update Appointment Status Example:**
```bash
curl -X PUT "http://localhost:8080/api/appointments/1/status?status=IN_PROGRESS" \
  -H "Content-Type: application/json"
```

---

## 🐳 Docker Deployment (Optional)

### Create Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/smart-queue-management-1.0.0.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

### Create docker-compose.yml

In project root, create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: smart_queue_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/smart_queue_db?useSSL=false
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - mysql

volumes:
  mysql_data:
```

### Run Docker Compose

```bash
docker-compose up -d
```

---

## 📊 Queue Management Logic

The appointment service includes intelligent queue management:

1. **Estimated Wait Time**: Calculated based on number of waiting patients
   - Default consultation time: 15 minutes per patient
   - Wait time = Number of waiting patients × 15 minutes

2. **Token Number**: Automatically assigned based on order of booking

3. **Status Flow**:
   - `WAITING` → `IN_PROGRESS` → `COMPLETED`
   - Or `WAITING` → `CANCELLED`

4. **Automatic Recalculation**: When a patient completes or cancels, wait times for remaining patients are recalculated

---

## 🔧 Configuration

### application.properties

Key configurations:

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smart_queue_db
spring.datasource.username=root
spring.datasource.password=root

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Logging
logging.level.com.smartqueue=DEBUG
```

---

## ❌ Troubleshooting

### 1. Database Connection Error

**Error**: `Cannot connect to database`

**Solution**:
```bash
# Verify MySQL is running
mysql -u root -p -e "SELECT 1;"

# Check credentials in application.properties
# Ensure database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### 2. Port Already in Use

**Error**: `Port 8080 already in use`

**Solution**:
```bash
# Change port in application.properties
server.port=8081

# Or kill process using port 8080
# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :8080
kill -9 <PID>
```

### 3. Maven Build Failure

**Error**: `BUILD FAILURE`

**Solution**:
```bash
# Clear Maven cache
mvn clean
mvn install -U

# Check Java version
java -version
```

### 4. Entity Mapping Issues

**Solution**:
```bash
# Drop and recreate tables (development only)
# In MySQL:
DROP DATABASE smart_queue_db;
CREATE DATABASE smart_queue_db;

# Restart the application
```

---

## 📝 Common Commands

```bash
# Navigate to backend folder
cd backend

# Build project
mvn clean package

# Run tests
mvn test

# Run application
mvn spring-boot:run

# Stop application
Ctrl + C

# Check project structure
mvn compile

# View dependencies
mvn dependency:tree

# Format code
mvn spotless:apply
```

---

## 🔗 Integration with Frontend

The backend is configured to accept requests from any origin (CORS enabled).

**Frontend can connect using:**

```javascript
const baseURL = 'http://localhost:8080/api';

// Add Doctor
fetch(`${baseURL}/doctors`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Dr. Smith',
    specialization: 'Cardiology',
    availableSlots: 10
  })
});

// Book Appointment
fetch(`${baseURL}/appointments/book?patientId=1&doctorId=1&appointmentTime=2026-04-25T10:00:00`, {
  method: 'POST'
});
```

---

## 📚 API Response Format

All responses follow a standard format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "timestamp": 1713607200000
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "timestamp": 1713607200000
}
```

---

## 🤝 Contributing

To extend the project:

1. Follow the existing layer architecture (Controller → Service → Repository)
2. Use DTOs for API communication
3. Add validation annotations to entities
4. Implement proper exception handling
5. Write unit tests for new features

---

## 📄 License

This project is created for hackathon/educational purposes.

---

## ✅ Checklist for Production

- [ ] Update MySQL credentials in `application.properties`
- [ ] Enable HTTPS in production
- [ ] Implement authentication/authorization (JWT)
- [ ] Add rate limiting
- [ ] Enable logging to files
- [ ] Set up CI/CD pipeline
- [ ] Add unit and integration tests
- [ ] Configure backup strategy for database
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up monitoring and alerts

---

## 💡 Need Help?

1. Check logs: Located in application startup logs
2. Verify all prerequisites are installed
3. Ensure MySQL is running and database is created
4. Check if port 8080 is available
5. Review application.properties configuration

---

**Happy Coding! 🚀**
