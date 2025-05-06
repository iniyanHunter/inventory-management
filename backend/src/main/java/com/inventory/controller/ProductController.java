package com.inventory.controller;

import com.inventory.entity.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product name is required");
            }
            if (product.getSku() == null || product.getSku().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("SKU is required");
            }
            if (product.getQuantity() == null || product.getQuantity() < 0) {
                return ResponseEntity.badRequest().body("Valid quantity is required");
            }
            if (product.getThreshold() == null || product.getThreshold() < 0) {
                return ResponseEntity.badRequest().body("Valid threshold is required");
            }
            if (product.getPrice() == null || product.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body("Valid price is required");
            }
            if (product.getCategory() == null || product.getCategory().getId() == null) {
                return ResponseEntity.badRequest().body("Category is required");
            }
            if (product.getCreatedBy() == null || product.getCreatedBy().getId() == null) {
                return ResponseEntity.badRequest().body("Created by user is required");
            }

            // Check if SKU already exists
            if (productRepository.findBySku(product.getSku()) != null) {
                return ResponseEntity.badRequest().body("Product with this SKU already exists");
            }

            Product savedProduct = productRepository.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating product: " + e.getMessage());
        }
    }
} 