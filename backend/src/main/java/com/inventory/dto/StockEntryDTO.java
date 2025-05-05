package com.inventory.dto;

import lombok.Data;

@Data
public class StockEntryDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private String type;
    private String description;
    private String createdAt;
    private Long createdById;
    private String createdByUsername;
} 