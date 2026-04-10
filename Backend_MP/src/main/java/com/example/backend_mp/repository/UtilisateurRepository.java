package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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
    //find user by username
    Optional<Utilisateur> findByLogin(String login);
    //check if user exists
    boolean existsByLogin(String login);
}
