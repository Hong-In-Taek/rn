# JWT API Service

Spring Boot와 Maven을 사용한 JWT 토큰 기반 API 서비스입니다.

## 기능

- JWT 토큰 기반 인증
- 사용자 등록 및 로그인
- 사용자 관리 (CRUD)
- Spring Security를 통한 보안
- H2 인메모리 데이터베이스

## 기술 스택

- Spring Boot 2.7.18
- Spring Security
- Spring Data JPA
- JWT (JSON Web Token)
- H2 Database
- Maven
- Java 15

## 프로젝트 구조

```
src/main/java/com/example/jwtapi/
├── config/
│   ├── JwtConfig.java
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── PublicController.java
│   └── UserController.java
├── dto/
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   └── RegisterRequest.java
├── entity/
│   └── User.java
├── repository/
│   └── UserRepository.java
├── security/
│   └── JwtAuthenticationFilter.java
├── service/
│   ├── AuthService.java
│   ├── CustomUserDetailsService.java
│   └── UserService.java
├── util/
│   └── JwtUtil.java
└── JwtApiApplication.java
```

## API 엔드포인트

### 공개 API (인증 불필요)
- `GET /api/public/hello` - 간단한 인사말
- `GET /api/public/info` - API 정보

### 인증 API
- `POST /api/auth/register` - 사용자 등록
- `POST /api/auth/login` - 사용자 로그인
- `GET /api/auth/test` - 인증 테스트

### 사용자 API (JWT 토큰 필요)
- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/{id}` - 특정 사용자 조회
- `GET /api/users/profile` - 현재 사용자 프로필
- `PUT /api/users/{id}` - 사용자 정보 수정
- `DELETE /api/users/{id}` - 사용자 삭제

## 실행 방법

### 1. 프로젝트 빌드
```bash
mvn clean install
```

### 2. 애플리케이션 실행
```bash
mvn spring-boot:run
```

또는
```bash
java -jar target/jwt-api-1.0.0.jar
```

### 3. 접속
- 애플리케이션: http://localhost:8080
- H2 콘솔: http://localhost:8080/h2-console

## 🧪 테스트 방법

### 📋 **사전 준비된 테스트 계정**
애플리케이션 시작 시 자동으로 생성되는 테스트 계정들:

| 사용자명 | 비밀번호 | 역할 |
|---------|---------|------|
| admin | admin123 | 관리자 |
| user1 | user123 | 일반 사용자 |
| user2 | user123 | 일반 사용자 |

### 🔑 **JWT 토큰 발급 테스트**

#### 1. 관리자 계정으로 로그인
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### 2. 일반 사용자로 로그인
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "password": "user123"
  }'
```

### 🛡️ **보호된 API 테스트**

#### 3. 공개 엔드포인트 (인증 불필요)
```bash
curl -X GET http://localhost:8080/api/test/public
```

#### 4. 보호된 엔드포인트 (토큰 필요)
```bash
curl -X GET http://localhost:8080/api/test/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. 관리자 전용 엔드포인트
```bash
curl -X GET http://localhost:8080/api/test/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 6. POST 요청 테스트
```bash
curl -X POST http://localhost:8080/api/test/echo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "test": "data",
    "number": 123,
    "message": "Hello JWT API!"
  }'
```

### 🚀 **간편 테스트**
Windows에서는 `test-jwt-api.bat` 파일을 실행하여 자동으로 테스트할 수 있습니다.

## 설정

### JWT 설정
`application.properties`에서 JWT 관련 설정을 변경할 수 있습니다:

```properties
jwt.secret=your-secret-key
jwt.expiration=86400000
```

### 데이터베이스 설정
현재 H2 인메모리 데이터베이스를 사용하고 있습니다. 다른 데이터베이스로 변경하려면 `application.properties`를 수정하세요.

## 보안

- 비밀번호는 BCrypt로 해시화됩니다
- JWT 토큰은 HMAC-SHA256으로 서명됩니다
- 모든 API 요청은 CORS가 설정되어 있습니다
- 인증이 필요한 엔드포인트는 JWT 토큰 검증을 거칩니다

## 개발 환경

- Java 15 이상
- Maven 3.6 이상
- Spring Boot 2.7.18

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 