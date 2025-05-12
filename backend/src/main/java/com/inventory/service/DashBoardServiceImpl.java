package com.inventory.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventory.entity.StockEntry;
import com.inventory.repository.StockEntryRepository;

@Service
public class DashBoardServiceImpl implements DashBoardService {

    private final StockEntryRepository stockEntryRepository;

    @Autowired
    public DashBoardServiceImpl(StockEntryRepository stockEntryRepository) {
        this.stockEntryRepository = stockEntryRepository;
    }

    public List<StockEntry> getRecentActivity() {
        return stockEntryRepository.findByCreatedAtAfter(LocalDateTime.now().minusDays(1));
    }
}