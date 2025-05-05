package com.inventory.service;

import com.inventory.dto.CategoryCreateDTO;
import com.inventory.dto.CategoryDTO;
import com.inventory.entity.Category;
import com.inventory.entity.User;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        return categoryRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryCreateDTO categoryDTO) {
        if (categoryRepository.findByName(categoryDTO.getName()).isPresent()) {
            throw new DuplicateResourceException("Category name already exists");
        }

        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        return convertToDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryCreateDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getName().equals(categoryDTO.getName()) &&
            categoryRepository.findByName(categoryDTO.getName()).isPresent()) {
            throw new DuplicateResourceException("Category name already exists");
        }

        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        return convertToDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public List<Category> getCategoriesByCreatedBy(Long userId) {
        return categoryRepository.findByCreatedById(userId);
    }

    public List<Category> getCategoriesByModifiedBy(Long userId) {
        return categoryRepository.findByModifiedById(userId);
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        if (category.getCreatedBy() != null) {
            dto.setCreatedById(category.getCreatedBy().getId());
        }
        if (category.getModifiedBy() != null) {
            dto.setModifiedById(category.getModifiedBy().getId());
        }
        return dto;
    }
} 