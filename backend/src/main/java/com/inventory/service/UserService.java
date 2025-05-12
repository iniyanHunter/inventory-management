package com.inventory.service;

import java.util.List;

import com.inventory.entity.User;

public interface UserService {
    public List<User> getAllUsers();
    public User createUser(User user) throws Exception;
}
