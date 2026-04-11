package com.example.backend_mp.service;

import com.example.backend_mp.dto.DomaineDTO;
import com.example.backend_mp.dto.EmployeurDTO;
import com.example.backend_mp.dto.ProfilDTO;
import com.example.backend_mp.dto.StructureDTO;
import com.example.backend_mp.entity.*;
import com.example.backend_mp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing reference data (Domaine, Structure, Profil, Employeur)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ReferenceDataService {
    
    private final DomaineRepository domaineRepository;
    private final StructureRepository structureRepository;
    private final EmployeurRepository employeurRepository;
    private final ProfilRepository profilRepository;



    // ==================== DOMAINE METHODS ====================
    
    /**
     * Get all domaines
     */
    public List<DomaineDTO> getAllDomaines() {
        log.debug("Fetching all domaines");
        return domaineRepository.findAll()
            .stream()
            .map(this::convertDomainToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get domaine by ID
     */
    public DomaineDTO getDomaineById(Long id) {
        log.debug("Fetching domaine with ID: {}", id);
        return domaineRepository.findById(id)
            .map(this::convertDomainToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Domaine not found with ID: " + id));
    }
    
    /**
     * Create domaine
     */
    @Transactional
    public DomaineDTO createDomaine(DomaineDTO domaineDTO) {
        log.info("Creating domaine: {}", domaineDTO.getLibelle());
        
        Domaine domaine = Domaine.builder()
            .libelle(domaineDTO.getLibelle())
            .description(domaineDTO.getDescription())
            .build();
        
        Domaine saved = domaineRepository.save(domaine);
        log.info("Domaine created with ID: {}", saved.getId());
        
        return convertDomainToDTO(saved);
    }
    
    /**
     * Update domaine
     */
    @Transactional
    public DomaineDTO updateDomaine(Long id, DomaineDTO domaineDTO) {
        log.info("Updating domaine with ID: {}", id);
        
        Domaine domaine = domaineRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Domaine not found"));
        
        if (domaineDTO.getLibelle() != null) {
            domaine.setLibelle(domaineDTO.getLibelle());
        }
        if (domaineDTO.getDescription() != null) {
            domaine.setDescription(domaineDTO.getDescription());
        }
        
        Domaine updated = domaineRepository.save(domaine);
        log.info("Domaine updated successfully");
        
        return convertDomainToDTO(updated);
    }
    
    /**
     * Delete domaine
     */
    @Transactional
    public void deleteDomaine(Long id) {
        log.info("Deleting domaine with ID: {}", id);
        domaineRepository.deleteById(id);
        log.info("Domaine deleted successfully");
    }
    
    // ==================== STRUCTURE METHODS ====================
    
    /**
     * Get all structures
     */
    public List<StructureDTO> getAllStructures() {
        log.debug("Fetching all structures");
        return structureRepository.findAll()
            .stream()
            .map(this::convertStructureToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get structure by ID
     */
    public StructureDTO getStructureById(Long id) {
        log.debug("Fetching structure with ID: {}", id);
        return structureRepository.findById(id)
            .map(this::convertStructureToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Structure not found with ID: " + id));
    }
    
    /**
     * Create structure
     */
    @Transactional
    public StructureDTO createStructure(StructureDTO structureDTO) {
        log.info("Creating structure: {}", structureDTO.getLibelle());
        
        Structure structure = Structure.builder()
            .libelle(structureDTO.getLibelle())
            .description(structureDTO.getDescription())
            .lieu(structureDTO.getLieu())
            .build();
        
        Structure saved = structureRepository.save(structure);
        log.info("Structure created with ID: {}", saved.getId());
        
        return convertStructureToDTO(saved);
    }
    
    /**
     * Update structure
     */
    @Transactional
    public StructureDTO updateStructure(Long id, StructureDTO structureDTO) {
        log.info("Updating structure with ID: {}", id);
        
        Structure structure = structureRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Structure not found"));
        
        if (structureDTO.getLibelle() != null) {
            structure.setLibelle(structureDTO.getLibelle());
        }
        if (structureDTO.getDescription() != null) {
            structure.setDescription(structureDTO.getDescription());
        }
        if (structureDTO.getLieu() != null) {
            structure.setLieu(structureDTO.getLieu());
        }
        
        Structure updated = structureRepository.save(structure);
        log.info("Structure updated successfully");
        
        return convertStructureToDTO(updated);
    }
    
    /**
     * Delete structure
     */
    @Transactional
    public void deleteStructure(Long id) {
        log.info("Deleting structure with ID: {}", id);
        structureRepository.deleteById(id);
        log.info("Structure deleted successfully");
    }
    
    // ==================== PROFIL METHODS ====================
    
    /**
     * Get all profils
     */
    public List<ProfilDTO> getAllProfils() {
        log.debug("Fetching all profils");
        return profilRepository.findAll()
            .stream()
            .map(this::convertProfilToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get profil by ID
     */
    public ProfilDTO getProfilById(Long id) {
        log.debug("Fetching profil with ID: {}", id);
        return profilRepository.findById(id)
            .map(this::convertProfilToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Profil not found with ID: " + id));
    }
    
    /**
     * Create profil
     */
    @Transactional
    public ProfilDTO createProfil(ProfilDTO profilDTO) {
        log.info("Creating profil: {}", profilDTO.getLibelle());
        
        Profil profil = Profil.builder()
            .libelle(profilDTO.getLibelle())
            .description(profilDTO.getDescription())
            .build();
        
        Profil saved = profilRepository.save(profil);
        log.info("Profil created with ID: {}", saved.getId());
        
        return convertProfilToDTO(saved);
    }
    
    /**
     * Update profil
     */
    @Transactional
    public ProfilDTO updateProfil(Long id, ProfilDTO profilDTO) {
        log.info("Updating profil with ID: {}", id);
        
        Profil profil = profilRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Profil not found"));
        
        if (profilDTO.getLibelle() != null) {
            profil.setLibelle(profilDTO.getLibelle());
        }
        if (profilDTO.getDescription() != null) {
            profil.setDescription(profilDTO.getDescription());
        }
        
        Profil updated = profilRepository.save(profil);
        log.info("Profil updated successfully");
        
        return convertProfilToDTO(updated);
    }
    
    /**
     * Delete profil
     */
    @Transactional
    public void deleteProfil(Long id) {
        log.info("Deleting profil with ID: {}", id);
        profilRepository.deleteById(id);
        log.info("Profil deleted successfully");
    }
    
    // ==================== EMPLOYEUR METHODS ====================
    
    /**
     * Get all employeurs
     */
    public List<EmployeurDTO> getAllEmployeurs() {
        log.debug("Fetching all employeurs");
        return employeurRepository.findAll()
            .stream()
            .map(this::convertEmployeurToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get employeur by ID
     */
    public EmployeurDTO getEmployeurById(Long id) {
        log.debug("Fetching employeur with ID: {}", id);
        return employeurRepository.findById(id)
            .map(this::convertEmployeurToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Employeur not found with ID: " + id));
    }
    
    /**
     * Create employeur
     */
    @Transactional
    public EmployeurDTO createEmployeur(EmployeurDTO employeurDTO) {
        log.info("Creating employeur: {}", employeurDTO.getNomEmployeur());
        
        Employeur employeur = Employeur.builder()
            .nomEmployeur(employeurDTO.getNomEmployeur())
            .build();
        
        Employeur saved = employeurRepository.save(employeur);
        log.info("Employeur created with ID: {}", saved.getId());
        
        return convertEmployeurToDTO(saved);
    }
    
    /**
     * Update employeur
     */
    @Transactional
    public EmployeurDTO updateEmployeur(Long id, EmployeurDTO employeurDTO) {
        log.info("Updating employeur with ID: {}", id);
        
        Employeur employeur = employeurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Employeur not found"));
        
        if (employeurDTO.getNomEmployeur() != null) {
            employeur.setNomEmployeur(employeurDTO.getNomEmployeur());
        }
        
        Employeur updated = employeurRepository.save(employeur);
        log.info("Employeur updated successfully");
        
        return convertEmployeurToDTO(updated);
    }
    
    /**
     * Delete employeur
     */
    @Transactional
    public void deleteEmployeur(Long id) {
        log.info("Deleting employeur with ID: {}", id);
        employeurRepository.deleteById(id);
        log.info("Employeur deleted successfully");
    }
    
    // ==================== CONVERTER METHODS ====================
    
    private DomaineDTO convertDomainToDTO(Domaine domaine) {
        return DomaineDTO.builder()
            .id(domaine.getId())
            .libelle(domaine.getLibelle())
            .description(domaine.getDescription())
            .build();
    }
    
    private StructureDTO convertStructureToDTO(Structure structure) {
        return StructureDTO.builder()
            .id(structure.getId())
            .libelle(structure.getLibelle())
            .description(structure.getDescription())
            .lieu(structure.getLieu())
            .build();
    }
    
    private ProfilDTO convertProfilToDTO(Profil profil) {
        return ProfilDTO.builder()
            .id(profil.getId())
            .libelle(profil.getLibelle())
            .description(profil.getDescription())
            .build();
    }
    
    private EmployeurDTO convertEmployeurToDTO(Employeur employeur) {
        return EmployeurDTO.builder()
            .id(employeur.getId())
            .nomEmployeur(employeur.getNomEmployeur())
            .build();
    }
}
