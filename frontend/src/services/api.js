import axios from 'axios'

// Configure API base URL
const API_BASE_URL = 'https://smart-queue-system-1.onrender.com/'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ==================== DOCTOR API ====================

/**
 * Get all doctors
 */
export const getDoctors = async () => {
  try {
    const response = await apiClient.get('/doctors')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching doctors:', error)
    throw error
  }
}

/**
 * Get doctor by ID
 */
export const getDoctorById = async (doctorId) => {
  try {
    const response = await apiClient.get(`/doctors/${doctorId}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching doctor:', error)
    throw error
  }
}

/**
 * Add new doctor
 */
export const addDoctor = async (doctorData) => {
  try {
    const response = await apiClient.post('/doctors', doctorData)
    return response.data.data
  } catch (error) {
    console.error('Error adding doctor:', error)
    throw error
  }
}

/**
 * Get doctors by specialization
 */
export const getDoctorsBySpecialization = async (specialization) => {
  try {
    const response = await apiClient.get(`/doctors/specialization/${specialization}`)
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching doctors by specialization:', error)
    throw error
  }
}

// ==================== PATIENT API ====================

/**
 * Register new patient
 */
export const registerPatient = async (patientData) => {
  try {
    const response = await apiClient.post('/patients', patientData)
    return response.data.data
  } catch (error) {
    console.error('Error registering patient:', error)
    throw error
  }
}

/**
 * Get all patients
 */
export const getPatients = async () => {
  try {
    const response = await apiClient.get('/patients')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

/**
 * Get patient by email
 */
export const getPatientByEmail = async (email) => {
  try {
    const response = await apiClient.get(`/patients/email/${email}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching patient:', error)
    throw error
  }
}

// ==================== APPOINTMENT API ====================

/**
 * Book an appointment
 * Handles patient registration and appointment booking
 */
export const bookAppointment = async (appointmentData) => {
  try {
    // First, register the patient or get existing patient
    let patientId
    try {
      // Try to get existing patient by email
      const existingPatient = await getPatientByEmail(appointmentData.email)
      patientId = existingPatient.id
    } catch (error) {
      // If patient doesn't exist, create a new one
      const newPatient = await registerPatient({
        name: appointmentData.name,
        email: appointmentData.email,
        phoneNumber: appointmentData.phoneNumber,
      })
      patientId = newPatient.id
    }

    // Then book the appointment
    const response = await apiClient.post(
      `/appointments/book`,
      {
        patientId: patientId,
        doctorId: appointmentData.doctorId,
        appointmentTime: appointmentData.appointmentTime,
        patientName: appointmentData.name,
        patientEmail: appointmentData.email
      }
    )
    return response.data
  } catch (error) {
    console.error('Error booking appointment:', error)
    throw error
  }
}

/**
 * Get queue status for a doctor
 */
export const getQueueByDoctor = async (doctorId) => {
  try {
    const response = await apiClient.get(`/appointments/queue/${doctorId}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching queue:', error)
    throw error
  }
}

/**
 * Get all appointments for a doctor
 */
export const getAppointmentsByDoctor = async (doctorId) => {
  try {
    const response = await apiClient.get(`/appointments/doctor/${doctorId}`)
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching appointments:', error)
    throw error
  }
}

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await apiClient.put(
      `/appointments/${appointmentId}/status`,
      { status }
    )
    return response.data.data
  } catch (error) {
    console.error('Error updating appointment status:', error)
    throw error
  }
}

/**
 * Get next patient in queue
 */
export const getNextPatientInQueue = async (doctorId) => {
  try {
    const response = await apiClient.get(`/appointments/next-patient/${doctorId}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching next patient:', error)
    throw error
  }
}

/**
 * Get estimated wait time for a doctor
 */
export const getEstimatedWaitTime = async (doctorId) => {
  try {
    const response = await apiClient.get(`/appointments/wait-time/${doctorId}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching wait time:', error)
    throw error
  }
}

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await apiClient.get(`/appointments/${appointmentId}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching appointment:', error)
    throw error
  }
}

/**
 * Delete appointment
 */
export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.delete(`/appointments/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting appointment:', error)
    throw error
  }
}

// Export all API functions as an object for easier importing
export const api = {
  // Doctor APIs
  getDoctors,
  getDoctorById,
  addDoctor,
  getDoctorsBySpecialization,
  // Patient APIs
  registerPatient,
  getPatients,
  getPatientByEmail,
  // Appointment APIs
  bookAppointment,
  getQueueByDoctor,
  getAppointmentsByDoctor,
  updateAppointmentStatus,
  getNextPatientInQueue,
  getEstimatedWaitTime,
  getAppointmentById,
  deleteAppointment,
}

export default apiClient
