package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Profil entity
 */
@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
    // Find by name
    Optional<Profil> findByLibelle(String libelle);

    // Check existence
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Profil p WHERE p.libelle = ?1")
    boolean existsByLibelle(String libelle);

    // Find by partial name (search)
    @Query("SELECT p FROM Profil p WHERE LOWER(p.libelle) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Profil> searchByLibelle(String libelle);

//    // Find profiles with participants
//    @Query("SELECT p FROM Profil p WHERE SIZE(p.participants) > 0")
//    List<Profil> findProfilsWithParticipants();
//
//    @Query("SELECT p FROM Profil p WHERE SIZE(p.participants) = 0")
//    List<Profil> findProfilsWithoutParticipants();
//
//    // Count participants by profile
//    @Query("SELECT COUNT(pa) FROM Profil p JOIN p.participants pa WHERE p.id = ?1")
//    Long countParticipantsByProfil(Long profilId);

    // Get profiles ordered
    @Query("SELECT p FROM Profil p ORDER BY p.libelle ASC")
    List<Profil> findAllOrderByLibelle();

    // Count total profiles
    @Query("SELECT COUNT(p) FROM Profil p")
    Long countAllProfils();}
