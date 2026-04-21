package com.smartqueue.service;

import com.smartqueue.dto.PatientDTO;
import com.smartqueue.entity.Patient;
import com.smartqueue.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Patient operations
 * Handles business logic for patient management
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {
    
    private final PatientRepository patientRepository;
    
    /**
     * Register a new patient
     */
    public PatientDTO registerPatient(PatientDTO patientDTO) {
        // Check if email already exists
        if (patientRepository.findByEmail(patientDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Patient with this email already exists");
        }
        
        Patient patient = new Patient();
        patient.setName(patientDTO.getName());
        patient.setEmail(patientDTO.getEmail());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        
        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }
    
    /**
     * Get all patients
     */
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get patient by ID
     */
    public PatientDTO getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
        return convertToDTO(patient);
    }
    
    /**
     * Get patient by email
     */
    public PatientDTO getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found with email: " + email));
        return convertToDTO(patient);
    }
    
    /**
     * Update patient information
     */
    public PatientDTO updatePatient(Long patientId, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
        
        patient.setName(patientDTO.getName());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        
        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }
    
    /**
     * Delete patient by ID
     */
    public void deletePatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
        patientRepository.delete(patient);
    }
    
    /**
     * Get patient entity by ID (internal use)
     */
    public Patient getPatientEntityById(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
    }
    
    /**
     * Convert Patient entity to DTO
     */
    private PatientDTO convertToDTO(Patient patient) {
        return new PatientDTO(
                patient.getId(),
                patient.getName(),
                patient.getEmail(),
                patient.getPhoneNumber(),
                patient.getCreatedAt(),
                patient.getUpdatedAt()
        );
    }
}
