@echo off
echo ============================================
echo   ATHARRYS PROPERTIES - Local Setup
echo ============================================
echo.

echo [1/3] Installing npm packages...
call npm install

if errorlevel 1 (
    echo ERROR: npm install failed. Make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo [2/3] Building Tailwind CSS...
call npm run build:css

if errorlevel 1 (
    echo ERROR: Tailwind build failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Downloading Font Awesome...
echo Please download from: https://fontawesome.com/download
echo.
echo 1. Download "Free Web" package
echo 2. Extract to a temp folder
echo 3. Copy webfonts/ folder to project root
echo 4. Copy css/all.min.css to css/fontawesome.min.css
echo.

echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Replace FORMSPREE_ID in HTML files with your Formspree form ID
echo 2. Run a local server: npx serve
echo 3. Open http://localhost:3000 to test
echo.
pause
