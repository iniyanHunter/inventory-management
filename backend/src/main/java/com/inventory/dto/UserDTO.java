package com.inventory.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role;
} 