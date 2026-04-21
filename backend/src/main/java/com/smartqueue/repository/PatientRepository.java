package com.smartqueue.repository;

import com.smartqueue.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Patient entity
 * Extends JpaRepository to provide CRUD operations
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    /**
     * Find patient by email
     */
    Optional<Patient> findByEmail(String email);
    
    /**
     * Find patient by name
     */
    Patient findByName(String name);
}
