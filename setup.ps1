Write-Host "YouTube Music Desktop - Setup Script" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking if Node.js is installed..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js is already installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "Choose the LTS version for best compatibility." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installing Node.js, run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
Write-Host "Checking if npm is available..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm is available: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not available. Please ensure Node.js is properly installed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the app, run: npm start" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Note: You'll need to convert the SVG icon to PNG format." -ForegroundColor Yellow
    Write-Host "Save it as 'assets/icon.png' (512x512 pixels recommended)." -ForegroundColor Yellow
} catch {
    Write-Host "Failed to install dependencies." -ForegroundColor Red
    Write-Host "Please check your internet connection and try again." -ForegroundColor Yellow
}

Read-Host "Press Enter to exit" 