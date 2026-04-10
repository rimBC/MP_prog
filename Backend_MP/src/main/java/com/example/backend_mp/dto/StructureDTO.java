package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Structure entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StructureDTO {
    
    private Long id;
    private String libelle;
    private String description;
    private String lieu;
    private Long nombreParticipants;
}
