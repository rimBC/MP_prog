package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Formation entity
 */
@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    
    List<Formation> findByAnnee(Integer annee);
    
    List<Formation> findByDomaineId(Long domaineId);
    
    List<Formation> findByFormateurId(Long formateurId);
    
    List<Formation> findByStatut(String statut);
    
    @Query("SELECT f FROM Formation f WHERE f.dateDebut >= ?1 AND f.dateFin <= ?2")
    List<Formation> findByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(f) FROM Formation f WHERE f.domaine.id = ?1")
    Long countByDomaineId(Long domaineId);
}
