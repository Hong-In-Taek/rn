package com.example.jwtdemo.controller;

import com.example.jwtdemo.service.CustomUserDetailsService;
import com.example.jwtdemo.service.InstitutionTokenService;
import com.example.jwtdemo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private InstitutionTokenService institutionTokenService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            // 기관 정보 가져오기 (InstitutionTokenFilter에서 설정됨)
            String institutionId = (String) request.getAttribute("institutionId");
            String institutionName = (String) request.getAttribute("institutionName");
            String institutionRole = (String) request.getAttribute("institutionRole");
            
            // 외부 API를 통한 인증 수행
            UserDetails userDetails = userDetailsService.authenticateWithExternalService(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
            );
            
            // 사용자 역할 추출
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            
            // Git 토큰 생성 (실제로는 외부 API에서 받아와야 함)
            String gitToken = generateGitToken(loginRequest.getUsername());
            
            // 인증 성공 시 JWT 토큰 생성 (기관 정보 포함)
            final String jwt = jwtUtil.generateToken(
                userDetails.getUsername(), 
                role, 
                gitToken,
                institutionId,
                institutionName
            );

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("username", userDetails.getUsername());
            response.put("role", role);
            response.put("gitToken", gitToken);
            response.put("institutionId", institutionId);
            response.put("institutionName", institutionName);
            response.put("message", "로그인 성공");

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("잘못된 사용자명 또는 비밀번호입니다.");
        }
    }

    @PostMapping("/institution/login")
    public ResponseEntity<?> createInstitutionToken(@RequestBody InstitutionLoginRequest request) {
        try {
            // 기관 토큰 검증
            InstitutionTokenService.InstitutionTokenResult result = 
                institutionTokenService.validateInstitutionToken(request.getInstitutionToken());
            
            if (result.isValid()) {
                // 영구 토큰 생성
                final String permanentToken = jwtUtil.generatePermanentToken(
                    result.getInstitutionId(),
                    result.getInstitutionName(),
                    result.getRole()
                );

                Map<String, Object> response = new HashMap<>();
                response.put("token", permanentToken);
                response.put("institutionId", result.getInstitutionId());
                response.put("institutionName", result.getInstitutionName());
                response.put("role", result.getRole());
                response.put("tokenType", "PERMANENT");
                response.put("message", "기관 영구 토큰 발급 성공");

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("유효하지 않은 기관 토큰입니다.");
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("기관 토큰 검증 실패");
        }
    }

    /**
     * Git 토큰 생성 (예시 - 실제로는 외부 API에서 받아와야 함)
     */
    private String generateGitToken(String username) {
        // 실제 구현에서는 외부 Git API에서 토큰을 받아와야 함
        return "git_token_" + username + "_" + System.currentTimeMillis();
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class InstitutionLoginRequest {
        private String institutionToken;

        public String getInstitutionToken() {
            return institutionToken;
        }

        public void setInstitutionToken(String institutionToken) {
            this.institutionToken = institutionToken;
        }
    }
} 