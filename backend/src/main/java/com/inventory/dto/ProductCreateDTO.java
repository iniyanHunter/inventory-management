package com.inventory.dto;

import lombok.Data;

@Data
public class ProductCreateDTO {
    private String sku;
    private String name;
    private String description;
    private int quantity;
    private int threshold;
    private double price;
    private Long categoryId;
} 