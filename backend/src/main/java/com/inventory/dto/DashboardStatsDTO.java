package com.inventory.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardStatsDTO {
    private long totalProducts;
    private long totalCategories;
    private int lowStockProducts;
    private List<RecentActivityDTO> recentActivities;
    private List<CategoryStatsDTO> categoryStats;
}

@Data
class RecentActivityDTO {
    private String activityType;
    private String productName;
    private String timestamp;
    private int quantityChange;
}

@Data
class CategoryStatsDTO {
    private String categoryName;
    private long productCount;
    private long totalQuantity;
} 