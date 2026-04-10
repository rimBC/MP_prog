package com.example.backend_mp.service;

import com.example.backend_mp.dto.*;
import com.example.backend_mp.entity.*;
import com.example.backend_mp.repository.UtilisateurRepository;
import com.example.backend_mp.repository.RoleRepository;
import com.example.backend_mp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Authentication Service for handling user authentication and token generation
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {
    
    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    /**
     * Authenticate user and generate JWT tokens
     */
    public AuthResponse authenticate(AuthRequest authRequest) {
        log.info("Attempting to authenticate user: {}", authRequest.getLogin());
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                authRequest.getLogin(),
                authRequest.getPassword()
            )
        );
        
        String jwt = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authRequest.getLogin());
        
        Utilisateur utilisateur = utilisateurRepository.findByLogin(authRequest.getLogin())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        log.info("User authenticated successfully: {}", authRequest.getLogin());
        
        return AuthResponse.builder()
            .token(jwt)
            .refreshToken(refreshToken)
            .id(utilisateur.getId())
            .login(utilisateur.getLogin())
            .role(utilisateur.getRole().getNom())
            .actif(utilisateur.getActif())
            .build();
    }
    
    /**
     * Refresh JWT token using refresh token
     */
    public AuthResponse refreshToken(String refreshToken) {
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            String newToken = jwtTokenProvider.generateTokenFromUsername(username);
            
            Utilisateur utilisateur = utilisateurRepository.findByLogin(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            return AuthResponse.builder()
                .token(newToken)
                .refreshToken(refreshToken)
                .id(utilisateur.getId())
                .login(utilisateur.getLogin())
                .role(utilisateur.getRole().getNom())
                .actif(utilisateur.getActif())
                .build();
        }
        
        throw new IllegalArgumentException("Invalid refresh token");
    }
    /**
     * Register a new user (sign-up)
     */
    @Transactional
    public SignUpResponse signUp(SignUpRequest signUpRequest) {
        log.info("Sign-up request for user: {}", signUpRequest.getLogin());

        // Validate input
        if (!signUpRequest.getPassword().equals(signUpRequest.getPasswordConfirm())) {
            log.warn("Password confirmation mismatch for user: {}", signUpRequest.getLogin());
            return new SignUpResponse(false, "Passwords do not match");
        }

        // Check if user already exists
        if (utilisateurRepository.existsByLogin(signUpRequest.getLogin())) {
            log.warn("User already exists: {}", signUpRequest.getLogin());
            return new SignUpResponse(false, "User with this login already exists");
        }

        // Get role
        Role role = roleRepository.findById(signUpRequest.getRoleId())
                .orElseThrow(() -> {
                    log.error("Role not found with ID: {}", signUpRequest.getRoleId());
                    return new IllegalArgumentException("Role not found");
                });

        // Validate role - prevent self-registration as ADMINISTRATEUR
//        if ("ADMINISTRATEUR".equalsIgnoreCase(role.getNom())) {
//            log.warn("Attempt to register as ADMINISTRATEUR: {}", signUpRequest.getLogin());
//            return new SignUpResponse(false, "Cannot self-register as ADMINISTRATEUR. Contact system admin.");
//        }

        try {
            // Create new user
            Utilisateur utilisateur = Utilisateur.builder()
                    .login(signUpRequest.getLogin())
                    .password(passwordEncoder.encode(signUpRequest.getPassword()))
                    .role(role)
                    .actif(true)
                    .build();

            // Save user
            Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

            log.info("User registered successfully: {} with role: {}",
                    savedUtilisateur.getLogin(), role.getNom());

            return new SignUpResponse(
                    savedUtilisateur.getId(),
                    savedUtilisateur.getLogin(),
                    role.getNom(),
                    "User registered successfully. You can now login."
            );

        } catch (Exception e) {
            log.error("Error during user registration: {}", signUpRequest.getLogin(), e);
            return new SignUpResponse(false, "Error during registration: " + e.getMessage());
        }
    }

    /**
     * Verify if a login is available
     */
    public AvailabilityResponse checkLoginAvailability(String login) {
        log.debug("Checking login availability: {}", login);

        boolean available = !utilisateurRepository.existsByLogin(login);

        return AvailabilityResponse.builder()
                .login(login)
                .available(available)
                .message(available ? "Login is available" : "Login is already taken")
                .build();
    }

}
