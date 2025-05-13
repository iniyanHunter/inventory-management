package com.inventory.controller;

import com.inventory.entity.StockEntry;
import com.inventory.service.StockEntryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock-entry")
public class StockEntryController {

    private final StockEntryService stockEntryService;

    @Autowired
    public StockEntryController(StockEntryService stockEntryService) {
        this.stockEntryService = stockEntryService;
    }

    @GetMapping
    public ResponseEntity<List<StockEntry>> getAllStockEntries() {
        List<StockEntry> stockEntries = stockEntryService.getAllStockEntries();
        return ResponseEntity.ok(stockEntries);
    }

    @PostMapping
    public ResponseEntity<?> createStockEntry(@RequestBody StockEntry stockEntry) {
        try {
            StockEntry savedStockEntry = stockEntryService.createStockEntry(stockEntry);
            return ResponseEntity.ok(savedStockEntry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating stock entry: " + e.getMessage());
        }
    }
} 