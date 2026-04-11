package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Employeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Employeur entity
 */
@Repository
public interface EmployeurRepository extends JpaRepository<Employeur, Long> {
    // Find by name
    Optional<Employeur> findByNomEmployeur(String nomEmployeur);

    // Count total employers
    @Query("SELECT COUNT(e) FROM Employeur e")
    Long countAllEmployeurs();

    // Check existence
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Employeur e WHERE e.nomEmployeur = ?1")
    boolean existsByNomEmployeur(String nomEmployeur);

    // Find by partial name (search)
    @Query("SELECT e FROM Employeur e WHERE LOWER(e.nomEmployeur) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Employeur> searchByNomEmployeur(String nomEmployeur);

    // Get employers ordered
    @Query("SELECT e FROM Employeur e ORDER BY e.nomEmployeur ASC")
    List<Employeur> findAllOrderByName();



//    // Find employers with trainers
//    @Query("SELECT e FROM Employeur e WHERE SIZE(e.formateurs) > 0")
//    List<Employeur> findEmployeursWithFormateurs();
//
//    @Query("SELECT e FROM Employeur e WHERE SIZE(e.formateurs) = 0")
//    List<Employeur> findEmployeursWithoutFormateurs();
//
//    // Count trainers by employer
//    @Query("SELECT COUNT(f) FROM Employeur e JOIN e.formateurs f WHERE e.id = ?1")
//    Long countFormateurs(Long employeurId);
//
//    // Count external trainers by employer
//    @Query("SELECT COUNT(f) FROM Employeur e JOIN e.formateurs f WHERE e.id = ?1 AND f.type = 'externe'")
//    Long countExternalFormateurs(Long employeurId);


}
