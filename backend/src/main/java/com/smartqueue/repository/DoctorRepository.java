package com.smartqueue.repository;

import com.smartqueue.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Doctor entity
 * Extends JpaRepository to provide CRUD operations
 */
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    /**
     * Find doctor by name
     */
    Doctor findByName(String name);
    
    /**
     * Find all doctors by specialization
     */
    List<Doctor> findBySpecialization(String specialization);
}
