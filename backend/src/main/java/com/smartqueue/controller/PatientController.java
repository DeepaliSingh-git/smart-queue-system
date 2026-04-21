package com.smartqueue.controller;

import com.smartqueue.dto.ApiResponse;
import com.smartqueue.dto.PatientDTO;
import com.smartqueue.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Patient operations
 * Handles REST endpoints for patient management
 */
@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PatientController {
    
    private final PatientService patientService;
    
    /**
     * Register a new patient
     * POST /api/patients
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PatientDTO>> registerPatient(@RequestBody PatientDTO patientDTO) {
        PatientDTO savedPatient = patientService.registerPatient(patientDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Patient registered successfully", savedPatient),
                HttpStatus.CREATED
        );
    }
    
    /**
     * Get all patients
     * GET /api/patients
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientDTO>>> getAllPatients() {
        List<PatientDTO> patients = patientService.getAllPatients();
        return ResponseEntity.ok(
                ApiResponse.success("Patients retrieved successfully", patients)
        );
    }
    
    /**
     * Get patient by ID
     * GET /api/patients/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientById(@PathVariable Long id) {
        PatientDTO patient = patientService.getPatientById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Patient retrieved successfully", patient)
        );
    }
    
    /**
     * Get patient by email
     * GET /api/patients/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientByEmail(@PathVariable String email) {
        PatientDTO patient = patientService.getPatientByEmail(email);
        return ResponseEntity.ok(
                ApiResponse.success("Patient retrieved successfully", patient)
        );
    }
    
    /**
     * Update patient information
     * PUT /api/patients/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDTO>> updatePatient(
            @PathVariable Long id,
            @RequestBody PatientDTO patientDTO) {
        PatientDTO updatedPatient = patientService.updatePatient(id, patientDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Patient updated successfully", updatedPatient)
        );
    }
    
    /**
     * Delete patient
     * DELETE /api/patients/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(
                ApiResponse.success("Patient deleted successfully")
        );
    }
}
