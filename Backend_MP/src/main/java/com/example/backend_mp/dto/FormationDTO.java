package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

/**
 * DTO for Formation entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationDTO {
    
    private Long id;
    private String titre;
    private Integer annee;
    private Integer duree;
    private Long domaineId;
    private String domaineLibelle;
    private Double budget;
    private Long formateurId;
    private String formateurNom;
    private String lieu;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Date dateCreation;
    private String statut;
    private String description;
    private Set<Long> participantIds;
    private Integer nombreParticipants;
}
