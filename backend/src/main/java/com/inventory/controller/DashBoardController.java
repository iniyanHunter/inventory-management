package com.inventory.controller;

import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.inventory.entity.StockEntry;
import com.inventory.service.DashBoardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashBoardController {
    private final DashBoardService dashBoardService;

    @Autowired
    public DashBoardController(DashBoardService dashBoardService) {
        this.dashBoardService = dashBoardService;
    }

    @GetMapping("/recent-activity")
    public List<StockEntry> getRecentActivity(){
        return dashBoardService.getRecentActivity();
    }
}
