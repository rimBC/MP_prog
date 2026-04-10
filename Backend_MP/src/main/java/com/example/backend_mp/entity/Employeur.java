package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Employeur entity for external trainers
 */
@Entity
@Table(name = "employeur", uniqueConstraints = @UniqueConstraint(columnNames = "nomemployeur"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employeur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nomemployeur", unique = true, nullable = false, length = 150)
    private String nomEmployeur;
}
