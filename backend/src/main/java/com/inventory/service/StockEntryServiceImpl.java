package com.inventory.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.inventory.entity.StockEntry;
import com.inventory.repository.StockEntryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@Transactional
public class StockEntryServiceImpl implements StockEntryService {
    private final StockEntryRepository stockEntryRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public StockEntryServiceImpl(StockEntryRepository stockEntryRepository) {
        this.stockEntryRepository = stockEntryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockEntry> getAllStockEntries() {
        List<StockEntry> entries = stockEntryRepository.findAll();
        // Initialize lazy-loaded relationships
        entries.forEach(entry -> {
            entry.getProduct().getName();
            entry.getCreatedBy().getUsername();
            if (entry.getModifiedBy() != null) {
                entry.getModifiedBy().getUsername();
            }
        });
        return entries;
    }

    @Override
    public StockEntry createStockEntry(StockEntry stockEntry) throws RuntimeException {
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
    
        // Fetch the actual product from the database
        var product = entityManager.find(stockEntry.getProduct().getClass(), stockEntry.getProduct().getId());
    
        if (product == null) {
            throw new RuntimeException("Product not found");
        }
    
        // Update product quantity based on stock entry type
        switch (stockEntry.getType()) {
            case IN -> product.setQuantity(product.getQuantity() + stockEntry.getQuantity());
            case OUT -> {
                if (product.getQuantity() < stockEntry.getQuantity()) {
                    throw new RuntimeException("Not enough stock for OUT operation");
                }
                product.setQuantity(product.getQuantity() - stockEntry.getQuantity());
            }
        }
    
        entityManager.merge(product); // Update the product
    
        return stockEntryRepository.save(stockEntry);
    }
}
