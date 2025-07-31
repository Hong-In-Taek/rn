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
public class InstitutionTokenService {

    @Value("${institution.auth.url:http://localhost:8082/api/institution/validate}")
    private String institutionAuthUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 기관 토큰으로 영구 토큰 발급
     */
    public InstitutionTokenResult validateInstitutionToken(String institutionToken) {
        try {
            // 기관 토큰 검증 API 호출
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            Map<String, String> request = Map.of(
                "institutionToken", institutionToken
            );

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                institutionAuthUrl,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> authResponse = response.getBody();
                boolean isValid = (Boolean) authResponse.getOrDefault("valid", false);
                String institutionId = (String) authResponse.getOrDefault("institutionId", "");
                String institutionName = (String) authResponse.getOrDefault("institutionName", "");
                String role = (String) authResponse.getOrDefault("role", "INSTITUTION");
                
                return new InstitutionTokenResult(isValid, institutionId, institutionName, role);
            }
            
            return new InstitutionTokenResult(false, "", "", "INSTITUTION");
            
        } catch (Exception e) {
            System.err.println("기관 토큰 검증 API 호출 실패: " + e.getMessage());
            return new InstitutionTokenResult(false, "", "", "INSTITUTION");
        }
    }

    public static class InstitutionTokenResult {
        private final boolean valid;
        private final String institutionId;
        private final String institutionName;
        private final String role;

        public InstitutionTokenResult(boolean valid, String institutionId, String institutionName, String role) {
            this.valid = valid;
            this.institutionId = institutionId;
            this.institutionName = institutionName;
            this.role = role;
        }

        public boolean isValid() {
            return valid;
        }

        public String getInstitutionId() {
            return institutionId;
        }

        public String getInstitutionName() {
            return institutionName;
        }

        public String getRole() {
            return role;
        }
    }
} 