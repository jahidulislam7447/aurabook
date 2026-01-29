@echo off
title AuraTechIT Platform - Starting All Services
color 0A

echo ========================================
echo    Starting AuraTechIT Platform
echo ========================================
echo.

echo [1/5] Starting Mock API Service...
cd /d "%~dp0services\api"
start "Mock API Service" cmd /k "node dist/mock-server.js"
timeout /t 3 /nobreak >nul

echo [2/5] Starting Admin Panel...
cd /d "%~dp0apps\admin-panel"
start "Admin Panel" cmd /k "npx next dev -p 3002"
timeout /t 3 /nobreak >nul

echo [3/5] Starting Marketing Site...
cd /d "%~dp0apps\marketing-site"
start "Marketing Site" cmd /k "npx next dev -p 3000"
timeout /t 3 /nobreak >nul

echo [4/5] Starting Dashboard...
cd /d "%~dp0apps\dashboard"
start "Dashboard" cmd /k "npx next dev -p 3004"
timeout /t 3 /nobreak >nul

echo [5/5] Compiling Mock API...
cd /d "%~dp0services\api"
npx tsc src/mock-server.ts --outDir dist --target es2020 --module commonjs --esModuleInterop true

echo.
echo ========================================
echo    All Services Started Successfully!
echo ========================================
echo.
echo Access URLs:
echo   Marketing Site: http://localhost:3000
echo   Main Dashboard: http://localhost:3004
echo   Admin Panel:   http://localhost:3002
echo   Mock API:      http://localhost:3005
echo.
echo Demo Credentials:
echo   Email: demo@auratechit.com
echo   Password: demo123456
echo.
echo Super Admin JWT Token:
echo   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJkZW1vQGF1cmF0ZWNoaXQuY29tIiwib3JnYW5pemF0aW9uSWQiOiIxIiwiaWF0IjoxNzY5NzAzMjI2LCJleHAiOjE3NzAzMDgwMjZ9.vE_dH4NtmtCUz1RAxosX1dCf4-wStDdks4hsZeECfbg
echo.
echo Press any key to exit...
pause >nul
