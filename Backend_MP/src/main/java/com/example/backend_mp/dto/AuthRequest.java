package com.example.backend_mp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user login request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {
    
    @NotBlank(message = "Login is required")
    private String login;
    
    @NotBlank(message = "Password is required")
    private String password;
}
