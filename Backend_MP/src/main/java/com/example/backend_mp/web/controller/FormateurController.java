package com.example.backend_mp.web.controller;

import com.example.backend_mp.dto.FormateurDTO;
import com.example.backend_mp.service.FormateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Formateur management
 */
@RestController
@RequestMapping("/api/formateurs")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Formateurs", description = "Trainer Management APIs")
public class FormateurController {
    
    private final FormateurService formateurService;
    
    /**
     * Create a new formateur
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Create trainer", description = "Create a new trainer (internal or external)")
    public ResponseEntity<FormateurDTO> createFormateur(@Valid @RequestBody FormateurDTO dto) {
        log.info("Creating new formateur: {} {}", dto.getPrenom(), dto.getNom());
        FormateurDTO created = formateurService.createFormateur(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * Get formateur by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get trainer by ID", description = "Retrieve trainer details by ID")
    public ResponseEntity<FormateurDTO> getFormateurById(@PathVariable Long id) {
        log.info("Fetching formateur with id: {}", id);
        FormateurDTO dto = formateurService.getFormateurById(id);
        return ResponseEntity.ok(dto);
    }
    
    /**
     * Get all formateurs
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get all trainers", description = "Retrieve all trainers")
    public ResponseEntity<List<FormateurDTO>> getAllFormateurs() {
        log.info("Fetching all formateurs");
        List<FormateurDTO> formateurs = formateurService.getAllFormateurs();
        return ResponseEntity.ok(formateurs);
    }
    
    /**
     * Update formateur
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Update trainer", description = "Update trainer information")
    public ResponseEntity<FormateurDTO> updateFormateur(
            @PathVariable Long id,
            @Valid @RequestBody FormateurDTO dto) {
        log.info("Updating formateur with id: {}", id);
        FormateurDTO updated = formateurService.updateFormateur(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Delete formateur
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete trainer", description = "Delete a trainer")
    public ResponseEntity<Void> deleteFormateur(@PathVariable Long id) {
        log.info("Deleting formateur with id: {}", id);
        formateurService.deleteFormateur(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get formateurs by type
     */
    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get trainers by type", description = "Get trainers filtered by type (interne/externe)")
    public ResponseEntity<List<FormateurDTO>> getFormateursByType(@PathVariable String type) {
        log.info("Fetching formateurs by type: {}", type);
        List<FormateurDTO> formateurs = formateurService.getFormateursByType(type);
        return ResponseEntity.ok(formateurs);
    }
}
