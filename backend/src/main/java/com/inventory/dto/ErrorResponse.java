package com.inventory.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ErrorResponse {
    private LocalDateTime timestamp;
    private String message;
    private List<String> errors;
    private String path;

    public ErrorResponse(String message, List<String> errors, String path) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
        this.errors = errors;
        this.path = path;
    }

    public ErrorResponse(String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
        this.path = path;
    }
} 