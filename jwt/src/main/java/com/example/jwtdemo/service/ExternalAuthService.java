package com.example.jwtdemo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ExternalAuthService {

    @Value("${external.auth.url:http://localhost:8081/api/auth/validate}")
    private String externalAuthUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public AuthResult authenticateUser(String username, String password) {
        try {
            // 외부 API에 인증 요청
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            Map<String, String> authRequest = Map.of(
                "username", username,
                "password", password
            );

            HttpEntity<Map<String, String>> request = new HttpEntity<>(authRequest, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                externalAuthUrl,
                HttpMethod.POST,
                request,
                Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> authResponse = response.getBody();
                boolean isValid = (Boolean) authResponse.getOrDefault("valid", false);
                String role = (String) authResponse.getOrDefault("role", "USER");
                
                return new AuthResult(isValid, username, role);
            }
            
            return new AuthResult(false, username, "USER");
            
        } catch (Exception e) {
            // 외부 API 호출 실패 시 로그 기록
            System.err.println("외부 인증 API 호출 실패: " + e.getMessage());
            return new AuthResult(false, username, "USER");
        }
    }

    public static class AuthResult {
        private final boolean valid;
        private final String username;
        private final String role;

        public AuthResult(boolean valid, String username, String role) {
            this.valid = valid;
            this.username = username;
            this.role = role;
        }

        public boolean isValid() {
            return valid;
        }

        public String getUsername() {
            return username;
        }

        public String getRole() {
            return role;
        }
    }
} 