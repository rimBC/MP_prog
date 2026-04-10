package com.example.backend_mp.service;

import com.example.backend_mp.entity.Utilisateur;
import com.example.backend_mp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Custom UserDetailsService for loading user details from database
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UtilisateurDetailsService implements UserDetailsService {
    
    private final UtilisateurRepository utilisateurRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByLogin(login)
            .orElseThrow(() -> {
                log.error("User not found with login: {}", login);
                return new UsernameNotFoundException("User not found with login: " + login);
            });
        
        if (!utilisateur.getActif()) {
            throw new UsernameNotFoundException("User account is disabled: " + login);
        }
        
        log.debug("User loaded successfully: {}", login);
        return utilisateur;
    }
}
