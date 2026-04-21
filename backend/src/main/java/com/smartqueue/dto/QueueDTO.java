package com.smartqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for Queue Status - Provides queue information for a doctor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueDTO {
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private Integer totalPatientsInQueue;
    private Integer totalWaitingPatients;
    private Integer totalInProgressPatients;
    private List<AppointmentDTO> appointments;
}
