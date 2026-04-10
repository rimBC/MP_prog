package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Profil entity
 */
@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
    Optional<Profil> findByLibelle(String libelle);
}
