package com.example.backend_mp.service;

import com.example.backend_mp.dto.ParticipantDTO;
import com.example.backend_mp.entity.Participant;
import com.example.backend_mp.entity.Profil;
import com.example.backend_mp.entity.Structure;
import com.example.backend_mp.repository.ParticipantRepository;
import com.example.backend_mp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing participants (trainees)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ParticipantService {
    
    private final ParticipantRepository participantRepository;
    private final DomaineRepository domaineRepository;
    private final StructureRepository structureRepository;
    private final EmployeurRepository employeurRepository;
    private final ProfilRepository profilRepository;
    /**
     * Get all participants
     */
    public List<ParticipantDTO> getAllParticipants() {
        log.debug("Fetching all participants");
        return participantRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get participant by ID
     */
    public ParticipantDTO getParticipantById(Long id) {
        log.debug("Fetching participant with ID: {}", id);
        return participantRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Participant not found with ID: " + id));
    }
    
    /**
     * Create participant
     */
    @Transactional
    public ParticipantDTO createParticipant(ParticipantDTO participantDTO) {
        log.info("Creating participant: {} {}", participantDTO.getNom(), participantDTO.getPrenom());
        
        // Get structure
        Structure structure = structureRepository.findById(participantDTO.getStructureId())
            .orElseThrow(() -> new IllegalArgumentException("Structure not found"));
        
        // Get profil
        Profil profil = profilRepository.findById(participantDTO.getProfilId())
            .orElseThrow(() -> new IllegalArgumentException("Profil not found"));
        
        Participant participant = Participant.builder()
            .nom(participantDTO.getNom())
            .prenom(participantDTO.getPrenom())
            .email(participantDTO.getEmail())
            .tel(participantDTO.getTel())
            .dateEmbauche(participantDTO.getDateEmbauche())
            .actif(participantDTO.getActif() != null ? participantDTO.getActif() : true)
            .structure(structure)
            .profil(profil)
            .build();
        
        Participant saved = participantRepository.save(participant);
        log.info("Participant created with ID: {}", saved.getId());
        
        return convertToDTO(saved);
    }
    
    /**
     * Update participant
     */
    @Transactional
    public ParticipantDTO updateParticipant(Long id, ParticipantDTO participantDTO) {
        log.info("Updating participant with ID: {}", id);
        
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        
        if (participantDTO.getNom() != null) {
            participant.setNom(participantDTO.getNom());
        }
        if (participantDTO.getPrenom() != null) {
            participant.setPrenom(participantDTO.getPrenom());
        }
        if (participantDTO.getEmail() != null) {
            participant.setEmail(participantDTO.getEmail());
        }
        if (participantDTO.getTel() != null) {
            participant.setTel(participantDTO.getTel());
        }
        if (participantDTO.getDateEmbauche() != null) {
            participant.setDateEmbauche(participantDTO.getDateEmbauche());
        }
        if (participantDTO.getActif() != null) {
            participant.setActif(participantDTO.getActif());
        }
        
        Participant updated = participantRepository.save(participant);
        log.info("Participant updated successfully");
        
        return convertToDTO(updated);
    }
    
    /**
     * Delete participant
     */
    @Transactional
    public void deleteParticipant(Long id) {
        log.info("Deleting participant with ID: {}", id);
        
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        
        participantRepository.delete(participant);
        log.info("Participant deleted successfully");
    }
    
    /**
     * Get participants by structure
     */
    public List<ParticipantDTO> getParticipantsByStructure(Long structureId) {
        log.debug("Fetching participants by structure ID: {}", structureId);
        return participantRepository.findByStructureId(structureId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get participants by profil
     */
    public List<ParticipantDTO> getParticipantsByProfil(Long profilId) {
        log.debug("Fetching participants by profil ID: {}", profilId);
        return participantRepository.findByProfilId(profilId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get active participants
     */
    public List<ParticipantDTO> getActiveParticipants() {
        log.debug("Fetching active participants");
        return participantRepository.findByActifTrue()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get participants by formation
     */
    public List<ParticipantDTO> getParticipantsByFormation(Long formationId) {
        log.debug("Fetching participants for formation ID: {}", formationId);
        return participantRepository.findParticipantsByFormationId(formationId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Count participants by structure
     */
    public Long countParticipantsByStructure(Long structureId) {
        log.debug("Counting participants for structure: {}", structureId);
        return participantRepository.countByStructureId(structureId);
    }
    
    /**
     * Deactivate participant
     */
    @Transactional
    public ParticipantDTO deactivateParticipant(Long id) {
        log.info("Deactivating participant with ID: {}", id);
        
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        
        participant.setActif(false);
        Participant updated = participantRepository.save(participant);
        
        log.info("Participant deactivated successfully");
        return convertToDTO(updated);
    }
    
    /**
     * Reactivate participant
     */
    @Transactional
    public ParticipantDTO reactivateParticipant(Long id) {
        log.info("Reactivating participant with ID: {}", id);
        
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        
        participant.setActif(true);
        Participant updated = participantRepository.save(participant);
        
        log.info("Participant reactivated successfully");
        return convertToDTO(updated);
    }
    
    /**
     * Convert Participant entity to DTO
     */
    private ParticipantDTO convertToDTO(Participant participant) {
        return ParticipantDTO.builder()
            .id(participant.getId())
            .nom(participant.getNom())
            .prenom(participant.getPrenom())
            .email(participant.getEmail())
            .tel(participant.getTel())
            .dateEmbauche(participant.getDateEmbauche())
            .actif(participant.getActif())
            .structureId(participant.getStructure().getId())
            .structureLibelle(participant.getStructure().getLibelle())
            .profilId(participant.getProfil().getId())
            .profilLibelle(participant.getProfil().getLibelle())
            .build();
    }
}
