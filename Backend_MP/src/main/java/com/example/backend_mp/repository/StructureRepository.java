package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Structure entity
 */
@Repository
public interface StructureRepository extends JpaRepository<Structure, Long> {
    Optional<Structure> findByLibelle(String libelle);
}
