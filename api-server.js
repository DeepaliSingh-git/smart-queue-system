#!/usr/bin/env node

/**
 * Smart Queue System - Mock API Server
 * Runs on port 8080 and serves sample doctor and appointment data
 * Uses only Node.js built-in modules (no npm dependencies)
 */

const http = require('http');
const url = require('url');

const PORT = 8080;
let patientCounter = 1;
let appointmentCounter = 1;

// In-memory storage
const doctors = [
  { id: 1, name: 'Dr. Rajesh Kumar', specialization: 'Cardiology', availableSlots: 20, image: '/assets/doctors/DrRajesh.png' },
  { id: 2, name: 'Dr. Priya Sharma', specialization: 'Neurology', availableSlots: 18, image: '/assets/doctors/DrPriya.png' },
  { id: 3, name: 'Dr. Amit Singh', specialization: 'Orthopedics', availableSlots: 22, image: '/assets/doctors/DrAmit.png' },
  { id: 4, name: 'Dr. Sneha Patel', specialization: 'Dermatology', availableSlots: 15, image: '/assets/doctors/DrSneha.png' },
  { id: 5, name: 'Dr. Vikram Gupta', specialization: 'General Medicine', availableSlots: 25, image: '/assets/doctors/DrVikram.png' }
];

const patients = {};
const appointments = {};

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseQueryString(queryStr) {
  const params = {};
  if (queryStr) {
    queryStr.split('&').forEach(part => {
      const [key, value] = part.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return params;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // GET /api/doctors
  if (pathname === '/api/doctors' && method === 'GET') {
    return sendResponse(res, 200, { status: 'success', message: 'Doctors retrieved', data: doctors });
  }

  // GET /api/doctors/:id
  const doctorIdMatch = pathname.match(/^\/api\/doctors\/(\d+)$/);
  if (doctorIdMatch && method === 'GET') {
    const id = parseInt(doctorIdMatch[1]);
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return sendResponse(res, 404, { status: 'error', message: 'Doctor not found' });
    return sendResponse(res, 200, { status: 'success', message: 'Doctor retrieved', data: doctor });
  }

  // POST /api/patients
  if (pathname === '/api/patients' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const patientData = JSON.parse(body);
        const patient = {
          id: patientCounter++,
          name: patientData.name,
          email: patientData.email,
          phoneNumber: patientData.phoneNumber
        };
        patients[patient.email] = patient;
        return sendResponse(res, 201, { status: 'success', message: 'Patient registered', data: patient });
      } catch (e) {
        return sendResponse(res, 400, { status: 'error', message: 'Invalid request' });
      }
    });
    return;
  }

  // GET /api/patients/email/:email
  const emailMatch = pathname.match(/^\/api\/patients\/email\/(.+)$/);
  if (emailMatch && method === 'GET') {
    const email = decodeURIComponent(emailMatch[1]);
    const patient = patients[email];
    if (!patient) return sendResponse(res, 404, { status: 'error', message: 'Patient not found' });
    return sendResponse(res, 200, { status: 'success', message: 'Patient retrieved', data: patient });
  }

  // POST /api/appointments/book
  if (pathname === '/api/appointments/book' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const appointmentData = JSON.parse(body);
        const { patientId, doctorId, appointmentTime, patientName, patientEmail } = appointmentData;

        if (!patientId || !doctorId || !appointmentTime) {
          return sendResponse(res, 400, { status: 'error', message: 'Missing required parameters' });
        }

        const appointment = {
          id: appointmentCounter++,
          patientId: parseInt(patientId),
          doctorId: parseInt(doctorId),
          patientName: patientName || '',
          patientEmail: patientEmail || '',
          appointmentTime,
          status: 'WAITING',
          tokenNumber: appointmentCounter,
          createdAt: new Date().toISOString()
        };

        appointments[appointment.id] = appointment;
        return sendResponse(res, 201, { status: 'success', message: 'Appointment booked', data: appointment });
      } catch (e) {
        return sendResponse(res, 400, { status: 'error', message: 'Invalid request body' });
      }
    });
    return;
  }

  // GET /api/appointments/queue/:doctorId
  const queueMatch = pathname.match(/^\/api\/appointments\/queue\/(\d+)$/);
  if (queueMatch && method === 'GET') {
    const doctorId = parseInt(queueMatch[1]);
    const queue = Object.values(appointments)
      .filter(a => a.doctorId === doctorId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return sendResponse(res, 200, { status: 'success', message: 'Queue retrieved', data: queue });
  }

  // GET /api/appointments/doctor/:doctorId
  const doctorApptMatch = pathname.match(/^\/api\/appointments\/doctor\/(\d+)$/);
  if (doctorApptMatch && method === 'GET') {
    const doctorId = parseInt(doctorApptMatch[1]);
    const docAppointments = Object.values(appointments).filter(a => a.doctorId === doctorId);
    return sendResponse(res, 200, { status: 'success', message: 'Appointments retrieved', data: docAppointments });
  }

  // PUT /api/appointments/:id/status
  const statusMatch = pathname.match(/^\/api\/appointments\/(\d+)\/status$/);
  if (statusMatch && method === 'PUT') {
    const id = parseInt(statusMatch[1]);
    const params = parsedUrl.query;
    const { status } = params;

    const appointment = appointments[id];
    if (!appointment) return sendResponse(res, 404, { status: 'error', message: 'Appointment not found' });

    appointment.status = status || 'COMPLETED';
    appointment.updatedAt = new Date().toISOString();
    return sendResponse(res, 200, { status: 'success', message: 'Appointment updated', data: appointment });
  }

  // GET /api/health
  if (pathname === '/api/health' && method === 'GET') {
    return sendResponse(res, 200, { status: 'success', message: 'API is running', timestamp: new Date().toISOString() });
  }

  // 404
  return sendResponse(res, 404, { status: 'error', message: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`\n✅ Smart Queue Mock API Server started on port ${PORT}`);
  console.log(`📋 Sample doctors loaded: ${doctors.length} doctors`);
  console.log(`\n🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`\n📚 Available Endpoints:`);
  console.log(`   GET    /api/doctors`);
  console.log(`   GET    /api/health`);
  console.log(`   POST   /api/appointments/book`);
  console.log(`   GET    /api/appointments/queue/:doctorId\n`);
  console.log('Waiting for requests...\n');
});
