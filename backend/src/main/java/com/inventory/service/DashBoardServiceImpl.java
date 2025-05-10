package com.inventory.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.inventory.entity.Product;
import com.inventory.repository.ProductRepository;

@Service
public class DashBoardServiceImpl implements DashBoardService {
    private final ProductRepository productRepository;

    @Autowired
    public DashBoardServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
}

