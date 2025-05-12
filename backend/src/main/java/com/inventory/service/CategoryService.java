package com.inventory.service;

import java.util.List;

import com.inventory.entity.Category;

public interface CategoryService {
    public List<Category> getAllCategories();
    public Category createCategory(Category category, Long createdByUserId) throws Exception;
}
