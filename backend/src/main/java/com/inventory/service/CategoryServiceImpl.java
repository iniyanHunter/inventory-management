package com.inventory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.inventory.entity.Category;
import com.inventory.entity.User;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.UserRepository;

public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    
    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    public Category createCategory(Category category, Long createdByUserId) throws RuntimeException{
        Optional<User> userOpt = userRepository.findById(createdByUserId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + createdByUserId);
        }
        category.setCreatedBy(userOpt.get());
        return categoryRepository.save(category);
    }
}
