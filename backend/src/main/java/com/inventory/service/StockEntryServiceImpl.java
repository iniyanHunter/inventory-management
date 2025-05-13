package com.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.inventory.entity.StockEntry;
import com.inventory.repository.StockEntryRepository;

public class StockEntryServiceImpl implements StockEntryService {
    private final StockEntryRepository stockEntryRepository;
    @Autowired
    public StockEntryServiceImpl(StockEntryRepository stockEntryRepository) {
        this.stockEntryRepository = stockEntryRepository;
    }
    public List<StockEntry> getAllStockEntries() {
        return stockEntryRepository.findAll();
    }
    public StockEntry createStockEntry(StockEntry stockEntry) throws RuntimeException{
        // Validate required fields
        if (stockEntry.getQuantity() == null || stockEntry.getQuantity() < 0) {
            throw new RuntimeException("Valid quantity is required");
        }
        if (stockEntry.getType() == null) {
            throw new RuntimeException("Stock entry type is required");
        }
        if (stockEntry.getProduct() == null || stockEntry.getProduct().getId() == null) {
            throw new RuntimeException("Product is required");
        }
        if (stockEntry.getCreatedBy() == null || stockEntry.getCreatedBy().getId() == null) {
            throw new RuntimeException("Created by user is required");
        }

        return stockEntryRepository.save(stockEntry);
    }
}
