package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Structure entity representing organizational structures
 * Examples: Central Direction, Regional Directions, etc.
 */
@Entity
@Table(name = "structure", uniqueConstraints = @UniqueConstraint(columnNames = "libelle"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Structure {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "libelle", unique = true, nullable = false, length = 100)
    private String libelle;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "lieu", length = 150)
    private String lieu;
}
