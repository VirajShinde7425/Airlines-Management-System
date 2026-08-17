package com.airline.airline_management.dto;

import com.airline.airline_management.entity.Role;

public record LoginResponse(
        String token,
        Long id,
        String fullName,
        String email,
        Role role
) {
}