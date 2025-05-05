package com.inventory.dto;

import com.inventory.entity.UserRole;
import lombok.Data;

@Data
public class UserCreateDTO {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private UserRole role;
} 