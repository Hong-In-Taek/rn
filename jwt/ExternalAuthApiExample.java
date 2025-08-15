// 외부 인증 API 예시 (별도 서비스로 구현)
// 이 파일은 참고용이며, 실제로는 별도의 인증 서버에서 구현해야 합니다.

package com.example.externalauth;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class ExternalAuthController {

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        // 실제 구현에서는 데이터베이스나 LDAP 등을 통해 사용자 검증
        if ("user1".equals(username) && "password1".equals(password)) {
            response.put("valid", true);
            response.put("role", "USER");
            response.put("username", username);
        } else if ("admin".equals(username) && "admin123".equals(password)) {
            response.put("valid", true);
            response.put("role", "ADMIN");
            response.put("username", username);
        } else {
            response.put("valid", false);
            response.put("message", "Invalid credentials");
        }
        
        return ResponseEntity.ok(response);
    }
}

/*
외부 인증 API 응답 형식:
{
    "valid": true/false,
    "role": "USER"/"ADMIN"/"MANAGER",
    "username": "user1",
    "message": "Optional message"
}
*/ 