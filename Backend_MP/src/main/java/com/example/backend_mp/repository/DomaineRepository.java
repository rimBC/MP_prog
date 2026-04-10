package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Domaine entity
 */
@Repository
public interface DomaineRepository extends JpaRepository<Domaine, Long> {
    Optional<Domaine> findByLibelle(String libelle);
}
