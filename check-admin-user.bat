@echo off
title Check Admin User
color 0E

echo ========================================
echo    Checking Admin User in Database
echo ========================================
echo.

echo Connecting to PostgreSQL...
psql -h localhost -U postgres -d auratechit -c "
SELECT 
  u.email,
  u.firstName,
  u.lastName,
  r.name as role_name,
  ur.createdat as joined_at
FROM users u
JOIN user_roles ur ON u.id = ur.userid
JOIN roles r ON ur.roleid = r.id
WHERE u.email = 'admin@auratechit.com' OR r.name = 'super_admin';"

echo.
echo ========================================
echo If no results, you need to create admin user
echo ========================================
echo.
echo Press any key to exit...
pause >nul
