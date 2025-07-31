package com.example.jwtdemo.controller;

import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/private")
public class PrivateController {

    @GetMapping("/user-info")
    public Map<String, Object> getUserInfo(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        // JWT 토큰에서 추출한 정보 사용
        String userRole = (String) request.getAttribute("userRole");
        String gitToken = (String) request.getAttribute("gitToken");
        
        response.put("message", "인증된 사용자만 접근 가능한 API");
        response.put("userRole", userRole);
        response.put("gitToken", gitToken);
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }

    @GetMapping("/admin-only")
    public Map<String, Object> adminOnly(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        String userRole = (String) request.getAttribute("userRole");
        
        if ("ADMIN".equals(userRole)) {
            response.put("message", "관리자만 접근 가능한 API");
            response.put("userRole", userRole);
            response.put("adminData", "관리자 전용 데이터");
        } else {
            response.put("message", "관리자 권한이 필요합니다");
            response.put("userRole", userRole);
        }
        
        return response;
    }

    @PostMapping("/git-operation")
    public Map<String, Object> gitOperation(HttpServletRequest request, @RequestBody Map<String, String> gitRequest) {
        Map<String, Object> response = new HashMap<>();
        
        String gitToken = (String) request.getAttribute("gitToken");
        String operation = gitRequest.get("operation");
        
        response.put("message", "Git 작업 수행");
        response.put("operation", operation);
        response.put("gitToken", gitToken);
        response.put("status", "success");
        
        return response;
    }
} 