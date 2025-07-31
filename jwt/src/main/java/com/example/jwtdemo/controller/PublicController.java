package com.example.jwtdemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/info")
    public Map<String, Object> getPublicInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "이것은 공개 API입니다.");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "public");
        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "서비스가 정상적으로 실행 중입니다.");
        return response;
    }
} 