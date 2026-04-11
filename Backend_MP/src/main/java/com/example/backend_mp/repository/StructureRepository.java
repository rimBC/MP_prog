package com.example.backend_mp.repository;

import com.example.backend_mp.entity.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Structure entity
 */
@Repository
public interface StructureRepository extends JpaRepository<Structure, Long> {
    // Find by name
    Optional<Structure> findByLibelle(String libelle);

    // Check existence
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Structure s WHERE s.libelle = ?1")
    boolean existsByLibelle(String libelle);

    // Find by partial name (search)
    @Query("SELECT s FROM Structure s WHERE LOWER(s.libelle) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Structure> searchByLibelle(String libelle);

    // Find by location
    @Query("SELECT s FROM Structure s WHERE LOWER(s.lieu) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Structure> findByLocation(String location);

//    // Find structures with participants
//    @Query("SELECT s FROM Structure s WHERE SIZE(s.participants) > 0")
//    List<Structure> findStructuresWithParticipants();
//
//    @Query("SELECT s FROM Structure s WHERE SIZE(s.participants) = 0")
//    List<Structure> findStructuresWithoutParticipants();
//
//    // Count participants by structure
//    @Query("SELECT COUNT(p) FROM Structure s JOIN s.participants p WHERE s.id = ?1")
//    Long countParticipantsByStructure(Long structureId);

    // Get structures ordered
    @Query("SELECT s FROM Structure s ORDER BY s.libelle ASC")
    List<Structure> findAllOrderByLibelle();

    // Count total structures
    @Query("SELECT COUNT(s) FROM Structure s")
    Long countAllStructures();}
