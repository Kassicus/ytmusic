Write-Host "Creating YouTube Music Desktop Installer..." -ForegroundColor Green
Write-Host ""

# Create installer directory
if (!(Test-Path "installer")) {
    New-Item -ItemType Directory -Name "installer"
}

# Copy the built app to installer directory
Write-Host "Copying application files..." -ForegroundColor Yellow
$appDir = "installer\YouTube Music Desktop"
if (!(Test-Path $appDir)) {
    New-Item -ItemType Directory -Name $appDir
}
Copy-Item "dist\win-unpacked\*" $appDir -Recurse -Force

# Create a simple installer script
Write-Host "Creating installer script..." -ForegroundColor Yellow
$installScript = @"
@echo off
echo Installing YouTube Music Desktop...
echo.

REM Create program files directory
if not exist "%PROGRAMFILES%\YouTube Music Desktop" mkdir "%PROGRAMFILES%\YouTube Music Desktop"

REM Copy files
xcopy "YouTube Music Desktop\*" "%PROGRAMFILES%\YouTube Music Desktop\" /E /I /Y

REM Create desktop shortcut
echo Creating desktop shortcut...
powershell "$WshShell = New-Object -comObject WScript.Shell; `$Shortcut = `$WshShell.CreateShortcut('%USERPROFILE%\Desktop\YouTube Music Desktop.lnk'); `$Shortcut.TargetPath = '%PROGRAMFILES%\YouTube Music Desktop\YouTube Music Desktop.exe'; `$Shortcut.Save()"

REM Create start menu shortcut
echo Creating start menu shortcut...
if not exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\YouTube Music Desktop" mkdir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\YouTube Music Desktop"
powershell "$WshShell = New-Object -comObject WScript.Shell; `$Shortcut = `$WshShell.CreateShortcut('%APPDATA%\Microsoft\Windows\Start Menu\Programs\YouTube Music Desktop\YouTube Music Desktop.lnk'); `$Shortcut.TargetPath = '%PROGRAMFILES%\YouTube Music Desktop\YouTube Music Desktop.exe'; `$Shortcut.Save()"

echo Installation complete!
echo You can now run YouTube Music Desktop from the Start Menu or Desktop.
pause
"@

$installScript | Out-File -FilePath "installer\install.bat" -Encoding ASCII

# Create a portable version using PowerShell's Compress-Archive
Write-Host "Creating portable version..." -ForegroundColor Yellow
if (Test-Path "YouTube Music Desktop Portable.zip") {
    Remove-Item "YouTube Music Desktop Portable.zip"
}
Compress-Archive -Path "dist\win-unpacked\*" -DestinationPath "YouTube Music Desktop Portable.zip"

# Create installer archive
Write-Host "Creating installer archive..." -ForegroundColor Yellow
if (Test-Path "YouTube Music Desktop Installer.zip") {
    Remove-Item "YouTube Music Desktop Installer.zip"
}
Compress-Archive -Path "installer\*" -DestinationPath "YouTube Music Desktop Installer.zip"

Write-Host ""
Write-Host "Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor Cyan
Write-Host "- YouTube Music Desktop Portable.zip (Portable version)" -ForegroundColor White
Write-Host "- YouTube Music Desktop Installer.zip (Installer version)" -ForegroundColor White
Write-Host ""
Write-Host "To install on another computer:" -ForegroundColor Yellow
Write-Host "1. Extract the installer zip" -ForegroundColor White
Write-Host "2. Run install.bat as administrator" -ForegroundColor White
Write-Host ""
Write-Host "Or use the portable version by extracting and running YouTube Music Desktop.exe" -ForegroundColor White

Read-Host "Press Enter to continue" 