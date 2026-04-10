package com.example.backend_mp.repository;

import com.example.backend_mp.entity.ParticipantFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ParticipantFormation junction entity
 */
@Repository
public interface ParticipantFormationRepository extends JpaRepository<ParticipantFormation, ParticipantFormation.ParticipantFormationId> {

    List<ParticipantFormation> findByFormationId(Long formationId);

    List<ParticipantFormation> findByParticipantId(Long participantId);

    @Query("SELECT pf FROM ParticipantFormation pf WHERE pf.participant.id = ?1 AND pf.formation.id = ?2")
    Optional<ParticipantFormation> findByParticipantAndFormation(Long participantId, Long formationId);
}
