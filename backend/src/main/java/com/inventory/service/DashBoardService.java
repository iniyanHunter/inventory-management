package com.inventory.service;

import java.util.List;
import com.inventory.entity.StockEntry;

public interface DashBoardService {
    public List<StockEntry> getRecentActivity();
}
