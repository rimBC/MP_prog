package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

/**
 * ParticipantFormation junction entity for many-to-many relationship with additional attributes
 */
@Entity
@Table(name = "participant_formation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantFormation {
    
    @EmbeddedId
    private ParticipantFormationId id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idParticipant")
    @JoinColumn(name = "id_participant")
    private Participant participant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idFormation")
    @JoinColumn(name = "id_formation")
    private Formation formation;
    
    @Column(name = "date_inscription")
    private Date dateInscription;
    
    @Column(name = "statut_participation", length = 20)
    private String statutParticipation = "INSCRIT"; // INSCRIT, PRESENT, ABSENT, JUSTIFIE
    
    @PrePersist
    protected void onCreate() {
        if (dateInscription == null) {
            dateInscription = new Date();
        }
        if (statutParticipation == null) {
            statutParticipation = "INSCRIT";
        }
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantFormationId implements Serializable {
        private Long idParticipant;
        private Long idFormation;
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ParticipantFormationId that = (ParticipantFormationId) o;
            return Objects.equals(idParticipant, that.idParticipant) &&
                   Objects.equals(idFormation, that.idFormation);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(idParticipant, idFormation);
        }
    }
}
