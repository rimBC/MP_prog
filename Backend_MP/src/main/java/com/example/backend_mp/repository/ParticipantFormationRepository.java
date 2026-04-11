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

    // Find by formation
    List<ParticipantFormation> findByFormationId(Long formationId);

    // Find by participant
    List<ParticipantFormation> findByParticipantId(Long participantId);

    // Find specific enrollment
    @Query("SELECT pf FROM ParticipantFormation pf WHERE pf.participant.id = ?1 AND pf.formation.id = ?2")
    Optional<ParticipantFormation> findByParticipantAndFormation(Long participantId, Long formationId);

    // Find by status
    @Query("SELECT pf FROM ParticipantFormation pf WHERE pf.statutParticipation = ?1")
    List<ParticipantFormation> findByStatus(String status);

    // Find by status and formation
    @Query("SELECT pf FROM ParticipantFormation pf WHERE pf.formation.id = ?1 AND pf.statutParticipation = ?2")
    List<ParticipantFormation> findByFormationAndStatus(Long formationId, String status);

    // Count enrollments by formation
    @Query("SELECT COUNT(pf) FROM ParticipantFormation pf WHERE pf.formation.id = ?1")
    Long countByFormation(Long formationId);

    // Count enrollments by participant
    @Query("SELECT COUNT(pf) FROM ParticipantFormation pf WHERE pf.participant.id = ?1")
    Long countByParticipant(Long participantId);

    // Count by status
    @Query("SELECT COUNT(pf) FROM ParticipantFormation pf WHERE pf.statutParticipation = ?1")
    Long countByStatus(String status);

    // Count by status and formation
    @Query("SELECT COUNT(pf) FROM ParticipantFormation pf WHERE pf.formation.id = ?1 AND pf.statutParticipation = ?2")
    Long countByFormationAndStatus(Long formationId, String status);

    // Check if participant enrolled in formation
    @Query("SELECT CASE WHEN COUNT(pf) > 0 THEN true ELSE false END FROM ParticipantFormation pf WHERE pf.participant.id = ?1 AND pf.formation.id = ?2")
    boolean isEnrolled(Long participantId, Long formationId);

    // Get enrollments by date
    @Query("SELECT pf FROM ParticipantFormation pf WHERE pf.formation.id = ?1 ORDER BY pf.dateInscription DESC")
    List<ParticipantFormation> findByFormationOrderByDateDesc(Long formationId);

    // Get participants present in formation
    @Query("SELECT pf FROM ParticipantFormation pf WHERE pf.formation.id = ?1 AND pf.statutParticipation = 'PRESENT'")
    List<ParticipantFormation> findPresentParticipants(Long formationId);

    // Get participants absent in formation
    @Query("SELECT pf FROM ParticipantFormation pf WHERE pf.formation.id = ?1 AND pf.statutParticipation = 'ABSENT'")
    List<ParticipantFormation> findAbsentParticipants(Long formationId);

    // Delete all enrollments for a formation
    @Query("DELETE FROM ParticipantFormation pf WHERE pf.formation.id = ?1")
    void deleteByFormationId(Long formationId);

    // Delete all enrollments for a participant
    @Query("DELETE FROM ParticipantFormation pf WHERE pf.participant.id = ?1")
    void deleteByParticipantId(Long participantId);

}
