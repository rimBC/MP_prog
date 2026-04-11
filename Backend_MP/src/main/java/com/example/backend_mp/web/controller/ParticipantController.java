package com.example.backend_mp.web.controller;

import com.example.backend_mp.dto.ParticipantDTO;
import com.example.backend_mp.service.ParticipantService;
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
 * REST Controller for managing participants (trainees)
 */
@RestController
@RequestMapping("/api/participants")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Participants", description = "Participant Management APIs")
public class ParticipantController {
    
    private final ParticipantService participantService;
    
    /**
     * Get all participants
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get all participants", description = "Retrieve all trainees")
    public ResponseEntity<List<ParticipantDTO>> getAllParticipants() {
        log.info("Fetching all participants");
        return ResponseEntity.ok(participantService.getAllParticipants());
    }
    
    /**
     * Get participant by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get participant by ID", description = "Retrieve specific trainee")
    public ResponseEntity<ParticipantDTO> getParticipantById(@PathVariable Long id) {
        log.info("Fetching participant with ID: {}", id);
        return ResponseEntity.ok(participantService.getParticipantById(id));
    }
    
    /**
     * Create participant
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Create participant", description = "Create a new trainee")
    public ResponseEntity<ParticipantDTO> createParticipant(@Valid @RequestBody ParticipantDTO participantDTO) {
        log.info("Creating participant: {} {}", participantDTO.getNom(), participantDTO.getPrenom());
        return ResponseEntity.status(HttpStatus.CREATED).body(participantService.createParticipant(participantDTO));
    }
    
    /**
     * Update participant
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Update participant", description = "Update trainee details")
    public ResponseEntity<ParticipantDTO> updateParticipant(
            @PathVariable Long id,
            @Valid @RequestBody ParticipantDTO participantDTO) {
        log.info("Updating participant with ID: {}", id);
        return ResponseEntity.ok(participantService.updateParticipant(id, participantDTO));
    }
    
    /**
     * Delete participant
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete participant", description = "Delete a trainee")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        log.info("Deleting participant with ID: {}", id);
        participantService.deleteParticipant(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get participants by structure
     */
    @GetMapping("/structure/{structureId}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get participants by structure", description = "Retrieve trainees by organizational structure")
    public ResponseEntity<List<ParticipantDTO>> getParticipantsByStructure(@PathVariable Long structureId) {
        log.info("Fetching participants by structure: {}", structureId);
        return ResponseEntity.ok(participantService.getParticipantsByStructure(structureId));
    }
    
    /**
     * Get participants by profil
     */
    @GetMapping("/profil/{profilId}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get participants by profil", description = "Retrieve trainees by job profile")
    public ResponseEntity<List<ParticipantDTO>> getParticipantsByProfil(@PathVariable Long profilId) {
        log.info("Fetching participants by profil: {}", profilId);
        return ResponseEntity.ok(participantService.getParticipantsByProfil(profilId));
    }
    
    /**
     * Get active participants
     */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get active participants", description = "Retrieve all active trainees")
    public ResponseEntity<List<ParticipantDTO>> getActiveParticipants() {
        log.info("Fetching active participants");
        return ResponseEntity.ok(participantService.getActiveParticipants());
    }
    
    /**
     * Get participants by formation
     */
    @GetMapping("/formation/{formationId}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get participants by formation", description = "Retrieve trainees enrolled in training session")
    public ResponseEntity<List<ParticipantDTO>> getParticipantsByFormation(@PathVariable Long formationId) {
        log.info("Fetching participants for formation: {}", formationId);
        return ResponseEntity.ok(participantService.getParticipantsByFormation(formationId));
    }
    
    /**
     * Count participants by structure
     */
    @GetMapping("/count/structure/{structureId}")
    @PreAuthorize("hasAnyRole('RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Count participants by structure", description = "Get number of trainees in structure")
    public ResponseEntity<Long> countParticipantsByStructure(@PathVariable Long structureId) {
        log.info("Counting participants for structure: {}", structureId);
        return ResponseEntity.ok(participantService.countParticipantsByStructure(structureId));
    }
    
    /**
     * Deactivate participant
     */
    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Deactivate participant", description = "Mark trainee as inactive")
    public ResponseEntity<ParticipantDTO> deactivateParticipant(@PathVariable Long id) {
        log.info("Deactivating participant with ID: {}", id);
        return ResponseEntity.ok(participantService.deactivateParticipant(id));
    }
    
    /**
     * Reactivate participant
     */
    @PostMapping("/{id}/reactivate")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Reactivate participant", description = "Mark trainee as active")
    public ResponseEntity<ParticipantDTO> reactivateParticipant(@PathVariable Long id) {
        log.info("Reactivating participant with ID: {}", id);
        return ResponseEntity.ok(participantService.reactivateParticipant(id));
    }
}
