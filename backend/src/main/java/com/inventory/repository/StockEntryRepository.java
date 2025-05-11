package com.inventory.repository;

import com.inventory.entity.StockEntry;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {

                              List<StockEntry> findByCreatedAfter(LocalDateTime minusDays);
} 