package com.example.backend_mp.web.controller;

import com.example.backend_mp.dto.*;
import com.example.backend_mp.service.ReferenceDataService;
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
 * REST Controller for managing reference data (Domaine, Structure, Profil, Employeur)
 */
@RestController
@RequestMapping("/api/reference")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reference Data", description = "Reference Data Management APIs")
public class ReferenceDataController {
    
    private final ReferenceDataService referenceDataService;
    
    // ==================== DOMAINE ENDPOINTS ====================
    
    /**
     * Get all domaines
     */
    @GetMapping("/domaines")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get all domaines", description = "Retrieve all training domains")
    public ResponseEntity<List<DomaineDTO>> getAllDomaines() {
        log.info("Fetching all domaines");
        return ResponseEntity.ok(referenceDataService.getAllDomaines());
    }
    
    /**
     * Get domaine by ID
     */
    @GetMapping("/domaines/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get domaine by ID", description = "Retrieve specific training domain")
    public ResponseEntity<DomaineDTO> getDomaineById(@PathVariable Long id) {
        log.info("Fetching domaine with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.getDomaineById(id));
    }
    
    /**
     * Create domaine
     */
    @PostMapping("/domaines")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Create domaine", description = "Create a new training domain")
    public ResponseEntity<DomaineDTO> createDomaine(@Valid @RequestBody DomaineDTO domaineDTO) {
        log.info("Creating domaine: {}", domaineDTO.getLibelle());
        return ResponseEntity.status(HttpStatus.CREATED).body(referenceDataService.createDomaine(domaineDTO));
    }
    
    /**
     * Update domaine
     */
    @PutMapping("/domaines/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Update domaine", description = "Update training domain details")
    public ResponseEntity<DomaineDTO> updateDomaine(
            @PathVariable Long id,
            @Valid @RequestBody DomaineDTO domaineDTO) {
        log.info("Updating domaine with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.updateDomaine(id, domaineDTO));
    }
    
    /**
     * Delete domaine
     */
    @DeleteMapping("/domaines/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete domaine", description = "Delete a training domain")
    public ResponseEntity<Void> deleteDomaine(@PathVariable Long id) {
        log.info("Deleting domaine with ID: {}", id);
        referenceDataService.deleteDomaine(id);
        return ResponseEntity.noContent().build();
    }
    
    // ==================== STRUCTURE ENDPOINTS ====================
    
    /**
     * Get all structures
     */
    @GetMapping("/structures")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get all structures", description = "Retrieve all organizational structures")
    public ResponseEntity<List<StructureDTO>> getAllStructures() {
        log.info("Fetching all structures");
        return ResponseEntity.ok(referenceDataService.getAllStructures());
    }
    
    /**
     * Get structure by ID
     */
    @GetMapping("/structures/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get structure by ID", description = "Retrieve specific organizational structure")
    public ResponseEntity<StructureDTO> getStructureById(@PathVariable Long id) {
        log.info("Fetching structure with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.getStructureById(id));
    }
    
    /**
     * Create structure
     */
    @PostMapping("/structures")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Create structure", description = "Create a new organizational structure")
    public ResponseEntity<StructureDTO> createStructure(@Valid @RequestBody StructureDTO structureDTO) {
        log.info("Creating structure: {}", structureDTO.getLibelle());
        return ResponseEntity.status(HttpStatus.CREATED).body(referenceDataService.createStructure(structureDTO));
    }
    
    /**
     * Update structure
     */
    @PutMapping("/structures/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Update structure", description = "Update organizational structure details")
    public ResponseEntity<StructureDTO> updateStructure(
            @PathVariable Long id,
            @Valid @RequestBody StructureDTO structureDTO) {
        log.info("Updating structure with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.updateStructure(id, structureDTO));
    }
    
    /**
     * Delete structure
     */
    @DeleteMapping("/structures/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete structure", description = "Delete an organizational structure")
    public ResponseEntity<Void> deleteStructure(@PathVariable Long id) {
        log.info("Deleting structure with ID: {}", id);
        referenceDataService.deleteStructure(id);
        return ResponseEntity.noContent().build();
    }
    
    // ==================== PROFIL ENDPOINTS ====================
    
    /**
     * Get all profils
     */
    @GetMapping("/profils")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get all profils", description = "Retrieve all job profiles")
    public ResponseEntity<List<ProfilDTO>> getAllProfils() {
        log.info("Fetching all profils");
        return ResponseEntity.ok(referenceDataService.getAllProfils());
    }
    
    /**
     * Get profil by ID
     */
    @GetMapping("/profils/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get profil by ID", description = "Retrieve specific job profile")
    public ResponseEntity<ProfilDTO> getProfilById(@PathVariable Long id) {
        log.info("Fetching profil with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.getProfilById(id));
    }
    
    /**
     * Create profil
     */
    @PostMapping("/profils")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Create profil", description = "Create a new job profile")
    public ResponseEntity<ProfilDTO> createProfil(@Valid @RequestBody ProfilDTO profilDTO) {
        log.info("Creating profil: {}", profilDTO.getLibelle());
        return ResponseEntity.status(HttpStatus.CREATED).body(referenceDataService.createProfil(profilDTO));
    }
    
    /**
     * Update profil
     */
    @PutMapping("/profils/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Update profil", description = "Update job profile details")
    public ResponseEntity<ProfilDTO> updateProfil(
            @PathVariable Long id,
            @Valid @RequestBody ProfilDTO profilDTO) {
        log.info("Updating profil with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.updateProfil(id, profilDTO));
    }
    
    /**
     * Delete profil
     */
    @DeleteMapping("/profils/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete profil", description = "Delete a job profile")
    public ResponseEntity<Void> deleteProfil(@PathVariable Long id) {
        log.info("Deleting profil with ID: {}", id);
        referenceDataService.deleteProfil(id);
        return ResponseEntity.noContent().build();
    }
    
    // ==================== EMPLOYEUR ENDPOINTS ====================
    
    /**
     * Get all employeurs
     */
    @GetMapping("/employeurs")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get all employeurs", description = "Retrieve all external employers")
    public ResponseEntity<List<EmployeurDTO>> getAllEmployeurs() {
        log.info("Fetching all employeurs");
        return ResponseEntity.ok(referenceDataService.getAllEmployeurs());
    }
    
    /**
     * Get employeur by ID
     */
    @GetMapping("/employeurs/{id}")
    @PreAuthorize("hasAnyRole('SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR')")
    @Operation(summary = "Get employeur by ID", description = "Retrieve specific external employer")
    public ResponseEntity<EmployeurDTO> getEmployeurById(@PathVariable Long id) {
        log.info("Fetching employeur with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.getEmployeurById(id));
    }
    
    /**
     * Create employeur
     */
    @PostMapping("/employeurs")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Create employeur", description = "Create a new external employer")
    public ResponseEntity<EmployeurDTO> createEmployeur(@Valid @RequestBody EmployeurDTO employeurDTO) {
        log.info("Creating employeur: {}", employeurDTO.getNomEmployeur());
        return ResponseEntity.status(HttpStatus.CREATED).body(referenceDataService.createEmployeur(employeurDTO));
    }
    
    /**
     * Update employeur
     */
    @PutMapping("/employeurs/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Update employeur", description = "Update external employer details")
    public ResponseEntity<EmployeurDTO> updateEmployeur(
            @PathVariable Long id,
            @Valid @RequestBody EmployeurDTO employeurDTO) {
        log.info("Updating employeur with ID: {}", id);
        return ResponseEntity.ok(referenceDataService.updateEmployeur(id, employeurDTO));
    }
    
    /**
     * Delete employeur
     */
    @DeleteMapping("/employeurs/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete employeur", description = "Delete an external employer")
    public ResponseEntity<Void> deleteEmployeur(@PathVariable Long id) {
        log.info("Deleting employeur with ID: {}", id);
        referenceDataService.deleteEmployeur(id);
        return ResponseEntity.noContent().build();
    }
}
