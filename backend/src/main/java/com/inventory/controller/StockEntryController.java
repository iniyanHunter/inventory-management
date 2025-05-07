package com.inventory.controller;

import com.inventory.entity.StockEntry;
import com.inventory.repository.StockEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock-entry")
public class StockEntryController {

    private final StockEntryRepository stockEntryRepository;

    @Autowired
    public StockEntryController(StockEntryRepository stockEntryRepository) {
        this.stockEntryRepository = stockEntryRepository;
    }

    @GetMapping
    public ResponseEntity<List<StockEntry>> getAllStockEntries() {
        List<StockEntry> stockEntries = stockEntryRepository.findAll();
        return ResponseEntity.ok(stockEntries);
    }

    @PostMapping
    public ResponseEntity<?> createStockEntry(@RequestBody StockEntry stockEntry) {
        try {
            // Validate required fields
            if (stockEntry.getQuantity() == null || stockEntry.getQuantity() < 0) {
                return ResponseEntity.badRequest().body("Valid quantity is required");
            }
            if (stockEntry.getType() == null) {
                return ResponseEntity.badRequest().body("Stock entry type is required");
            }
            if (stockEntry.getProduct() == null || stockEntry.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body("Product is required");
            }
            if (stockEntry.getCreatedBy() == null || stockEntry.getCreatedBy().getId() == null) {
                return ResponseEntity.badRequest().body("Created by user is required");
            }

            StockEntry savedStockEntry = stockEntryRepository.save(stockEntry);
            return ResponseEntity.ok(savedStockEntry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating stock entry: " + e.getMessage());
        }
    }
} 