package com.inventory.dto;

import lombok.Data;

@Data
public class StockEntryCreateDTO {
    private Long productId;
    private int quantity;
    private String type;
    private String description;
} 