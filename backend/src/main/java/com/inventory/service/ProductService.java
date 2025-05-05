package com.inventory.service;

import com.inventory.dto.ProductCreateDTO;
import com.inventory.dto.ProductDTO;
import com.inventory.entity.Product;
import com.inventory.entity.User;
import com.inventory.entity.Category;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Optional<Product> getProductBySku(String sku) {
        return productRepository.findBySku(sku);
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateDTO productDTO) {
        if (productRepository.findBySku(productDTO.getSku()).isPresent()) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));

        Product product = new Product();
        product.setSku(productDTO.getSku());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setQuantity(productDTO.getQuantity());
        product.setThreshold(productDTO.getThreshold());
        product.setPrice(productDTO.getPrice());
        product.setCategory(category);

        return convertToDTO(productRepository.save(product));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductCreateDTO productDTO) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getSku().equals(productDTO.getSku()) &&
            productRepository.findBySku(productDTO.getSku()).isPresent()) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));

        product.setSku(productDTO.getSku());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setQuantity(productDTO.getQuantity());
        product.setThreshold(productDTO.getThreshold());
        product.setPrice(productDTO.getPrice());
        product.setCategory(category);

        return convertToDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByQuantityLessThanEqualThreshold();
    }

    public List<Product> getActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getProductsByCreatedBy(Long userId) {
        return productRepository.findByCreatedById(userId);
    }

    public List<Product> getProductsByModifiedBy(Long userId) {
        return productRepository.findByModifiedById(userId);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setQuantity(product.getQuantity());
        dto.setThreshold(product.getThreshold());
        dto.setPrice(product.getPrice());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        if (product.getCreatedBy() != null) {
            dto.setCreatedById(product.getCreatedBy().getId());
        }
        if (product.getModifiedBy() != null) {
            dto.setModifiedById(product.getModifiedBy().getId());
        }
        return dto;
    }
} 