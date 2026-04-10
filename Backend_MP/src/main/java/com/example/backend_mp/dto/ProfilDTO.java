package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Profil entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilDTO {
    
    private Long id;
    private String libelle;
    private String description;
    private Long nombreParticipants;
}
