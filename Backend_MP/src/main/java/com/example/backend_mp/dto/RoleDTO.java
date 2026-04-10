package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Role entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDTO {
    
    private Long id;
    private String nom;
    private String description;
}
