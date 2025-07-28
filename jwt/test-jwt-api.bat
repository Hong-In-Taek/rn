@echo off
echo ========================================
echo JWT API 테스트 스크립트
echo ========================================
echo.

echo 1. 공개 엔드포인트 테스트 (인증 불필요)
echo ----------------------------------------
curl -X GET http://localhost:8080/api/test/public
echo.
echo.

echo 2. 관리자 계정으로 로그인하여 토큰 발급
echo ----------------------------------------
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
echo.
echo.

echo 3. 일반 사용자 계정으로 로그인하여 토큰 발급
echo ----------------------------------------
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"user1\",\"password\":\"user123\"}"
echo.
echo.

echo 4. 보호된 엔드포인트 테스트 (토큰 필요)
echo ----------------------------------------
echo 위에서 받은 토큰을 아래 명령어의 YOUR_TOKEN 부분에 넣어서 실행하세요:
echo curl -X GET http://localhost:8080/api/test/protected -H "Authorization: Bearer YOUR_TOKEN"
echo.

echo 5. 관리자 엔드포인트 테스트
echo ----------------------------------------
echo curl -X GET http://localhost:8080/api/test/admin -H "Authorization: Bearer YOUR_TOKEN"
echo.

echo 6. POST 요청 테스트
echo ----------------------------------------
echo curl -X POST http://localhost:8080/api/test/echo ^
echo   -H "Content-Type: application/json" ^
echo   -H "Authorization: Bearer YOUR_TOKEN" ^
echo   -d "{\"test\":\"data\",\"number\":123}"
echo.

echo ========================================
echo 테스트 완료!
echo ========================================
pause 