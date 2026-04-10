package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Formateur entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormateurDTO {
    
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String tel;
    private String type; // "interne" ou "externe"
    private Long employeurId;
    private String employeurNom;
    private String specialite;
    private String bio;
}
