package com.smartqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Doctor - Used for API requests and responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long id;
    private String name;
    private String specialization;
    private Integer availableSlots;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
