package com.inventory.dto;

import lombok.Data;

@Data
public class CategoryStatsDTO {
    private String name;
    private long productCount;
    private long totalQuantity;
} 