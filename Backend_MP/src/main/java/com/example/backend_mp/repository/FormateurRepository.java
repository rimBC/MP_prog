package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Formateur entity
 */
@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Long> {
    
    List<Formateur> findByType(String type);
    
    List<Formateur> findByEmployeurId(Long employeurId);
    
    @Query("SELECT f FROM Formateur f WHERE f.type = 'externe' AND f.employeur.id = ?1")
    List<Formateur> findExternalFormateurs(Long employeurId);
}
