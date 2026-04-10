package com.example.backend_mp.security;

import com.example.backend_mp.security.JwtAuthenticationEntryPoint;
import com.example.backend_mp.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security Configuration with JWT authentication
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
    securedEnabled = true,
    jsr250Enabled = true,
    prePostEnabled = true
)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;
    
    @Value("${app.cors.allowed-methods}")
    private String allowedMethods;
    
    @Value("${app.cors.allowed-headers}")
    private String allowedHeaders;
    
    @Value("${app.cors.max-age}")
    private long maxAge;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {

        AuthenticationManagerBuilder builder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        builder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());

        return builder.build();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                    .requestMatchers("/api/api/auth/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/error").permitAll() // Add this

                    .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/swagger-ui/**","/swagger-ui/**", "/v3/api-docs/**", "/api/swagger-ui.html").permitAll()
                
                // Formateur endpoints
                .requestMatchers(HttpMethod.GET, "/api/formateurs/**").hasAnyRole("SIMPLE_UTILISATEUR", "RESPONSABLE", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.POST, "/api/formateurs").hasAnyRole("SIMPLE_UTILISATEUR", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.PUT, "/api/formateurs/**").hasAnyRole("SIMPLE_UTILISATEUR", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.DELETE, "/api/formateurs/**").hasAnyRole("ADMINISTRATEUR")
                
                // Formation endpoints
                .requestMatchers(HttpMethod.GET, "/api/formations/**").hasAnyRole("SIMPLE_UTILISATEUR", "RESPONSABLE", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.POST, "/api/formations").hasAnyRole("SIMPLE_UTILISATEUR", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.PUT, "/api/formations/**").hasAnyRole("SIMPLE_UTILISATEUR", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.DELETE, "/api/formations/**").hasAnyRole("ADMINISTRATEUR")
                
                // Participant endpoints
                .requestMatchers(HttpMethod.GET, "/api/participants/**").hasAnyRole("SIMPLE_UTILISATEUR", "RESPONSABLE", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.POST, "/api/participants").hasAnyRole("SIMPLE_UTILISATEUR", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.PUT, "/api/participants/**").hasAnyRole("SIMPLE_UTILISATEUR", "ADMINISTRATEUR")
                .requestMatchers(HttpMethod.DELETE, "/api/participants/**").hasAnyRole("ADMINISTRATEUR")
                
                // Statistiques endpoints
                .requestMatchers("/api/statistiques/**").hasAnyRole("RESPONSABLE", "ADMINISTRATEUR")
                
                // Admin endpoints
                .requestMatchers("/api/utilisateurs/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/roles/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/domaines/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/structures/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/profils/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/employeurs/**").hasRole("ADMINISTRATEUR")
                
                // Any other request must be authenticated
                .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
;
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList(allowedMethods.split(",")));
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));
        configuration.setMaxAge(maxAge);
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
