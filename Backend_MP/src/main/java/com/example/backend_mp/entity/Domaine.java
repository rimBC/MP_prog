package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "domaine", uniqueConstraints = @UniqueConstraint(columnNames = "libelle"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Domaine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "libelle", unique = true, nullable = false, length = 100)
    private String libelle;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
