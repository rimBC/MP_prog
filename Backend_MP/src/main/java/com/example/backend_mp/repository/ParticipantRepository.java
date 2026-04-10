package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Participant entity
 */
@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    
    List<Participant> findByStructureId(Long structureId);
    
    List<Participant> findByProfilId(Long profilId);
    
    List<Participant> findByActifTrue();
    
    @Query("SELECT COUNT(p) FROM Participant p WHERE p.structure.id = ?1")
    Long countByStructureId(Long structureId);
    
    @Query("SELECT p FROM Participant p WHERE p IN " +
           "(SELECT pf.participant FROM ParticipantFormation pf WHERE pf.formation.id = ?1)")
    List<Participant> findParticipantsByFormationId(Long formationId);
}
