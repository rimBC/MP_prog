package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * DTO for Participant entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantDTO {
    
    private Long id;
    private String nom;
    private String prenom;
    private Long structureId;
    private String structureLibelle;
    private Long profilId;
    private String profilLibelle;
    private String email;
    private String tel;
    private Date dateEmbauche;
    private Boolean actif;
}
