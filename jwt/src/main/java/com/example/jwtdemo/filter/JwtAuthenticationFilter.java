package com.example.jwtdemo.filter;

import com.example.jwtdemo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;
        String role = null;
        String gitToken = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                role = jwtUtil.extractRole(jwt);
                gitToken = jwtUtil.extractGitToken(jwt);
                
                // 기관 정보 추출 (있는 경우)
                String institutionId = jwtUtil.extractInstitutionId(jwt);
                String institutionName = jwtUtil.extractInstitutionName(jwt);
                
                // 디버깅용 로그
                logger.info("JWT 토큰에서 추출된 정보 - Username: " + username + ", Role: " + role + ", GitToken: " + gitToken);
                if (institutionId != null) {
                    logger.info("기관 정보 - InstitutionId: " + institutionId + ", InstitutionName: " + institutionName);
                }
                
            } catch (Exception e) {
                logger.error("JWT 토큰 파싱 오류: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, username)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        username, null, Arrays.asList(new SimpleGrantedAuthority(role)));
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                
                // 요청에 추가 정보 설정 (컨트롤러에서 사용 가능)
                request.setAttribute("userRole", role);
                request.setAttribute("gitToken", gitToken);
                
                // 기관 정보가 있는 경우 설정
                if (jwtUtil.extractInstitutionId(jwt) != null) {
                    request.setAttribute("institutionId", jwtUtil.extractInstitutionId(jwt));
                    request.setAttribute("institutionName", jwtUtil.extractInstitutionName(jwt));
                }
            }
        }
        chain.doFilter(request, response);
    }
} 