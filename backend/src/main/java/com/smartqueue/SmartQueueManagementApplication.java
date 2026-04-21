package com.smartqueue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Smart Queue Management System - Backend API
 * Main application entry point
 * 
 * This Spring Boot application provides REST APIs for managing doctor appointments
 * and patient queue management system.
 */
@SpringBootApplication
public class SmartQueueManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartQueueManagementApplication.class, args);
        System.out.println("==========================================");
        System.out.println("Smart Queue Management System - Backend API");
        System.out.println("Server running on: http://localhost:8080/api");
        System.out.println("==========================================");
    }
}
