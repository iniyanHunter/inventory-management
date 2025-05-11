package com.inventory.service;

import java.util.List;
import com.inventory.entity.Product;
import com.inventory.entity.StockEntry;

public interface DashBoardService {
    List<Product> getLowStockProducts();

    List<StockEntry> getRecentActivity();
}