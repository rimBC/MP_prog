package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

/**
 * Repository for Participant entity
 */
@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    // Find by structure
    List<Participant> findByStructureId(Long structureId);

    // Find by profil
    List<Participant> findByProfilId(Long profilId);

    // Find by status
    List<Participant> findByActifTrue();
    List<Participant> findByActifFalse();

    // Find by email
    Optional<Participant> findByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Participant p WHERE p.email = ?1")
    boolean existsByEmail(String email);

    // Find by name
    Optional<Participant> findByNomAndPrenom(String nom, String prenom);

    @Query("SELECT p FROM Participant p WHERE LOWER(p.nom) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(p.prenom) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Participant> searchByName(String name);

    // Find by formation
    @Query("SELECT p FROM Participant p WHERE p IN " +
            "(SELECT pf.participant FROM ParticipantFormation pf WHERE pf.formation.id = ?1)")
    List<Participant> findParticipantsByFormationId(Long formationId);

    @Query("SELECT p FROM Participant p WHERE p IN " +
            "(SELECT pf.participant FROM ParticipantFormation pf WHERE pf.formation.id = ?1) AND p.actif = true")
    List<Participant> findActiveParticipantsByFormationId(Long formationId);

    // Find by date range
    @Query("SELECT p FROM Participant p WHERE p.dateEmbauche >= ?1 AND p.dateEmbauche <= ?2")
    List<Participant> findByDateEmbaucheRange(LocalDate startDate, LocalDate endDate);

    @Query("SELECT p FROM Participant p WHERE p.dateEmbauche >= ?1")
    List<Participant> findByDateEmbaucheAfter(LocalDate date);

    // Count queries
    @Query("SELECT COUNT(p) FROM Participant p WHERE p.structure.id = ?1")
    Long countByStructureId(Long structureId);

    @Query("SELECT COUNT(p) FROM Participant p WHERE p.profil.id = ?1")
    Long countByProfilId(Long profilId);

    @Query("SELECT COUNT(p) FROM Participant p WHERE p.actif = true")
    Long countActive();

    @Query("SELECT COUNT(p) FROM Participant p WHERE p.actif = false")
    Long countInactive();

    @Query("SELECT COUNT(p) FROM Participant p WHERE p.structure.id = ?1 AND p.actif = true")
    Long countActiveByStructure(Long structureId);

    // Find by structure and profil
    @Query("SELECT p FROM Participant p WHERE p.structure.id = ?1 AND p.profil.id = ?2")
    List<Participant> findByStructureAndProfil(Long structureId, Long profilId);



//    lezim titsala7 later with table many to many

//    // Find with formations
//    @Query("SELECT p FROM Participant p WHERE SIZE(p.formations) > 0")
//    List<Participant> findParticipantWithFormations();
//
//    @Query("SELECT p FROM Participant p WHERE SIZE(p.formations) = 0")
//    List<Participant> findParticipantWithoutFormations();

    // Ordering
    @Query("SELECT p FROM Participant p ORDER BY p.nom ASC, p.prenom ASC")
    List<Participant> findAllOrderByName();

    @Query("SELECT p FROM Participant p WHERE p.structure.id = ?1 ORDER BY p.nom ASC")
    List<Participant> findByStructureOrderByName(Long structureId);

    @Query("SELECT p FROM Participant p WHERE p.actif = true ORDER BY p.dateEmbauche DESC")
    List<Participant> findActiveOrderByDateDesc();
}
