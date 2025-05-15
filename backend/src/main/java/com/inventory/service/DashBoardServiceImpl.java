package com.inventory.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.inventory.entity.Product;
import com.inventory.entity.Stats;
import com.inventory.entity.StockEntry;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockEntryRepository;

@Service
public class DashBoardServiceImpl implements DashBoardService {

    private final StockEntryRepository stockEntryRepository;

    private final ProductRepository productRepository;

    @Autowired
    public DashBoardServiceImpl(StockEntryRepository stockEntryRepository,
                                ProductRepository productRepository) {
        this.stockEntryRepository = stockEntryRepository;
        this.productRepository = productRepository;
    }

    public List<StockEntry> getRecentActivity() {
        return stockEntryRepository.findByCreatedAtAtAfter(LocalDateTime.now().minusDays(1));
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    @Override
    public Stats getDashboardSummary() {
    Stats stats = new Stats();

    List<Product> allProducts = productRepository.findAll();
    List<Product> lowStock = productRepository.findLowStockProducts();
    List<StockEntry> recent = stockEntryRepository.findByCreatedAtAfter(LocalDateTime.now().minusDays(1));

    int totalProducts = allProducts.size();
    double totalValue = allProducts.stream()
    .mapToDouble(p -> p.getPrice()
    .multiply(BigDecimal.valueOf(p.getQuantity()))
    .doubleValue())
    .sum();


    stats.setTotalProducts(totalProducts);
    stats.setTotalProductValue(totalValue);
    stats.setLowStockCount(lowStock.size());
    stats.setRecentActivityCount(recent.size());

    return stats;
}

