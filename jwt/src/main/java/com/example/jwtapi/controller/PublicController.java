package com.example.jwtapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {
    
    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from public API!");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "JWT API Service");
        info.put("version", "1.0.0");
        info.put("description", "Spring Boot JWT Token based API Service");
        info.put("endpoints", new String[]{
            "POST /api/auth/register - Register new user",
            "POST /api/auth/login - Login user",
            "GET /api/users - Get all users (requires authentication)",
            "GET /api/users/profile - Get current user profile (requires authentication)"
        });
        return ResponseEntity.ok(info);
    }
} 