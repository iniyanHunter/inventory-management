package com.inventory.controller;

import com.inventory.dto.LoginRequest;
import com.inventory.dto.LoginResponse;
import com.inventory.dto.RegisterRequest;
import com.inventory.entity.User;
import com.inventory.repository.UserRepository;
import com.inventory.service.JwtService;
import com.inventory.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);

            LoginResponse response = new LoginResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());

            userService.createUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth endpoints are working!");
    }

    @PostMapping("/migrate-passwords")
    public ResponseEntity<String> migratePasswords() {
        try {
            List<User> allUsers = userService.getAllUsers();
            int updatedCount = 0;
            
            for (User user : allUsers) {
                // Check if password is already encrypted (BCrypt hashes start with $2a$, $2b$, or $2y$)
                if (!user.getPassword().startsWith("$2")) {
                    // Password is plain text, encrypt it
                    String encryptedPassword = passwordEncoder.encode(user.getPassword());
                    user.setPassword(encryptedPassword);
                    userService.updateUser(user);
                    updatedCount++;
                }
            }
            
            return ResponseEntity.ok("Migration completed. Updated " + updatedCount + " passwords.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Migration failed: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String newPassword = request.get("newPassword");
            
            // This is a simple implementation - in production, add proper validation
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            user.setPassword(passwordEncoder.encode(newPassword));
            userService.updateUser(user);
            
            return ResponseEntity.ok("Password reset successfully for user: " + username);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Password reset failed: " + e.getMessage());
        }
    }
} 