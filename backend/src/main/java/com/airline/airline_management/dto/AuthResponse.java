package com.airline.airline_management.dto;

import com.airline.airline_management.entity.Role;

import java.time.LocalDateTime;

public record AuthResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        Role role,
        LocalDateTime createdAt
) {
}