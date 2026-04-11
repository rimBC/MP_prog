package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Domaine entity
 */
@Repository
public interface DomaineRepository extends JpaRepository<Domaine, Long> {
    // Find by id
    Optional<Domaine> findById(Long id);

    // Find by name
    Optional<Domaine> findByLibelle(String libelle);

    // Check existence
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Domaine d WHERE d.libelle = ?1")
    boolean existsByLibelle(String libelle);

    // Find by partial name (search)
    @Query("SELECT d FROM Domaine d WHERE LOWER(d.libelle) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Domaine> searchByLibelle(String libelle);


    // Get domains ordered
    @Query("SELECT d FROM Domaine d ORDER BY d.libelle ASC")
    List<Domaine> findAllOrderByLibelle();

    // Count total domains
    @Query("SELECT COUNT(d) FROM Domaine d")
    Long countAllDomaines();
}
