package com.example.backend_mp.web.controller;

import com.example.backend_mp.dto.FormationDTO;
import com.example.backend_mp.service.FormationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for managing formations (training sessions)
 */
@RestController
@RequestMapping("/api/formations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Formations", description = "Training Session Management APIs")
public class FormationController {
    
    private final FormationService formationService;
    
    /**
     * Get all formations
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get all formations", description = "Retrieve all training sessions")
    public ResponseEntity<List<FormationDTO>> getAllFormations() {
        log.info("Fetching all formations");
        log.info("Fetching all formations");
        log.info("Fetching all formations");
        log.info("Fetching all formations");
        log.info("Fetching all formations");
        return ResponseEntity.ok(formationService.getAllFormations());
    }
    
    /**
     * Get formation by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get formation by ID", description = "Retrieve specific training session")
    public ResponseEntity<FormationDTO> getFormationById(@PathVariable Long id) {
        log.info("Fetching formation with ID: {}", id);
        return ResponseEntity.ok(formationService.getFormationById(id));
    }
    
    /**
     * Create formation
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Create formation", description = "Create a new training session")
    public ResponseEntity<FormationDTO> createFormation(@Valid @RequestBody FormationDTO formationDTO) {
        log.info("Creating formation: {}", formationDTO.getTitre());
        return ResponseEntity.status(HttpStatus.CREATED).body(formationService.createFormation(formationDTO));
    }
    
    /**
     * Update formation
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Update formation", description = "Update training session details")
    public ResponseEntity<FormationDTO> updateFormation(
            @PathVariable Long id,
            @Valid @RequestBody FormationDTO formationDTO) {
        log.info("Updating formation with ID: {}", id);
        return ResponseEntity.ok(formationService.updateFormation(id, formationDTO));
    }
    
    /**
     * Delete formation
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete formation", description = "Delete a training session")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        log.info("Deleting formation with ID: {}", id);
        formationService.deleteFormation(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get formations by year
     */
    @GetMapping("/year/{year}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get formations by year", description = "Retrieve training sessions for specific year")
    public ResponseEntity<List<FormationDTO>> getFormationsByYear(@PathVariable Integer year) {
        log.info("Fetching formations for year: {}", year);
        return ResponseEntity.ok(formationService.getFormationsByYear(year));
    }
    
    /**
     * Get formations by domain
     */
    @GetMapping("/domain/{domaineId}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get formations by domain", description = "Retrieve training sessions by domain")
    public ResponseEntity<List<FormationDTO>> getFormationsByDomain(@PathVariable Long domaineId) {
        log.info("Fetching formations by domain: {}", domaineId);
        return ResponseEntity.ok(formationService.getFormationsByDomain(domaineId));
    }
    
    /**
     * Get formations by formateur
     */
    @GetMapping("/formateur/{formateurId}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get formations by formateur", description = "Retrieve training sessions by trainer")
    public ResponseEntity<List<FormationDTO>> getFormationsByFormateur(@PathVariable Long formateurId) {
        log.info("Fetching formations by formateur: {}", formateurId);
        return ResponseEntity.ok(formationService.getFormationsByFormateur(formateurId));
    }
    
    /**
     * Get formations by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get formations by status", description = "Retrieve training sessions by status")
    public ResponseEntity<List<FormationDTO>> getFormationsByStatus(@PathVariable String status) {
        log.info("Fetching formations by status: {}", status);
        return ResponseEntity.ok(formationService.getFormationsByStatus(status));
    }
    
    /**
     * Get formations by date range
     */
    @GetMapping("/daterange")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get formations by date range", description = "Retrieve training sessions within date range")
    public ResponseEntity<List<FormationDTO>> getFormationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching formations between {} and {}", startDate, endDate);
        return ResponseEntity.ok(formationService.getFormationsByDateRange(startDate, endDate));
    }
    
    /**
     * Get formation count by domain
     */
    @GetMapping("/count/domain/{domaineId}")
    @PreAuthorize("hasAnyRole('RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Count formations by domain", description = "Get number of training sessions in a domain")
    public ResponseEntity<Long> getFormationCountByDomain(@PathVariable Long domaineId) {
        log.info("Counting formations for domain: {}", domaineId);
        return ResponseEntity.ok(formationService.getFormationsCountByDomain(domaineId));
    }
}
