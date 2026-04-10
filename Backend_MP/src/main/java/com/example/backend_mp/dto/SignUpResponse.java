package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpResponse {
    
    private Long id;
    private String login;
    private String role;
    private boolean success;
    private String message;
    
    public SignUpResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public SignUpResponse(Long id, String login, String role, String message) {
        this.id = id;
        this.login = login;
        this.role = role;
        this.success = true;
        this.message = message;
    }
}
