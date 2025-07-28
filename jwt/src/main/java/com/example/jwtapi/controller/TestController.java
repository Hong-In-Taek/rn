package com.example.jwtapi.controller;

import com.example.jwtapi.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    private final JwtUtil jwtUtil;

    @Autowired
    public TestController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> publicEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "이 엔드포인트는 인증이 필요하지 않습니다!");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/protected")
    public ResponseEntity<Map<String, Object>> protectedEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "이 엔드포인트는 인증이 필요합니다!");
        response.put("status", "success");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> adminEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "관리자 전용 엔드포인트입니다!");
        response.put("status", "success");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echoEndpoint(@RequestBody Map<String, Object> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "POST 요청을 받았습니다!");
        response.put("status", "success");
        response.put("username", authentication.getName());
        response.put("receivedData", request);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/token-info")
    public ResponseEntity<Map<String, Object>> getTokenInfo(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // "Bearer " 제거
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", jwtUtil.extractUsername(token));
        response.put("roles", jwtUtil.extractRoles(token));
        response.put("tokenType", jwtUtil.extractTokenType(token));
        response.put("created", jwtUtil.extractCreatedTime(token));
        response.put("expiration", jwtUtil.extractExpiration(token));
        response.put("issuedAt", jwtUtil.extractClaim(token, Claims::getIssuedAt));
        
        return ResponseEntity.ok(response);
    }
} 