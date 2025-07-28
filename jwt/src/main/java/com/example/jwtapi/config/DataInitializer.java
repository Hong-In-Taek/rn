package com.example.jwtapi.config;

import com.example.jwtapi.entity.User;
import com.example.jwtapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 기존 데이터가 없을 때만 초기 데이터 생성
        if (userRepository.count() == 0) {
            createInitialUsers();
        }
    }

    private void createInitialUsers() {
        // 테스트용 사용자들 생성
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("user1@example.com");
        user1.setPassword(passwordEncoder.encode("user123"));
        user1.setRole("USER");
        userRepository.save(user1);

        User user2 = new User();
        user2.setUsername("user2");
        user2.setEmail("user2@example.com");
        user2.setPassword(passwordEncoder.encode("user123"));
        user2.setRole("USER");
        userRepository.save(user2);

        System.out.println("=== 초기 사용자 데이터 생성 완료 ===");
        System.out.println("관리자 계정: admin / admin123");
        System.out.println("일반 사용자: user1 / user123");
        System.out.println("일반 사용자: user2 / user123");
        System.out.println("================================");
    }
} 