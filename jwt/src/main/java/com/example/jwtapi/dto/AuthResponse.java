package com.example.jwtapi.dto;

import java.util.Objects;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String username;
    private String message;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }
    
    public AuthResponse(String message) {
        this.message = message;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthResponse that = (AuthResponse) o;
        return Objects.equals(token, that.token) && 
               Objects.equals(type, that.type) && 
               Objects.equals(username, that.username) && 
               Objects.equals(message, that.message);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(token, type, username, message);
    }
    
    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='" + (token != null ? "[HIDDEN]" : "null") + '\'' +
                ", type='" + type + '\'' +
                ", username='" + username + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
} 