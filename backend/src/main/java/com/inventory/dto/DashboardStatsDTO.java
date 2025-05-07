package com.inventory.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardStatsDTO {
    private long totalProducts;
    private long totalCategories;
    private int lowStockProducts;
    private List<RecentActivityDTO> recentActivities;  // uses the existing public class
    private List<CategoryStatsDTO> categoryStats;
}
