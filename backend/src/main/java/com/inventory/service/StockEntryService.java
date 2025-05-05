package com.inventory.service;

import com.inventory.dto.StockEntryCreateDTO;
import com.inventory.dto.StockEntryDTO;
import com.inventory.entity.StockEntry;
import com.inventory.entity.Product;
import com.inventory.entity.StockEntryType;
import com.inventory.entity.User;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.exception.ValidationException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StockEntryService {

    private final StockEntryRepository stockEntryRepository;
    private final ProductRepository productRepository;

    @Autowired
    public StockEntryService(StockEntryRepository stockEntryRepository, ProductRepository productRepository) {
        this.stockEntryRepository = stockEntryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<StockEntryDTO> getAllStockEntries() {
        return stockEntryRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StockEntryDTO getStockEntryById(Long id) {
        return stockEntryRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Stock entry not found with id: " + id));
    }

    public List<StockEntry> getStockEntriesByProduct(Long productId) {
        return stockEntryRepository.findByProductId(productId);
    }

    public List<StockEntry> getStockEntriesByUser(Long userId) {
        return stockEntryRepository.findByCreatedById(userId);
    }

    @Transactional
    public StockEntryDTO createStockEntry(StockEntryCreateDTO stockEntryDTO) {
        Product product = productRepository.findById(stockEntryDTO.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + stockEntryDTO.getProductId()));

        StockEntry stockEntry = new StockEntry();
        stockEntry.setProduct(product);
        stockEntry.setQuantity(stockEntryDTO.getQuantity());
        stockEntry.setType(StockEntryType.valueOf(stockEntryDTO.getType()));
        stockEntry.setDescription(stockEntryDTO.getDescription());

        // Update product quantity
        if (stockEntry.getType() == StockEntryType.IN) {
            product.setQuantity(product.getQuantity() + stockEntry.getQuantity());
        } else {
            if (product.getQuantity() < stockEntry.getQuantity()) {
                throw new ValidationException("Insufficient stock", List.of(
                    "Current stock: " + product.getQuantity(),
                    "Requested quantity: " + stockEntry.getQuantity()
                ));
            }
            product.setQuantity(product.getQuantity() - stockEntry.getQuantity());
        }

        productRepository.save(product);
        return convertToDTO(stockEntryRepository.save(stockEntry));
    }

    @Transactional(readOnly = true)
    public List<StockEntryDTO> getStockEntriesByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return stockEntryRepository.findByProductId(productId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private StockEntryDTO convertToDTO(StockEntry stockEntry) {
        StockEntryDTO dto = new StockEntryDTO();
        dto.setId(stockEntry.getId());
        dto.setProductId(stockEntry.getProduct().getId());
        dto.setProductName(stockEntry.getProduct().getName());
        dto.setQuantity(stockEntry.getQuantity());
        dto.setType(stockEntry.getType().name());
        dto.setDescription(stockEntry.getDescription());
        dto.setCreatedAt(stockEntry.getCreatedAt().toString());
        if (stockEntry.getCreatedBy() != null) {
            dto.setCreatedById(stockEntry.getCreatedBy().getId());
            dto.setCreatedByUsername(stockEntry.getCreatedBy().getUsername());
        }
        return dto;
    }

    public void deleteStockEntry(Long id) {
        stockEntryRepository.deleteById(id);
    }
} 