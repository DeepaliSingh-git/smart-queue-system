package com.smartqueue.controller;

import com.smartqueue.dto.ApiResponse;
import com.smartqueue.dto.DoctorDTO;
import com.smartqueue.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Doctor operations
 * Handles REST endpoints for doctor management
 */
@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DoctorController {
    
    private final DoctorService doctorService;
    
    /**
     * Add a new doctor
     * POST /api/doctors
     */
    @PostMapping
    public ResponseEntity<ApiResponse<DoctorDTO>> addDoctor(@RequestBody DoctorDTO doctorDTO) {
        DoctorDTO savedDoctor = doctorService.addDoctor(doctorDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Doctor added successfully", savedDoctor),
                HttpStatus.CREATED
        );
    }
    
    /**
     * Get all doctors
     * GET /api/doctors
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(
                ApiResponse.success("Doctors retrieved successfully", doctors)
        );
    }
    
    /**
     * Get doctor by ID
     * GET /api/doctors/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> getDoctorById(@PathVariable Long id) {
        DoctorDTO doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Doctor retrieved successfully", doctor)
        );
    }
    
    /**
     * Get doctors by specialization
     * GET /api/doctors/specialization/{specialization}
     */
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(
                ApiResponse.success("Doctors retrieved successfully", doctors)
        );
    }
    
    /**
     * Update doctor information
     * PUT /api/doctors/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> updateDoctor(
            @PathVariable Long id,
            @RequestBody DoctorDTO doctorDTO) {
        DoctorDTO updatedDoctor = doctorService.updateDoctor(id, doctorDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Doctor updated successfully", updatedDoctor)
        );
    }
    
    /**
     * Delete doctor
     * DELETE /api/doctors/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(
                ApiResponse.success("Doctor deleted successfully")
        );
    }
}
