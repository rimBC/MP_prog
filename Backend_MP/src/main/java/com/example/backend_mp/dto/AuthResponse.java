package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication response with JWT token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String login;
    private String role;
    private boolean actif;
    
    public AuthResponse(String token, String refreshToken, Long id, String login, String role, boolean actif) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.id = id;
        this.login = login;
        this.role = role;
        this.actif = actif;
        this.type = "Bearer";
    }
}
