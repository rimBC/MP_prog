package com.example.backend_mp.service;

import com.example.backend_mp.dto.FormationDTO;
import com.example.backend_mp.entity.*;
import com.example.backend_mp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing formations (training sessions)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FormationService {
    
    private final FormationRepository formationRepository;
    private final FormateurRepository formateurRepository;
    private final DomaineRepository DomaineRepository;
    private final ParticipantRepository participantRepository;
    
    /**
     * Get all formations
     */
    public List<FormationDTO> getAllFormations() {
        log.debug("Fetching all formations");
        return formationRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get formation by ID
     */
    public FormationDTO getFormationById(Long id) {
        log.debug("Fetching formation with ID: {}", id);
        return formationRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Formation not found with ID: " + id));
    }
    
    /**
     * Create formation
     */
    @Transactional
    public FormationDTO createFormation(FormationDTO formationDTO) {
        log.info("Creating formation: {}", formationDTO.getTitre());
        
        // Get formateur
        Formateur formateur = formateurRepository.findById(formationDTO.getFormateurId())
            .orElseThrow(() -> new IllegalArgumentException("Formateur not found"));
        
        // Get domaine
        Domaine domaine = DomaineRepository.findById(formationDTO.getDomaineId())
            .orElseThrow(() -> new IllegalArgumentException("Domaine not found"));
        
        Formation formation = Formation.builder()
            .titre(formationDTO.getTitre())
            .annee(formationDTO.getAnnee())
            .duree(formationDTO.getDuree())
            .budget(formationDTO.getBudget())
            .lieu(formationDTO.getLieu())
            .dateDebut(formationDTO.getDateDebut())
            .dateFin(formationDTO.getDateFin())
            .statut(formationDTO.getStatut() != null ? formationDTO.getStatut() : "PLANIFIEE")
            .description(formationDTO.getDescription())
            .formateur(formateur)
            .domaine(domaine)
            .build();
        
        Formation saved = formationRepository.save(formation);
        log.info("Formation created with ID: {}", saved.getId());
        
        return convertToDTO(saved);
    }
    
    /**
     * Update formation
     */
    @Transactional
    public FormationDTO updateFormation(Long id, FormationDTO formationDTO) {
        log.info("Updating formation with ID: {}", id);
        
        Formation formation = formationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Formation not found"));
        
        if (formationDTO.getTitre() != null) {
            formation.setTitre(formationDTO.getTitre());
        }
        if (formationDTO.getAnnee() != null) {
            formation.setAnnee(formationDTO.getAnnee());
        }
        if (formationDTO.getDuree() != null) {
            formation.setDuree(formationDTO.getDuree());
        }
        if (formationDTO.getBudget() != null) {
            formation.setBudget(formationDTO.getBudget());
        }
        if (formationDTO.getLieu() != null) {
            formation.setLieu(formationDTO.getLieu());
        }
        if (formationDTO.getDateDebut() != null) {
            formation.setDateDebut(formationDTO.getDateDebut());
        }
        if (formationDTO.getDateFin() != null) {
            formation.setDateFin(formationDTO.getDateFin());
        }
        if (formationDTO.getStatut() != null) {
            formation.setStatut(formationDTO.getStatut());
        }
        if (formationDTO.getDescription() != null) {
            formation.setDescription(formationDTO.getDescription());
        }
        
        Formation updated = formationRepository.save(formation);
        log.info("Formation updated successfully");
        
        return convertToDTO(updated);
    }
    
    /**
     * Delete formation
     */
    @Transactional
    public void deleteFormation(Long id) {
        log.info("Deleting formation with ID: {}", id);
        
        Formation formation = formationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Formation not found"));
        
        formationRepository.delete(formation);
        log.info("Formation deleted successfully");
    }
    
    /**
     * Get formations by year
     */
    public List<FormationDTO> getFormationsByYear(Integer year) {
        log.debug("Fetching formations for year: {}", year);
        return formationRepository.findByAnnee(year)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get formations by domain
     */
    public List<FormationDTO> getFormationsByDomain(Long domaineId) {
        log.debug("Fetching formations by domain ID: {}", domaineId);
        return formationRepository.findByDomaineId(domaineId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get formations by formateur
     */
    public List<FormationDTO> getFormationsByFormateur(Long formateurId) {
        log.debug("Fetching formations by formateur ID: {}", formateurId);
        return formationRepository.findByFormateurId(formateurId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get formations by status
     */
    public List<FormationDTO> getFormationsByStatus(String status) {
        log.debug("Fetching formations by status: {}", status);
        return formationRepository.findByStatut(status)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get formations by date range
     */
    public List<FormationDTO> getFormationsByDateRange(LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching formations between {} and {}", startDate, endDate);
        return formationRepository.findByDateRange(startDate, endDate)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get formations count by domain
     */
    public Long getFormationsCountByDomain(Long domaineId) {
        log.debug("Counting formations for domain: {}", domaineId);
        return formationRepository.countByDomaineId(domaineId);
    }
    
    /**
     * Convert Formation entity to DTO
     */
    private FormationDTO convertToDTO(Formation formation) {
        return FormationDTO.builder()
            .id(formation.getId())
            .titre(formation.getTitre())
            .annee(formation.getAnnee())
            .duree(formation.getDuree())
            .budget(formation.getBudget())
            .lieu(formation.getLieu())
            .dateDebut(formation.getDateDebut())
            .dateFin(formation.getDateFin())
            .statut(formation.getStatut())
            .description(formation.getDescription())
            .formateurId(formation.getFormateur().getId())
            .formateurNom(formation.getFormateur().getNom() + " " + formation.getFormateur().getPrenom())
            .domaineId(formation.getDomaine().getId())
            .domaineLibelle(formation.getDomaine().getLibelle())
            .nombreParticipants((int) formation.getParticipantFormations()
        .stream()
        .map(ParticipantFormation::getParticipant)
        .collect(Collectors.toSet()).size())
            .build();
    }
}
