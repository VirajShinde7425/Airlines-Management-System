package com.airline.airline_management.controller;

import com.airline.airline_management.dto.AuthResponse;
import com.airline.airline_management.dto.RegisterRequest;
import com.airline.airline_management.entity.User;
import com.airline.airline_management.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.airline.airline_management.dto.LoginRequest;
import com.airline.airline_management.dto.LoginResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.register(
                request.fullName(),
                request.email(),
                request.password(),
                request.phone()
        );

        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(
                request.email(),
                request.password()
        );

        return ResponseEntity.ok(response);
    }
}