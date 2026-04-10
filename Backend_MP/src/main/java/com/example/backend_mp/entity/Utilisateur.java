package com.example.backend_mp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

/**
 * Utilisateur (User) entity implementing Spring Security UserDetails
 */
@Entity
@Table(name = "utilisateur", uniqueConstraints = @UniqueConstraint(columnNames = "login"))
//lambok annotations
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "login", unique = true, nullable = false, length = 100)
    private String login;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_role", nullable = false)
    private Role role;
    
    @Column(name = "actif", nullable = false)
    private Boolean actif = true;
    
    @Column(name = "date_creation")
    private Date dateCreation;
    
    @Column(name = "date_modification")
    private Date dateModification;
    
    @PrePersist
    protected void onCreate() {
        dateCreation = new Date();
        dateModification = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dateModification = new Date();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role != null) {
            return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.getNom().toUpperCase()));
        }
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.actif;
    }
}
