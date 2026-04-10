package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Profil entity representing professional profiles
 * Examples: IT Engineer (Bac+5), IT Engineer (Bac+3), Manager, Lawyer, etc.
 */
@Entity
@Table(name = "profil", uniqueConstraints = @UniqueConstraint(columnNames = "libelle"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profil {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "libelle", unique = true, nullable = false, length = 150)
    private String libelle;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
