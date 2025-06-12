@echo off
echo ===================================
echo Climate Awareness Portal - Database Seeding
echo ===================================
echo.
echo This script will seed the database with sample data.
echo It will create users, initiatives, articles, activities, and comments.
echo.
echo WARNING: This will clear existing data in the database!
echo.
set /p confirm=Are you sure you want to continue? (y/n): 

if /i "%confirm%" neq "y" (
    echo Operation cancelled.
    exit /b
)

echo.
echo Starting database seeding...
echo.

cd backend
node seed-all-data.js

echo.
echo Database seeding completed!
echo.
echo You can now run the application with:
echo npm start
echo.
pause