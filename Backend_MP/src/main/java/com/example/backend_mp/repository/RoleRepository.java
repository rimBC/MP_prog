package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Role entity
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Find by name
    Optional<Role> findByNom(String nom);

    // Check existence
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Role r WHERE r.nom = ?1")
    boolean existsByNom(String nom);

    // Ordering
    @Query("SELECT r FROM Role r ORDER BY r.nom ASC")
    List<Role> findAllOrderByName();}
