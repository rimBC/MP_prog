package com.example.backend_mp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Formateur entity representing trainers (internal or external)
 */
@Entity
@Table(name = "formateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formateur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom", nullable = false, length = 100)
    private String nom;
    
    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;
    
    @Column(name = "email", nullable = false, length = 150)
    @Email
    private String email;
    
    @Column(name = "tel")
    private String tel;
    
    @Column(name = "type", nullable = false, length = 20)
    private String type; // "interne" ou "externe"
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_employeur")
    private Employeur employeur; // Nullable for internal trainers
    
    @Column(name = "specialite", length = 255)
    private String specialite;
    
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
}
