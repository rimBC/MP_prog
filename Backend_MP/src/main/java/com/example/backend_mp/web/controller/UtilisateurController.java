package com.example.backend_mp.web.controller;

import com.example.backend_mp.dto.UtilisateurDTO;
import com.example.backend_mp.service.UtilisateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing users (administrators only)
 */
@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "User Management APIs (Admin Only)")
public class UtilisateurController {
    
    private final UtilisateurService utilisateurService;
    
    /**
     * Get all users
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Get all users", description = "Retrieve all system users (Admin only)")
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        log.info("Fetching all utilisateurs");
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }
    
    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Get user by ID", description = "Retrieve specific user (Admin only)")
    public ResponseEntity<UtilisateurDTO> getUtilisateurById(@PathVariable Long id) {
        log.info("Fetching utilisateur with ID: {}", id);
        return ResponseEntity.ok(utilisateurService.getUtilisateurById(id));
    }
    
    /**
     * Get user by login
     */
    @GetMapping("/login/{login}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Get user by login", description = "Retrieve user by login (Admin only)")
    public ResponseEntity<UtilisateurDTO> getUtilisateurByLogin(@PathVariable String login) {
        log.info("Fetching utilisateur with login: {}", login);
        return ResponseEntity.ok(utilisateurService.getUtilisateurByLogin(login));
    }
    
    /**
     * Change user role
     */
    @PutMapping("/{userId}/role/{roleId}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Change user role", description = "Change user's role (Admin only)")
    public ResponseEntity<UtilisateurDTO> changeUserRole(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        log.info("Changing role for utilisateur {} to role {}", userId, roleId);
        return ResponseEntity.ok(utilisateurService.changeUserRole(userId, roleId));
    }
    
    /**
     * Deactivate user
     */
    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Deactivate user", description = "Mark user as inactive (Admin only)")
    public ResponseEntity<UtilisateurDTO> deactivateUser(@PathVariable Long id) {
        log.info("Deactivating utilisateur with ID: {}", id);
        return ResponseEntity.ok(utilisateurService.deactivateUser(id));
    }
    
    /**
     * Activate user
     */
    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Activate user", description = "Mark user as active (Admin only)")
    public ResponseEntity<UtilisateurDTO> activateUser(@PathVariable Long id) {
        log.info("Activating utilisateur with ID: {}", id);
        return ResponseEntity.ok(utilisateurService.activateUser(id));
    }
    
    /**
     * Reset user password
     */
    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Reset user password", description = "Reset user password to temporary value (Admin only)")
    public ResponseEntity<UtilisateurDTO> resetPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Resetting password for utilisateur with ID: {}", id);
        String newPassword = request.get("newPassword");
        return ResponseEntity.ok(utilisateurService.resetPassword(id, newPassword));
    }
    
    /**
     * Get users by role
     */
    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Get users by role", description = "Retrieve users with specific role (Admin only)")
    public ResponseEntity<List<UtilisateurDTO>> getUsersByRole(@PathVariable String roleName) {
        log.info("Fetching users with role: {}", roleName);
        return ResponseEntity.ok(utilisateurService.getUsersByRole(roleName));
    }
    
    /**
     * Get active users
     */
    @GetMapping("/status/active")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Get active users", description = "Retrieve all active users (Admin only)")
    public ResponseEntity<List<UtilisateurDTO>> getActiveUsers() {
        log.info("Fetching active utilisateurs");
        return ResponseEntity.ok(utilisateurService.getActiveUsers());
    }
    
    /**
     * Get inactive users
     */
    @GetMapping("/status/inactive")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Get inactive users", description = "Retrieve all inactive users (Admin only)")
    public ResponseEntity<List<UtilisateurDTO>> getInactiveUsers() {
        log.info("Fetching inactive utilisateurs");
        return ResponseEntity.ok(utilisateurService.getInactiveUsers());
    }
    
    /**
     * Check if login exists
     */
    @GetMapping("/check-login/{login}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Check if login exists", description = "Verify login availability (Admin only)")
    public ResponseEntity<Map<String, Boolean>> loginExists(@PathVariable String login) {
        log.info("Checking if login exists: {}", login);
        boolean exists = utilisateurService.loginExists(login);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
    
    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Delete user", description = "Delete a user account (Admin only)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Deleting utilisateur with ID: {}", id);
        utilisateurService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
