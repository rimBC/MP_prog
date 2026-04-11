package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;
/**
 * Repository for Utilisateur entity
 *
 *
 * rq
 * Interfaces are used in Spring Boot repositories primarily
 * because Spring Data JPA automatically generates the implementation
 * at runtime, significantly reducing boilerplate code.
 */
@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    // Find by login
    Optional<Utilisateur> findByLogin(String login);

    // Check existence
    boolean existsByLogin(String login);

    // Find by role
    @Query("SELECT u FROM Utilisateur u WHERE u.role.nom = ?1")
    List<Utilisateur> findByRoleName(String roleName);

    @Query("SELECT u FROM Utilisateur u WHERE u.role.id = ?1")
    List<Utilisateur> findByRoleId(Long roleId);

    // Find by status
    List<Utilisateur> findByActifTrue();
    List<Utilisateur> findByActifFalse();

    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.actif = true")
    Long countActive();

    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.actif = false")
    Long countInactive();

    // Find by role and status
    @Query("SELECT u FROM Utilisateur u WHERE u.role.nom = ?1 AND u.actif = true")
    List<Utilisateur> findByRoleNameAndActive(String roleName);

    @Query("SELECT u FROM Utilisateur u WHERE u.role.nom = ?1 AND u.actif = false")
    List<Utilisateur> findByRoleNameAndInactive(String roleName);

    // Find by date range
    @Query("SELECT u FROM Utilisateur u WHERE u.dateCreation >= ?1 AND u.dateCreation <= ?2")
    List<Utilisateur> findByDateCreationRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT u FROM Utilisateur u WHERE u.dateCreation >= ?1")
    List<Utilisateur> findByDateCreationAfter(LocalDateTime date);

    // Search by login
    @Query("SELECT u FROM Utilisateur u WHERE LOWER(u.login) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Utilisateur> searchByLogin(String login);

    // Count by role
    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.role.nom = ?1")
    Long countByRoleName(String roleName);

    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.role.id = ?1")
    Long countByRoleId(Long roleId);

    // Find by role and status with count
    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.role.nom = ?1 AND u.actif = true")
    Long countByRoleNameAndActive(String roleName);

    // Ordering
    @Query("SELECT u FROM Utilisateur u ORDER BY u.login ASC")
    List<Utilisateur> findAllOrderByLogin();

    @Query("SELECT u FROM Utilisateur u WHERE u.role.nom = ?1 ORDER BY u.login ASC")
    List<Utilisateur> findByRoleNameOrderByLogin(String roleName);

    @Query("SELECT u FROM Utilisateur u ORDER BY u.dateCreation DESC")
    List<Utilisateur> findAllOrderByDateDesc();
}
