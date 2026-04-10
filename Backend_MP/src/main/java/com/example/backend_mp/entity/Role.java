package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Role entity representing user roles in the system
 * Roles: SIMPLE_UTILISATEUR, RESPONSABLE, ADMINISTRATEUR
 */
@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom", unique = true, nullable = false, length = 50)
    private String nom;
    
    @Column(name = "description", length = 255)
    private String description;
}
