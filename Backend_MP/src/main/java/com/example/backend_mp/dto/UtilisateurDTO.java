package com.example.backend_mp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * DTO for Utilisateur entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurDTO {
    
    private Long id;
    private String login;
    private Long roleId;
    private String roleName;
    private Boolean actif;
    private Date dateCreation;
    private Date dateModification;
}
