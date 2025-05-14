package com.inventory.entity;

public class Stats {
    private int totalProducts;
    private double totalProductValue;
    private int recentActivityCount;
    private int lowStockCount;

    
    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public double getTotalProductValue() {
        return totalProductValue;
    }

    public void setTotalProductValue(double totalProductValue) {
        this.totalProductValue = totalProductValue;
    }

    public int getRecentActivityCount() {
        return recentActivityCount;
    }

    public void setRecentActivityCount(int recentActivityCount) {
        this.recentActivityCount = recentActivityCount;
    }

    public int getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(int lowStockCount) {
        this.lowStockCount = lowStockCount;
    }
}
