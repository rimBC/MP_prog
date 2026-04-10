package com.example.backend_mp.service;

import com.example.backend_mp.dto.FormateurDTO;
import com.example.backend_mp.entity.Employeur;
import com.example.backend_mp.entity.Formateur;
import com.example.backend_mp.repository.EmployeurRepository;
import com.example.backend_mp.repository.FormateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Formateur (Trainer) operations
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FormateurService {
    
    private final FormateurRepository formateurRepository;
    private final EmployeurRepository employeurRepository;
    
    @Transactional
    public FormateurDTO createFormateur(FormateurDTO dto) {
        log.info("Creating new formateur: {} {}", dto.getPrenom(), dto.getNom());
        
        Formateur formateur = Formateur.builder()
            .nom(dto.getNom())
            .prenom(dto.getPrenom())
            .email(dto.getEmail())
            .tel(dto.getTel())
            .type(dto.getType())
            .specialite(dto.getSpecialite())
            .bio(dto.getBio())
            .build();
        
        // Set employer for external trainers
        if ("externe".equals(dto.getType()) && dto.getEmployeurId() != null) {
            Employeur employeur = employeurRepository.findById(dto.getEmployeurId())
                .orElseThrow(() -> new IllegalArgumentException("Employer not found"));
            formateur.setEmployeur(employeur);
        }
        
        Formateur saved = formateurRepository.save(formateur);
        log.info("Formateur created with id: {}", saved.getId());
        
        return mapToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public FormateurDTO getFormateurById(Long id) {
        Formateur formateur = formateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Formateur not found"));
        return mapToDTO(formateur);
    }
    
    @Transactional(readOnly = true)
    public List<FormateurDTO> getAllFormateurs() {
        return formateurRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public FormateurDTO updateFormateur(Long id, FormateurDTO dto) {
        log.info("Updating formateur with id: {}", id);
        
        Formateur formateur = formateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Formateur not found"));
        
        formateur.setNom(dto.getNom());
        formateur.setPrenom(dto.getPrenom());
        formateur.setEmail(dto.getEmail());
        formateur.setTel(dto.getTel());
        formateur.setSpecialite(dto.getSpecialite());
        formateur.setBio(dto.getBio());
        
        if ("externe".equals(dto.getType()) && dto.getEmployeurId() != null) {
            Employeur employeur = employeurRepository.findById(dto.getEmployeurId())
                .orElseThrow(() -> new IllegalArgumentException("Employer not found"));
            formateur.setEmployeur(employeur);
        }
        
        Formateur updated = formateurRepository.save(formateur);
        log.info("Formateur updated with id: {}", id);
        
        return mapToDTO(updated);
    }
    
    @Transactional
    public void deleteFormateur(Long id) {
        log.info("Deleting formateur with id: {}", id);
        
        Formateur formateur = formateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Formateur not found"));
        
        formateurRepository.delete(formateur);
        log.info("Formateur deleted with id: {}", id);
    }
    
    @Transactional(readOnly = true)
    public List<FormateurDTO> getFormateursByType(String type) {
        return formateurRepository.findByType(type).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    private FormateurDTO mapToDTO(Formateur formateur) {
        return FormateurDTO.builder()
            .id(formateur.getId())
            .nom(formateur.getNom())
            .prenom(formateur.getPrenom())
            .email(formateur.getEmail())
            .tel(formateur.getTel())
            .type(formateur.getType())
            .employeurId(formateur.getEmployeur() != null ? formateur.getEmployeur().getId() : null)
            .employeurNom(formateur.getEmployeur() != null ? formateur.getEmployeur().getNomEmployeur() : null)
            .specialite(formateur.getSpecialite())
            .bio(formateur.getBio())
            .build();
    }
}
