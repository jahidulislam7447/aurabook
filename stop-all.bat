@echo off
title AuraTechIT Platform - Stopping All Services
color 0C

echo ========================================
echo    Stopping AuraTechIT Platform
echo ========================================
echo.

echo [1/5] Stopping Mock API Service (Port 3005)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3005') do taskkill /F /PID %%a 2>nul

echo [2/5] Stopping Admin Panel (Port 3002)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /F /PID %%a 2>nul

echo [3/5] Stopping Marketing Site (Port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a 2>nul

echo [4/5] Stopping Dashboard (Port 3004)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004') do taskkill /F /PID %%a 2>nul

echo [5/5] Cleaning up any remaining Node.js processes...
taskkill /F /IM node.exe 2>nul

echo.
echo ========================================
echo    All Services Stopped Successfully!
echo ========================================
echo.
echo Services that were stopped:
echo   - Mock API Service (Port 3005)
echo   - Admin Panel (Port 3002)
echo   - Marketing Site (Port 3000)
echo   - Dashboard (Port 3004)
echo.
echo Press any key to exit...
pause >nul
