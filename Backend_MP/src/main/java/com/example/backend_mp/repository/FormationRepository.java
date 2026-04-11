package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


/**
 * Repository for Formation entity
 */
@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    // Find by single criteria
    List<Formation> findByAnnee(Integer annee);
    List<Formation> findByDomaineId(Long domaineId);
    List<Formation> findByFormateurId(Long formateurId);
    List<Formation> findByStatut(String statut);
    Optional<Formation> findByTitre(String titre);

    // Date range queries
    @Query("SELECT f FROM Formation f WHERE f.dateDebut >= ?1 AND f.dateFin <= ?2")
    List<Formation> findByDateRange(LocalDate startDate, LocalDate endDate);

    @Query("SELECT f FROM Formation f WHERE f.dateDebut >= ?1")
    List<Formation> findByDateDebutAfter(LocalDate date);

    @Query("SELECT f FROM Formation f WHERE f.dateFin <= ?1")
    List<Formation> findByDateFinBefore(LocalDate date);

    // Combined queries
    @Query("SELECT f FROM Formation f WHERE f.domaine.id = ?1 AND f.statut = ?2")
    List<Formation> findByDomaineAndStatut(Long domaineId, String statut);

    @Query("SELECT f FROM Formation f WHERE f.formateur.id = ?1 AND f.annee = ?2")
    List<Formation> findByFormateurAndYear(Long formateurId, Integer year);

    @Query("SELECT f FROM Formation f WHERE f.domaine.id = ?1 AND f.annee = ?2")
    List<Formation> findByDomaineAndYear(Long domaineId, Integer year);

    // Count queries
    @Query("SELECT COUNT(f) FROM Formation f WHERE f.domaine.id = ?1")
    Long countByDomaineId(Long domaineId);

    @Query("SELECT COUNT(f) FROM Formation f WHERE f.formateur.id = ?1")
    Long countByFormateurId(Long formateurId);

    @Query("SELECT COUNT(f) FROM Formation f WHERE f.statut = ?1")
    Long countByStatut(String statut);

    @Query("SELECT COUNT(f) FROM Formation f WHERE f.annee = ?1")
    Long countByAnnee(Integer annee);

    // Existence checks
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Formation f WHERE f.titre = ?1")
    boolean existsByTitre(String titre);

    // Advanced aggregations
    @Query("SELECT f FROM Formation f WHERE SIZE(f.participantFormations) = 0")
    List<Formation> findFormationsWithoutParticipants();

    @Query("SELECT f FROM Formation f WHERE SIZE(f.participantFormations) > 0")
    List<Formation> findFormationsWithParticipants();

    @Query("SELECT f FROM Formation f ORDER BY f.dateDebut DESC")
    List<Formation> findAllOrderByDateDesc();

    @Query("SELECT f FROM Formation f ORDER BY f.budget DESC")
    List<Formation> findAllOrderByBudgetDesc();

}
