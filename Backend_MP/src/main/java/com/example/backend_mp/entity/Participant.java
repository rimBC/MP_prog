package com.example.backend_mp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Participant entity representing training participants
 */
@Entity
@Table(name = "participant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom", nullable = false, length = 100)
    private String nom;
    
    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_structure", nullable = false)
    private Structure structure;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_profil", nullable = false)
    private Profil profil;
    
    @Column(name = "email", nullable = false, length = 150)
    @Email
    private String email;
    
    @Column(name = "tel")
    private String tel;
    
    @Column(name = "date_embauche")
    private Date dateEmbauche;
    
    @Column(name = "actif", nullable = false)
    private Boolean actif = true;
}
