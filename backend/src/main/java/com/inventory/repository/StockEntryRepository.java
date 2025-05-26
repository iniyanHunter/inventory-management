package com.inventory.repository;

import com.inventory.entity.StockEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {

    List<StockEntry> findByCreatedAtAfter(LocalDateTime date);

}