package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login availability check response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityResponse {
    
    private String login;
    private boolean available;
    private String message;
}
