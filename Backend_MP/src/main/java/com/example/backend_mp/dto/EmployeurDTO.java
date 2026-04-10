package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Employeur entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeurDTO {
    
    private Long id;
    private String nomEmployeur;
    private Long nombreFormateurs;
}
