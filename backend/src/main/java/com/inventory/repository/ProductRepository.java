package com.inventory.repository;

import com.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    List<Product> findByCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.threshold")
    List<Product> findByQuantityLessThanEqualThreshold();
    
    List<Product> findByCreatedById(Long userId);
    List<Product> findByModifiedById(Long userId);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = ?1")
    long countByCategoryId(Long categoryId);
    
    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM Product p WHERE p.category.id = ?1")
    long sumQuantityByCategoryId(Long categoryId);

    List<Product> findByIsActiveTrue();
} 