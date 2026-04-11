package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Formation entity representing training sessions
 */
@Entity
@Table(name = "formation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "titre", nullable = false, length = 200)
    private String titre;
    
    @Column(name = "annee", nullable = false)
    private Integer annee;
    
    @Column(name = "duree", nullable = false)
    private Integer duree; // in days
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_domaine", nullable = false)
    private Domaine domaine;
    
    @Column(name = "budget", nullable = false)
    private Double budget;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_formateur", nullable = false)
    private Formateur formateur;
    
    @Column(name = "lieu", length = 150)
    private String lieu;
    
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;
    
    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;
    
    @Column(name = "date_creation")
    private Date dateCreation;
    
    @Column(name = "statut", nullable = false, length = 20)
    private String statut = "PLANIFIEE"; // PLANIFIEE, EN_COURS, COMPLETEE, ANNULEE
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
//    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
//    @JoinTable(
//        name = "participant_formation",
//        joinColumns = @JoinColumn(name = "id_formation"),
//        inverseJoinColumns = @JoinColumn(name = "id_participant")
//    )
//    @Builder.Default
//    private Set<Participant> participants = new HashSet<>();

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<ParticipantFormation> participantFormations = new HashSet<>();

    public Set<Participant> getParticipants() {
        return participantFormations.stream()
                .map(ParticipantFormation::getParticipant)
                .collect(Collectors.toSet());
    }

    @PrePersist
    protected void onCreate() {
        dateCreation = new Date();
        if (statut == null) {
            statut = "PLANIFIEE";
        }
    }
}
