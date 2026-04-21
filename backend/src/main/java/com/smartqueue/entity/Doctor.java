package com.smartqueue.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Doctor Entity - Represents a doctor in the queue management system
 */
@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Long id;
    
    @NotBlank(message = "Doctor name cannot be blank")
    @Column(nullable = false, length = 100)
    private String name;
    
    @NotBlank(message = "Specialization cannot be blank")
    @Column(nullable = false, length = 100)
    private String specialization;
    
    @Column(name = "available_slots", nullable = false)
    private Integer availableSlots;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * JPA Lifecycle callback - automatically set createdAt before persisting
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * JPA Lifecycle callback - automatically update updatedAt before updating
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
