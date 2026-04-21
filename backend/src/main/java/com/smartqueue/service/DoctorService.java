package com.smartqueue.service;

import com.smartqueue.dto.DoctorDTO;
import com.smartqueue.entity.Doctor;
import com.smartqueue.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Doctor operations
 * Handles business logic for doctor management
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {
    
    private final DoctorRepository doctorRepository;
    
    /**
     * Add a new doctor
     */
    public DoctorDTO addDoctor(DoctorDTO doctorDTO) {
        Doctor doctor = new Doctor();
        doctor.setName(doctorDTO.getName());
        doctor.setSpecialization(doctorDTO.getSpecialization());
        doctor.setAvailableSlots(doctorDTO.getAvailableSlots());
        
        Doctor savedDoctor = doctorRepository.save(doctor);
        return convertToDTO(savedDoctor);
    }
    
    /**
     * Get all doctors
     */
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get doctor by ID
     */
    public DoctorDTO getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
        return convertToDTO(doctor);
    }
    
    /**
     * Get doctors by specialization
     */
    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Update doctor information
     */
    public DoctorDTO updateDoctor(Long doctorId, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
        
        doctor.setName(doctorDTO.getName());
        doctor.setSpecialization(doctorDTO.getSpecialization());
        doctor.setAvailableSlots(doctorDTO.getAvailableSlots());
        
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return convertToDTO(updatedDoctor);
    }
    
    /**
     * Delete doctor by ID
     */
    public void deleteDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
        doctorRepository.delete(doctor);
    }
    
    /**
     * Get doctor entity by ID (internal use)
     */
    public Doctor getDoctorEntityById(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
    }
    
    /**
     * Convert Doctor entity to DTO
     */
    private DoctorDTO convertToDTO(Doctor doctor) {
        return new DoctorDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getAvailableSlots(),
                doctor.getCreatedAt(),
                doctor.getUpdatedAt()
        );
    }
}
