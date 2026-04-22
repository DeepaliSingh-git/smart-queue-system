#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// CORS Configuration
// Allow requests from Vercel deployment and local development
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',           // Local development
      'http://localhost:5173',           // Vite dev server
      'http://127.0.0.1:3000',           // Local development (127.0.0.1)
      'http://127.0.0.1:5173',           // Vite dev server (127.0.0.1)
      'https://smart-queue-frontend-vercel.vercel.app', // Replace with your actual Vercel frontend URL
      /\.vercel\.app$/,                  // Allow all Vercel deployments
    ];

    // Allow requests without origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Preflight requests
app.options('*', cors(corsOptions));

// Initialize SQLite Database
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'smart_queue.db');

// Ensure data directory exists
await mkdir(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Helper function to promisify database operations
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initialize Database Schema
async function initializeDatabase() {
  try {
    // Create doctors table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        availableSlots INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create patients table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phoneNumber TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create appointments table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientId INTEGER NOT NULL,
        doctorId INTEGER NOT NULL,
        appointmentTime DATETIME NOT NULL,
        status TEXT DEFAULT 'WAITING',
        tokenNumber INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patientId) REFERENCES patients(id),
        FOREIGN KEY (doctorId) REFERENCES doctors(id)
      )
    `);

    // Seed initial doctors if table is empty
    const doctorCount = await getAsync('SELECT COUNT(*) as count FROM doctors');
    if (doctorCount.count === 0) {
      const doctors = [
        ['Dr. Rajesh Kumar', 'Cardiology', 20],
        ['Dr. Priya Sharma', 'Neurology', 18],
        ['Dr. Amit Singh', 'Orthopedics', 22],
        ['Dr. Sneha Patel', 'Dermatology', 15],
        ['Dr. Vikram Gupta', 'General Medicine', 25]
      ];

      for (const [name, specialization, slots] of doctors) {
        await runAsync(
          'INSERT INTO doctors (name, specialization, availableSlots) VALUES (?, ?, ?)',
          [name, specialization, slots]
        );
      }

      console.log('✅ Seeded 5 doctors into database');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Initialize database
await initializeDatabase();
console.log('✅ Database schema created and initialized');

// ==================== DOCTOR ROUTES ====================

// GET /api/doctors - Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await allAsync('SELECT * FROM doctors');
    res.json({
      status: 'success',
      message: 'Doctors retrieved',
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve doctors'
    });
  }
});

// GET /api/doctors/:id - Get doctor by ID
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await getAsync('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }
    res.json({
      status: 'success',
      message: 'Doctor retrieved',
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve doctor'
    });
  }
});

// ==================== PATIENT ROUTES ====================

// POST /api/patients - Register patient
app.post('/api/patients', async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    const result = await runAsync(
      'INSERT INTO patients (name, email, phoneNumber) VALUES (?, ?, ?)',
      [name, email, phoneNumber]
    );

    res.status(201).json({
      status: 'success',
      message: 'Patient registered',
      data: {
        id: result.lastID,
        name,
        email,
        phoneNumber
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        status: 'error',
        message: 'Patient with this email already exists'
      });
    }
    console.error('Error registering patient:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to register patient'
    });
  }
});

// GET /api/patients/email/:email - Get patient by email
app.get('/api/patients/email/:email', async (req, res) => {
  try {
    const patient = await getAsync('SELECT * FROM patients WHERE email = ?', [req.params.email]);
    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }
    res.json({
      status: 'success',
      message: 'Patient retrieved',
      data: patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve patient'
    });
  }
});

// ==================== APPOINTMENT ROUTES ====================

// POST /api/appointments/book - Book appointment
app.post('/api/appointments/book', async (req, res) => {
  try {
    const { patientId, doctorId, appointmentTime } = req.body;

    if (!patientId || !doctorId || !appointmentTime) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Get next token number for this doctor
    const lastToken = await getAsync(`
      SELECT MAX(tokenNumber) as maxToken
      FROM appointments
      WHERE doctorId = ? AND DATE(appointmentTime) = DATE(?)
    `, [doctorId, appointmentTime]);

    const tokenNumber = (lastToken?.maxToken || 0) + 1;

    const result = await runAsync(
      'INSERT INTO appointments (patientId, doctorId, appointmentTime, tokenNumber, status) VALUES (?, ?, ?, ?, ?)',
      [patientId, doctorId, appointmentTime, tokenNumber, 'WAITING']
    );

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked',
      data: {
        id: result.lastID,
        patientId,
        doctorId,
        appointmentTime,
        status: 'WAITING',
        tokenNumber
      }
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to book appointment'
    });
  }
});

// GET /api/appointments/queue/:doctorId - Get queue for doctor
app.get('/api/appointments/queue/:doctorId', async (req, res) => {
  try {
    const queue = await allAsync(`
      SELECT a.*, p.name as patientName, p.email as patientEmail
      FROM appointments a
      JOIN patients p ON a.patientId = p.id
      WHERE a.doctorId = ?
      ORDER BY a.appointmentTime, a.tokenNumber
    `, [req.params.doctorId]);

    res.json({
      status: 'success',
      message: 'Queue retrieved',
      data: queue || []
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve queue'
    });
  }
});

// GET /api/appointments/doctor/:doctorId - Get appointments for doctor
app.get('/api/appointments/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await allAsync(`
      SELECT a.*, p.name as patientName, p.email as patientEmail
      FROM appointments a
      JOIN patients p ON a.patientId = p.id
      WHERE a.doctorId = ?
      ORDER BY a.createdAt DESC
    `, [req.params.doctorId]);

    res.json({
      status: 'success',
      message: 'Appointments retrieved',
      data: appointments || []
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve appointments'
    });
  }
});

// PUT /api/appointments/:id/status - Update appointment status
app.put('/api/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status field is required'
      });
    }

    const result = await runAsync(
      'UPDATE appointments SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    const appointment = await getAsync('SELECT * FROM appointments WHERE id = ?', [req.params.id]);

    res.json({
      status: 'success',
      message: 'Appointment updated',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update appointment'
    });
  }
});

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Smart Queue Backend API started successfully`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📍 Server: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🏥 Doctors Endpoint: GET http://localhost:${PORT}/api/doctors`);
  console.log(`💓 Health Check: GET http://localhost:${PORT}/api/health`);
  console.log(`\n📦 Database: SQLite (smart_queue.db)`);
  console.log(`📋 Pre-configured with 5 sample doctors\n`);
  console.log(`${'='.repeat(60)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n📢 Shutting down gracefully...');
  db.close();
  process.exit(0);
});
