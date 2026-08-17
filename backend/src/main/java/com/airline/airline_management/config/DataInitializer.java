package com.airline.airline_management.config;

import com.airline.airline_management.entity.Role;
import com.airline.airline_management.entity.User;
import com.airline.airline_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@airline.com";

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = User.builder()
                        .fullName("System Administrator")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("Admin@12345"))
                        .phone("9999999999")
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);

                System.out.println("======================================");
                System.out.println("ADMIN USER CREATED");
                System.out.println("Email: admin@airline.com");
                System.out.println("Password: Admin@12345");
                System.out.println("======================================");
            }
        };
    }
}