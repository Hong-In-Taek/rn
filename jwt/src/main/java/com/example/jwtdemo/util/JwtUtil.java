package com.example.jwtdemo.util;

import com.example.jwtdemo.config.JwtConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Autowired
    private JwtConfig jwtConfig;

    private SecretKey getSigningKey() {
        // HMAC-SHA256을 위한 키 생성
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    public String generateToken(String username, String role, String gitToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("gitToken", gitToken);
        return createToken(claims, username);
    }

    /**
     * 기관 정보를 포함한 JWT 토큰 생성
     */
    public String generateToken(String username, String role, String gitToken, String institutionId, String institutionName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("gitToken", gitToken);
        claims.put("institutionId", institutionId);
        claims.put("institutionName", institutionName);
        return createToken(claims, username);
    }

    // 기존 메서드 호환성을 위해 유지
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    /**
     * 영구 토큰 생성 (만료 시간 없음)
     */
    public String generatePermanentToken(String institutionId, String institutionName, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("institutionId", institutionId);
        claims.put("institutionName", institutionName);
        claims.put("role", role);
        claims.put("tokenType", "PERMANENT");
        return createPermanentToken(claims, institutionId);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(getSigningKey())  // 알고리즘 자동 감지
                .compact();
    }

    private String createPermanentToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // 만료 시간 없음 (영구 토큰)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractGitToken(String token) {
        return extractClaim(token, claims -> claims.get("gitToken", String.class));
    }

    public String extractInstitutionId(String token) {
        return extractClaim(token, claims -> claims.get("institutionId", String.class));
    }

    public String extractInstitutionName(String token) {
        return extractClaim(token, claims -> claims.get("institutionName", String.class));
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("tokenType", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (username.equals(extractedUsername) && !isTokenExpired(token));
    }

    /**
     * 영구 토큰 검증 (만료 시간 체크 없음)
     */
    public Boolean validatePermanentToken(String token, String institutionId) {
        final String extractedInstitutionId = extractInstitutionId(token);
        final String tokenType = extractTokenType(token);
        return (institutionId.equals(extractedInstitutionId) && "PERMANENT".equals(tokenType));
    }

    private Boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration != null && expiration.before(new Date());
    }
} 