package com.smartqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Appointment - Used for API requests and responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime appointmentTime;
    private String status;
    private Integer tokenNumber;
    private Integer estimatedWaitTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
