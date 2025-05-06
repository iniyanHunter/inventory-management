package com.inventory.controller;

import com.inventory.entity.Category;
import com.inventory.entity.User;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public CategoryController(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category, @RequestParam Long createdByUserId) {
        Optional<User> userOpt = userRepository.findById(createdByUserId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found with ID: " + createdByUserId);
        }

        category.setCreatedBy(userOpt.get());
        try {
            Category savedCategory = categoryRepository.save(category);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating category: " + e.getMessage());
        }
    }
}