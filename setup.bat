@echo off
echo YouTube Music Desktop - Setup Script
echo ===================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js is already installed!
    goto :install_deps
) else (
    echo Node.js is not installed.
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version for best compatibility.
    echo.
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

:install_deps
echo.
echo Installing dependencies...
npm install
if %errorlevel% equ 0 (
    echo Dependencies installed successfully!
    echo.
    echo To start the app, run: npm start
    echo.
    echo Note: You'll need to convert the SVG icon to PNG format.
    echo Save it as 'assets/icon.png' (512x512 pixels recommended).
) else (
    echo Failed to install dependencies.
    echo Please check your internet connection and try again.
)

pause 