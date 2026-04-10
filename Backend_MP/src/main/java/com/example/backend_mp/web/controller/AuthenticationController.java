package com.example.backend_mp.web.controller;

import com.example.backend_mp.dto.*;
import com.example.backend_mp.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static java.rmi.server.LogStream.log;

/**
 * REST Controller for authentication operations
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j //logging
@Tag(name = "Authentication", description = "Authentication and Authorization APIs")
public class AuthenticationController {
    
    private final AuthenticationService authenticationService;
    
    /**
     * Authenticate user with login and password
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and generate JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        AuthenticationController.log.info("Login request for user: {}", authRequest.getLogin());
        AuthResponse response = authenticationService.authenticate(authRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Register a new user (sign-up)
     */
    @PostMapping("/signup")
    @Operation(summary = "User registration", description = "Register a new user account")
    public ResponseEntity<SignUpResponse> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        AuthenticationController.log.info("Sign-up request for user: {}", signUpRequest.getLogin());
        System.out.print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        SignUpResponse response = authenticationService.signUp(signUpRequest);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Check if login is available
     */
    @GetMapping("/check-availability/{login}")
    @Operation(summary = "Check login availability", description = "Check if a login is available for registration")
    public ResponseEntity<AvailabilityResponse> checkLoginAvailability(@PathVariable String login) {
        AuthenticationController.log.info("Checking availability for login: {}", login);
        AvailabilityResponse response = authenticationService.checkLoginAvailability(login);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh JWT token
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Refresh JWT token using refresh token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        AuthenticationController.log.info("Token refresh request");
        AuthResponse response = authenticationService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    /**
     * Create admin user (no authentication required)
     */
//

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if authentication service is running")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Authentication service is running");
    }
}
