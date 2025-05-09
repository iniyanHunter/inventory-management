package com.inventory.service;

import java.util.List;

import com.inventory.entity.Product;


public interface ProductService {
    public List<Product> getAllProducts();
    public Product createProduct(Product product) throws Exception;
}