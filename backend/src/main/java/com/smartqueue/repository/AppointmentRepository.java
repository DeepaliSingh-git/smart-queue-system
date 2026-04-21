package com.smartqueue.repository;

import com.smartqueue.entity.Appointment;
import com.smartqueue.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Appointment entity
 * Extends JpaRepository to provide CRUD operations
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    /**
     * Find all appointments for a specific doctor
     */
    List<Appointment> findByDoctor(Doctor doctor);
    
    /**
     * Find appointments by doctor and status (ordered by appointment time)
     */
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.status = :status ORDER BY a.appointmentTime ASC")
    List<Appointment> findByDoctorAndStatus(@Param("doctor") Doctor doctor, @Param("status") Appointment.AppointmentStatus status);
    
    /**
     * Count appointments for a doctor with WAITING or IN_PROGRESS status
     */
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor = :doctor AND (a.status = 'WAITING' OR a.status = 'IN_PROGRESS')")
    Integer countActiveAppointmentsByDoctor(@Param("doctor") Doctor doctor);
    
    /**
     * Find all appointments waiting for a specific doctor (ordered by appointment time)
     */
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.status = 'WAITING' ORDER BY a.appointmentTime ASC")
    List<Appointment> findWaitingAppointmentsByDoctor(@Param("doctor") Doctor doctor);
    
    /**
     * Find appointments between time range for a doctor
     */
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentTime BETWEEN :startTime AND :endTime ORDER BY a.appointmentTime ASC")
    List<Appointment> findAppointmentsByDoctorAndTimeRange(
            @Param("doctor") Doctor doctor,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
