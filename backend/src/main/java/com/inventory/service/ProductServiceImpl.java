package com.inventory.service;

import org.springframework.stereotype.Service;
import com.inventory.entity.Product;
import com.inventory.repository.ProductRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository){
        this.productRepository = productRepository;
    }
    
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    public Product createProduct(Product product) throws Exception{
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                 throw new IllegalArgumentException("Product name is required");
            }
            if (product.getSku() == null || product.getSku().trim().isEmpty()) {
                throw new IllegalArgumentException("SKU is required");
            }
            if (product.getQuantity() == null || product.getQuantity() < 0) {
                throw new IllegalArgumentException("Valid quantity is required");
            }
            if (product.getThreshold() == null || product.getThreshold() < 0) {
                throw new IllegalArgumentException("Valid threshold is required");
            }
            if (product.getPrice() == null || product.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Valid price is required");
            }
            if (product.getCategory() == null || product.getCategory().getId() == null) {
                throw new IllegalArgumentException("Category is required");
            }
            if (product.getCreatedBy() == null || product.getCreatedBy().getId() == null) {
                throw new IllegalArgumentException("Created by user is required");
            }
            // Check if SKU already exists
            if (productRepository.findBySku(product.getSku()) != null) {
                throw new IllegalArgumentException ("Product with this SKU already exists");
            }
        return productRepository.save(product);
    }
}