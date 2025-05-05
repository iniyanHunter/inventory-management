package com.inventory.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String sku;
    private String name;
    private String description;
    private Integer quantity;
    private Integer threshold;
    private Double price;
    private Long categoryId;
    private String categoryName;
    private Long createdById;
    private Long modifiedById;
} 