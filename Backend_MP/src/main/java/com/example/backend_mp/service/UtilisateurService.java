package com.example.backend_mp.service;

import com.example.backend_mp.dto.UtilisateurDTO;
import com.example.backend_mp.entity.Role;
import com.example.backend_mp.entity.Utilisateur;
import com.example.backend_mp.repository.RoleRepository;
import com.example.backend_mp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing users (administrators only)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UtilisateurService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Get all users
     */
    public List<UtilisateurDTO> getAllUtilisateurs() {
        log.debug("Fetching all utilisateurs");
        return utilisateurRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get user by ID
     */
    public UtilisateurDTO getUtilisateurById(Long id) {
        log.debug("Fetching utilisateur with ID: {}", id);
        return utilisateurRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found with ID: " + id));
    }
    
    /**
     * Get user by login
     */
    public UtilisateurDTO getUtilisateurByLogin(String login) {
        log.debug("Fetching utilisateur with login: {}", login);
        return utilisateurRepository.findByLogin(login)
            .map(this::convertToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found with login: " + login));
    }
    
    /**
     * Change user role
     */
    @Transactional
    public UtilisateurDTO changeUserRole(Long userId, Long roleId) {
        log.info("Changing role for utilisateur ID: {} to roleId: {}", userId, roleId);
        
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found"));
        
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new IllegalArgumentException("Role not found"));
        
        utilisateur.setRole(role);
        Utilisateur updated = utilisateurRepository.save(utilisateur);
        
        log.info("User role changed successfully");
        return convertToDTO(updated);
    }
    
    /**
     * Deactivate user
     */
    @Transactional
    public UtilisateurDTO deactivateUser(Long id) {
        log.info("Deactivating utilisateur with ID: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found"));
        
        utilisateur.setActif(false);
        Utilisateur updated = utilisateurRepository.save(utilisateur);
        
        log.info("User deactivated successfully");
        return convertToDTO(updated);
    }
    
    /**
     * Activate user
     */
    @Transactional
    public UtilisateurDTO activateUser(Long id) {
        log.info("Activating utilisateur with ID: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found"));
        
        utilisateur.setActif(true);
        Utilisateur updated = utilisateurRepository.save(utilisateur);
        
        log.info("User activated successfully");
        return convertToDTO(updated);
    }
    
    /**
     * Reset user password (set temporary password)
     */
    @Transactional
    public UtilisateurDTO resetPassword(Long id, String newPassword) {
        log.info("Resetting password for utilisateur ID: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found"));
        
        utilisateur.setPassword(passwordEncoder.encode(newPassword));
        Utilisateur updated = utilisateurRepository.save(utilisateur);
        
        log.info("Password reset successfully");
        return convertToDTO(updated);
    }
    
    /**
     * Change user password
     */
    @Transactional
    public void changePassword(Long id, String oldPassword, String newPassword) {
        log.info("Changing password for utilisateur ID: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found"));
        
        if (!passwordEncoder.matches(oldPassword, utilisateur.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        
        utilisateur.setPassword(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(utilisateur);
        
        log.info("Password changed successfully");
    }
    
    /**
     * Get users by role
     */
    public List<UtilisateurDTO> getUsersByRole(String roleName) {
        log.debug("Fetching users by role: {}", roleName);
        Role role = roleRepository.findByNom(roleName)
            .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));
        
        return utilisateurRepository.findAll()
            .stream()
            .filter(u -> u.getRole().getId().equals(role.getId()))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get active users
     */
    public List<UtilisateurDTO> getActiveUsers() {
        log.debug("Fetching active users");
        return utilisateurRepository.findAll()
            .stream()
            .filter(Utilisateur::getActif)
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get inactive users
     */
    public List<UtilisateurDTO> getInactiveUsers() {
        log.debug("Fetching inactive users");
        return utilisateurRepository.findAll()
            .stream()
            .filter(u -> !u.getActif())
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Check if login exists
     */
    public boolean loginExists(String login) {
        log.debug("Checking if login exists: {}", login);
        return utilisateurRepository.existsByLogin(login);
    }
    
    /**
     * Delete user
     */
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting utilisateur with ID: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur not found"));
        
        utilisateurRepository.delete(utilisateur);
        log.info("User deleted successfully");
    }
    
    /**
     * Convert Utilisateur entity to DTO
     */
    private UtilisateurDTO convertToDTO(Utilisateur utilisateur) {
        return UtilisateurDTO.builder()
            .id(utilisateur.getId())
            .login(utilisateur.getLogin())
            .roleId(utilisateur.getRole().getId())
                .roleName(utilisateur.getRole().getNom())
            .actif(utilisateur.getActif())
            .build();
    }
}
