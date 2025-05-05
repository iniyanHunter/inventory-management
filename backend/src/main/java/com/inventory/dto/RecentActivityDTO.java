package com.inventory.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RecentActivityDTO {
    private String type;
    private String productName;
    private LocalDateTime timestamp;
    private int quantity;
} 