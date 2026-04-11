package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Repository for Formateur entity
 */
@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Long> {

    // Find by type
    List<Formateur> findByType(String type);

    // Find by employer
    List<Formateur> findByEmployeurId(Long employeurId);
    Optional<Formateur> findByEmployeurIdAndType(Long employeurId, String type);

    // Find external formateurs
    @Query("SELECT f FROM Formateur f WHERE f.type = 'externe'")
    List<Formateur> findExternalFormateurs(Long employeurId);

    @Query("SELECT f FROM Formateur f WHERE f.type = 'interne'")
    List<Formateur> findInternalFormateurs();

    // Find by name
    Optional<Formateur> findByNomAndPrenom(String nom, String prenom);

    @Query("SELECT f FROM Formateur f WHERE LOWER(f.nom) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(f.prenom) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Formateur> searchByName(String name);

    // Find by email
    Optional<Formateur> findByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Formateur f WHERE f.email = ?1")
    boolean existsByEmail(String email);

    // Find by speciality
    @Query("SELECT f FROM Formateur f WHERE LOWER(f.specialite) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Formateur> findBySpeciality(String speciality);

    // Count queries
    @Query("SELECT COUNT(f) FROM Formateur f WHERE f.type = 'interne'")
    Long countInternal();

    @Query("SELECT COUNT(f) FROM Formateur f WHERE f.type = 'externe'")
    Long countExternal();

    @Query("SELECT COUNT(f) FROM Formateur f WHERE f.employeur.id = ?1")
    Long countByEmployeur(Long employeurId);

//    // Find by trainings
//    @Query("SELECT f FROM Formateur f WHERE SIZE(f.formations) > 0")
//    List<Formateur> findFormateurWithTrainings();
//
//    @Query("SELECT f FROM Formateur f WHERE SIZE(f.formations) = 0")
//    List<Formateur> findFormateurWithoutTrainings();

    // Ordering
    @Query("SELECT f FROM Formateur f ORDER BY f.nom ASC, f.prenom ASC")
    List<Formateur> findAllOrderByName();

    @Query("SELECT f FROM Formateur f WHERE f.type = ?1 ORDER BY f.nom ASC")
    List<Formateur> findByTypeOrderByName(String type);

}
