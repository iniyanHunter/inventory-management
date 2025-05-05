package com.inventory.repository;

import com.inventory.entity.StockEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {
    List<StockEntry> findByProductId(Long productId);
    List<StockEntry> findByCreatedById(Long userId);
    List<StockEntry> findTop10ByOrderByCreatedAtDesc();
} 