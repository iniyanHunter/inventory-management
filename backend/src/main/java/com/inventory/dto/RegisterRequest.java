package com.inventory.dto;

import lombok.Data;
import com.inventory.entity.Role;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String username;
    private String password;
    private Role role;
} 