package com.inventory.service;

import com.inventory.dto.DashboardStatsDTO;
import com.inventory.dto.RecentActivityDTO;
import com.inventory.dto.CategoryStatsDTO;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.StockEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private StockEntryRepository stockEntryRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // Get total products count
        stats.setTotalProducts(productRepository.count());
        
        // Get total categories count
        stats.setTotalCategories(categoryRepository.count());
        
        // Get low stock products count
        stats.setLowStockProducts(productRepository.findByQuantityLessThanEqualThreshold().size());
        
        // Get recent activities
        stats.setRecentActivities(getRecentActivities());
        
        // Get category statistics
        stats.setCategoryStats(getCategoryStats());
        
        return stats;
    }

    private List<RecentActivityDTO> getRecentActivities() {
        return stockEntryRepository.findTop10ByOrderByCreatedAtDesc()
            .stream()
            .map(entry -> {
                RecentActivityDTO activity = new RecentActivityDTO();
                activity.setActivityType(entry.getType().name());
                activity.setProductName(entry.getProduct().getName());
                activity.setTimestamp(entry.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                activity.setQuantityChange(entry.getQuantity());
                return activity;
            })
            .collect(Collectors.toList());
    }

    private List<CategoryStatsDTO> getCategoryStats() {
        return categoryRepository.findAll()
            .stream()
            .map(category -> {
                CategoryStatsDTO stats = new CategoryStatsDTO();
                stats.setCategoryName(category.getName());
                stats.setProductCount(productRepository.countByCategoryId(category.getId()));
                stats.setTotalQuantity(productRepository.sumQuantityByCategoryId(category.getId()));
                return stats;
            })
            .collect(Collectors.toList());
    }
} 