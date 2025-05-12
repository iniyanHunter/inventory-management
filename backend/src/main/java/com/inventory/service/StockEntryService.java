package com.inventory.service;

import java.util.List;

import com.inventory.entity.StockEntry;

public interface StockEntryService {
    public List<StockEntry> getAllStockEntries();
    public StockEntry createStockEntry(StockEntry stockEntry) throws Exception;
}
