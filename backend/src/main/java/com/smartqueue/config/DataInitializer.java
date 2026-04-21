package com.smartqueue.config;

import com.smartqueue.entity.Doctor;
import com.smartqueue.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Data Initializer Component
 * Loads sample data on application startup
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {
    
    private final DoctorRepository doctorRepository;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Check if doctors already exist
        if (doctorRepository.count() == 0) {
            initializeSampleDoctors();
        }
    }
    
    /**
     * Initialize sample doctors
     */
    private void initializeSampleDoctors() {
        // Doctor 1: Dr. Rajesh Kumar - Cardiologist
        Doctor doctor1 = new Doctor();
        doctor1.setName("Dr. Rajesh Kumar");
        doctor1.setSpecialization("Cardiology");
        doctor1.setAvailableSlots(20);
        doctorRepository.save(doctor1);
        
        // Doctor 2: Dr. Priya Sharma - Neurology
        Doctor doctor2 = new Doctor();
        doctor2.setName("Dr. Priya Sharma");
        doctor2.setSpecialization("Neurology");
        doctor2.setAvailableSlots(18);
        doctorRepository.save(doctor2);
        
        // Doctor 3: Dr. Amit Singh - Orthopedics
        Doctor doctor3 = new Doctor();
        doctor3.setName("Dr. Amit Singh");
        doctor3.setSpecialization("Orthopedics");
        doctor3.setAvailableSlots(22);
        doctorRepository.save(doctor3);
        
        // Doctor 4: Dr. Sneha Patel - Dermatology
        Doctor doctor4 = new Doctor();
        doctor4.setName("Dr. Sneha Patel");
        doctor4.setSpecialization("Dermatology");
        doctor4.setAvailableSlots(15);
        doctorRepository.save(doctor4);
        
        // Doctor 5: Dr. Vikram Gupta - General Medicine
        Doctor doctor5 = new Doctor();
        doctor5.setName("Dr. Vikram Gupta");
        doctor5.setSpecialization("General Medicine");
        doctor5.setAvailableSlots(25);
        doctorRepository.save(doctor5);
        
        System.out.println("✓ Sample doctors initialized successfully!");
    }
}
