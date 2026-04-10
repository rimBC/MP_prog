package com.example.backend_mp.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration/sign-up request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpRequest {
    
    @NotBlank(message = "Login is required")
    @Size(min = 3, max = 100, message = "Login must be between 3 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Login can only contain letters, numbers, dots, underscores, and hyphens")
    private String login;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
//    @Pattern(
//        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
//        message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
//    )
    private String password;
    
    @NotBlank(message = "Password confirmation is required")
    private String passwordConfirm;
    
    @NotNull(message = "Role ID is required")
    private Long roleId;
}
