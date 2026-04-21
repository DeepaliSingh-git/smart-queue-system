package com.smartqueue.controller;

import com.smartqueue.dto.ApiResponse;
import com.smartqueue.dto.AppointmentDTO;
import com.smartqueue.dto.QueueDTO;
import com.smartqueue.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller for Appointment operations and Queue management
 * Handles REST endpoints for appointment booking and queue operations
 */
@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    
    /**
     * Book an appointment
     * POST /api/appointments/book
     * Request body: {
     *     "patientId": 1,
     *     "doctorId": 1,
     *     "appointmentTime": "2026-04-25T10:00:00"
     * }
     */
    @PostMapping("/book")
    public ResponseEntity<ApiResponse<AppointmentDTO>> bookAppointment(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestParam String appointmentTime) {
        try {
            LocalDateTime time = LocalDateTime.parse(appointmentTime);
            AppointmentDTO appointment = appointmentService.bookAppointment(patientId, doctorId, time);
            return new ResponseEntity<>(
                    ApiResponse.success("Appointment booked successfully", appointment),
                    HttpStatus.CREATED
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid appointment time format. Use: yyyy-MM-ddTHH:mm:ss");
        }
    }
    
    /**
     * Get all appointments for a doctor
     * GET /api/appointments/doctor/{doctorId}
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAppointmentsByDoctor(
            @PathVariable Long doctorId) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(
                ApiResponse.success("Appointments retrieved successfully", appointments)
        );
    }
    
    /**
     * Get queue for a specific doctor
     * GET /api/appointments/queue/{doctorId}
     */
    @GetMapping("/queue/{doctorId}")
    public ResponseEntity<ApiResponse<QueueDTO>> getQueueByDoctor(@PathVariable Long doctorId) {
        QueueDTO queue = appointmentService.getQueueByDoctor(doctorId);
        return ResponseEntity.ok(
                ApiResponse.success("Queue retrieved successfully", queue)
        );
    }
    
    /**
     * Get appointment by ID
     * GET /api/appointments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getAppointmentById(@PathVariable Long id) {
        AppointmentDTO appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Appointment retrieved successfully", appointment)
        );
    }
    
    /**
     * Update appointment status
     * PUT /api/appointments/{id}/status
     * Query param: status (WAITING, IN_PROGRESS, COMPLETED, CANCELLED)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentDTO>> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        AppointmentDTO updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(
                ApiResponse.success("Appointment status updated successfully", updatedAppointment)
        );
    }
    
    /**
     * Get estimated wait time for a doctor
     * GET /api/appointments/wait-time/{doctorId}
     */
    @GetMapping("/wait-time/{doctorId}")
    public ResponseEntity<ApiResponse<Integer>> getEstimatedWaitTime(@PathVariable Long doctorId) {
        Integer waitTime = appointmentService.calculateEstimatedWaitTime(doctorId);
        return ResponseEntity.ok(
                ApiResponse.success("Estimated wait time: " + waitTime + " minutes", waitTime)
        );
    }
    
    /**
     * Get next patient in queue for a doctor
     * GET /api/appointments/next-patient/{doctorId}
     */
    @GetMapping("/next-patient/{doctorId}")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getNextPatientInQueue(@PathVariable Long doctorId) {
        AppointmentDTO nextPatient = appointmentService.getNextPatientInQueue(doctorId);
        return ResponseEntity.ok(
                ApiResponse.success("Next patient in queue", nextPatient)
        );
    }
    
    /**
     * Delete appointment
     * DELETE /api/appointments/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(
                ApiResponse.success("Appointment deleted successfully")
        );
    }
}
