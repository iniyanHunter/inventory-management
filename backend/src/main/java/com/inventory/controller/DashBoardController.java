package com.inventory.controller;

import com.inventory.entity.Product;
import com.inventory.entity.StockEntry;
import com.inventory.service.DashBoardService;
import com.inventory.entity.Stats;
 

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashBoardController {

    private final DashBoardService dashBoardService;

    @Autowired
    public DashBoardController(DashBoardService dashBoardService){
        this.dashBoardService = dashBoardService;
    }
    
    @GetMapping("/recent-activity")
    public List<StockEntry> getRecentActivity(){
        return dashBoardService.getRecentActivity();
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts(){
        return dashBoardService.getLowStockProducts();
    }

    @GetMapping("/summary")
    public Stats getDashboardSummary() {
        return dashBoardService.getDashboardSummary();
    }

}
