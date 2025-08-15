package com.example.jwtdemo.filter;

import com.example.jwtdemo.service.InstitutionTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class InstitutionTokenFilter extends OncePerRequestFilter {

    @Autowired
    private InstitutionTokenService institutionTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        
        // 사용자 로그인 API에 대해서만 기관 토큰 검증
        if (path.equals("/api/auth/login")) {
            String institutionToken = request.getHeader("Institution-Token");
            
            if (institutionToken == null || institutionToken.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("기관 토큰이 필요합니다.");
                return;
            }

            // 기관 토큰 검증
            InstitutionTokenService.InstitutionTokenResult result = 
                institutionTokenService.validateInstitutionToken(institutionToken);
            
            if (!result.isValid()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("유효하지 않은 기관 토큰입니다.");
                return;
            }

            // 기관 정보를 요청에 설정
            request.setAttribute("institutionId", result.getInstitutionId());
            request.setAttribute("institutionName", result.getInstitutionName());
            request.setAttribute("institutionRole", result.getRole());
            
            logger.info("기관 토큰 검증 성공 - Institution: " + result.getInstitutionName());
        }
        
        chain.doFilter(request, response);
    }
} 