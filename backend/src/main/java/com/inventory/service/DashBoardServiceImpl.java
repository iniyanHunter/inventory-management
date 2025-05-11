package com.inventory.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.inventory.entity.Product;
import com.inventory.entity.StockEntry;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockEntryRepository;

@Service
public class DashBoardServiceImpl implements DashBoardService {
  
    private final StockEntryRepository stockEntryRepository;

    private final ProductRepository productRepository;

    @Autowired
    public DashBoardServiceImpl(StockEntryRepository stockEntryRepository) {
    this.stockEntryRepository = stockEntryRepository;
    this.productRepository = null;
    }

    public List<StockEntry> getRecentActivity(){
        return stockEntryRepository.findByCreatedAfter(LocalDateTime.now().minusDays(1));
    }


    @Autowired
    public DashBoardServiceImpl(ProductRepository productRepository) {
        this.stockEntryRepository = null;
        this.productRepository = productRepository;
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
}

