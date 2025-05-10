package com.inventory.service;

import java.util.List;
import com.inventory.entity.Product;

public interface DashBoardService {
    List<Product> getLowStockProducts();
}