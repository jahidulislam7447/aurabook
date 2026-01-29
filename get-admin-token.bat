@echo off
title Get Admin Access Token
color 0B

echo ========================================
echo    Getting Admin Access Token
echo ========================================
echo.

echo Fetching token from API...
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@auratechit.com\",\"password\":\"demo123456\"}"

echo.
echo.
echo ========================================
echo Copy the "token" value from above response
echo ========================================
echo.
echo Press any key to exit...
pause >nul
