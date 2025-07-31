package com.example.jwtdemo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ExternalAuthService externalAuthService;

    private final Map<String, UserDetails> users = new HashMap<>();

    public CustomUserDetailsService() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 테스트용 사용자들 생성 (외부 API 실패 시 폴백용)
        users.put("user1", User.builder()
                .username("user1")
                .password(encoder.encode("password1"))
                .authorities(Arrays.asList(new SimpleGrantedAuthority("USER")))
                .build());
        
        users.put("user2", User.builder()
                .username("user2")
                .password(encoder.encode("password2"))
                .authorities(Arrays.asList(new SimpleGrantedAuthority("USER")))
                .build());
        
        users.put("admin", User.builder()
                .username("admin")
                .password(encoder.encode("admin123"))
                .authorities(Arrays.asList(new SimpleGrantedAuthority("ADMIN")))
                .build());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 외부 API를 통한 인증이 실패했을 때만 내부 사용자 정보 사용
        UserDetails user = users.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }
        return user;
    }

    /**
     * 외부 API를 통해 사용자 인증을 수행하고 UserDetails를 생성
     */
    public UserDetails authenticateWithExternalService(String username, String password) {
        ExternalAuthService.AuthResult authResult = externalAuthService.authenticateUser(username, password);
        
        if (authResult.isValid()) {
            return User.builder()
                    .username(authResult.getUsername())
                    .password("") // 외부 인증이므로 비밀번호는 빈 문자열
                    .authorities(Arrays.asList(new SimpleGrantedAuthority(authResult.getRole())))
                    .build();
        }
        
        // 외부 인증 실패 시 내부 사용자 정보로 폴백
        return loadUserByUsername(username);
    }
} 