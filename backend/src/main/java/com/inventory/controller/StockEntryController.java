package com.inventory.controller;

import com.inventory.dto.StockEntryCreateDTO;
import com.inventory.dto.StockEntryDTO;
import com.inventory.service.StockEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-entries")
public class StockEntryController {

    @Autowired
    private StockEntryService stockEntryService;

    @GetMapping
    public ResponseEntity<List<StockEntryDTO>> getAllStockEntries() {
        return ResponseEntity.ok(stockEntryService.getAllStockEntries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockEntryDTO> getStockEntryById(@PathVariable Long id) {
        return ResponseEntity.ok(stockEntryService.getStockEntryById(id));
    }

    @PostMapping
    public ResponseEntity<StockEntryDTO> createStockEntry(@RequestBody StockEntryCreateDTO stockEntryDTO) {
        return ResponseEntity.ok(stockEntryService.createStockEntry(stockEntryDTO));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockEntryDTO>> getStockEntriesByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(stockEntryService.getStockEntriesByProductId(productId));
    }
} 