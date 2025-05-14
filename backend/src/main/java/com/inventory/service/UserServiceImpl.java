package com.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventory.entity.User;
import com.inventory.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(User user) throws RuntimeException{
        // Validate required fields
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (user.getRole() == null) {
            throw new RuntimeException("Role is required");
        }
         // Check if username or email already exists
         if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }
}
