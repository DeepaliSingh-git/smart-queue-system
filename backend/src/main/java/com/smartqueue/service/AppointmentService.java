package com.smartqueue.service;

import com.smartqueue.dto.AppointmentDTO;
import com.smartqueue.dto.QueueDTO;
import com.smartqueue.entity.Appointment;
import com.smartqueue.entity.Doctor;
import com.smartqueue.entity.Patient;
import com.smartqueue.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Appointment operations
 * Handles business logic for appointment management and queue operations
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;
    
    // Constants for wait time calculation
    private static final int AVERAGE_CONSULTATION_TIME = 15; // minutes
    
    /**
     * Book an appointment for a patient with a doctor
     */
    public AppointmentDTO bookAppointment(Long patientId, Long doctorId, LocalDateTime appointmentTime) {
        Patient patient = patientService.getPatientEntityById(patientId);
        Doctor doctor = doctorService.getDoctorEntityById(doctorId);
        
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setStatus(Appointment.AppointmentStatus.WAITING);
        
        // Calculate estimated wait time
        int waitingCount = appointmentRepository.findWaitingAppointmentsByDoctor(doctor).size();
        int estimatedWaitTime = (waitingCount * AVERAGE_CONSULTATION_TIME);
        appointment.setEstimatedWaitTime(estimatedWaitTime);
        
        // Assign token number
        List<Appointment> allAppointments = appointmentRepository.findByDoctor(doctor);
        Integer tokenNumber = allAppointments.size() + 1;
        appointment.setTokenNumber(tokenNumber);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToDTO(savedAppointment);
    }
    
    /**
     * Get all appointments for a specific doctor
     */
    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        Doctor doctor = doctorService.getDoctorEntityById(doctorId);
        return appointmentRepository.findByDoctor(doctor)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get waiting appointments queue for a doctor
     */
    public QueueDTO getQueueByDoctor(Long doctorId) {
        Doctor doctor = doctorService.getDoctorEntityById(doctorId);
        
        List<Appointment> waitingAppointments = appointmentRepository
                .findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.WAITING);
        
        List<Appointment> inProgressAppointments = appointmentRepository
                .findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.IN_PROGRESS);
        
        List<Appointment> allAppointments = appointmentRepository.findByDoctor(doctor);
        
        return QueueDTO.builder()
                .doctorId(doctor.getId())
                .doctorName(doctor.getName())
                .specialization(doctor.getSpecialization())
                .totalPatientsInQueue(allAppointments.size())
                .totalWaitingPatients(waitingAppointments.size())
                .totalInProgressPatients(inProgressAppointments.size())
                .appointments(waitingAppointments.stream().map(this::convertToDTO).collect(Collectors.toList()))
                .build();
    }
    
    /**
     * Update appointment status
     */
    public AppointmentDTO updateAppointmentStatus(Long appointmentId, String newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        
        try {
            Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(newStatus.toUpperCase());
            appointment.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + newStatus + ". Valid statuses are: WAITING, IN_PROGRESS, COMPLETED, CANCELLED");
        }
        
        // Recalculate wait times for remaining waiting appointments
        if (newStatus.equalsIgnoreCase("COMPLETED") || newStatus.equalsIgnoreCase("CANCELLED")) {
            recalculateWaitTimes(appointment.getDoctor());
        }
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return convertToDTO(updatedAppointment);
    }
    
    /**
     * Get appointment by ID
     */
    public AppointmentDTO getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        return convertToDTO(appointment);
    }
    
    /**
     * Calculate estimated wait time for a patient in queue
     */
    public Integer calculateEstimatedWaitTime(Long doctorId) {
        Doctor doctor = doctorService.getDoctorEntityById(doctorId);
        List<Appointment> waitingAppointments = appointmentRepository
                .findWaitingAppointmentsByDoctor(doctor);
        
        return waitingAppointments.size() * AVERAGE_CONSULTATION_TIME;
    }
    
    /**
     * Get next patient in queue for a doctor
     */
    public AppointmentDTO getNextPatientInQueue(Long doctorId) {
        Doctor doctor = doctorService.getDoctorEntityById(doctorId);
        List<Appointment> waitingAppointments = appointmentRepository
                .findWaitingAppointmentsByDoctor(doctor);
        
        if (waitingAppointments.isEmpty()) {
            throw new RuntimeException("No waiting appointments for doctor ID: " + doctorId);
        }
        
        return convertToDTO(waitingAppointments.get(0));
    }
    
    /**
     * Recalculate wait times for all waiting appointments of a doctor
     */
    private void recalculateWaitTimes(Doctor doctor) {
        List<Appointment> waitingAppointments = appointmentRepository
                .findWaitingAppointmentsByDoctor(doctor);
        
        for (int i = 0; i < waitingAppointments.size(); i++) {
            Appointment appointment = waitingAppointments.get(i);
            appointment.setEstimatedWaitTime(i * AVERAGE_CONSULTATION_TIME);
            appointmentRepository.save(appointment);
        }
    }
    
    /**
     * Delete appointment by ID
     */
    public void deleteAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        appointmentRepository.delete(appointment);
    }
    
    /**
     * Convert Appointment entity to DTO
     */
    private AppointmentDTO convertToDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getAppointmentTime(),
                appointment.getStatus().toString(),
                appointment.getTokenNumber(),
                appointment.getEstimatedWaitTime(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt()
        );
    }
}
