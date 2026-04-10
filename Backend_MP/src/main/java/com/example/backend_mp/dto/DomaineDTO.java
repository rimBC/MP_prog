package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Domaine entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DomaineDTO {
    
    private Long id;
    private String libelle;
    private String description;
    private Long nombreFormations;
}
