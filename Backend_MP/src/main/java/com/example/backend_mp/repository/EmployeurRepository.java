package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Employeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Employeur entity
 */
@Repository
public interface EmployeurRepository extends JpaRepository<Employeur, Long> {
    Optional<Employeur> findByNomEmployeur(String nomEmployeur);
}
