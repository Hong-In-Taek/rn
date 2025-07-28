package com.example.jwtapi.service;

import com.example.jwtapi.dto.AuthResponse;
import com.example.jwtapi.dto.LoginRequest;
import com.example.jwtapi.dto.RegisterRequest;
import com.example.jwtapi.entity.User;
import com.example.jwtapi.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public AuthService(AuthenticationManager authenticationManager, 
                      UserService userService, 
                      JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);
            
            return new AuthResponse(token, userDetails.getUsername());
        } catch (Exception e) {
            return new AuthResponse("Invalid username or password");
        }
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        try {
            // Check if user already exists
            if (userService.existsByUsername(registerRequest.getUsername())) {
                return new AuthResponse("Username already exists");
            }
            
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return new AuthResponse("Email already exists");
            }
            
            // Create new user
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setRole("USER");
            
            userService.createUser(user);
            
            return new AuthResponse("User registered successfully");
        } catch (Exception e) {
            return new AuthResponse("Registration failed: " + e.getMessage());
        }
    }
} 