@echo off
echo Creating YouTube Music Desktop Installer...
echo.

REM Check if 7-Zip is available
where 7z >nul 2>&1
if %errorlevel% neq 0 (
    echo 7-Zip not found. Please install 7-Zip from https://7-zip.org/
    echo Or manually zip the dist/win-unpacked folder and share it.
    pause
    exit /b 1
)

REM Create installer directory
if not exist "installer" mkdir installer

REM Copy the built app to installer directory
echo Copying application files...
xcopy "dist\win-unpacked\*" "installer\YouTube Music Desktop\" /E /I /Y

REM Create a simple installer script
echo Creating installer script...
(
echo @echo off
echo echo Installing YouTube Music Desktop...
echo echo.
echo 
echo REM Create program files directory
echo if not exist "%%PROGRAMFILES%%\YouTube Music Desktop" mkdir "%%PROGRAMFILES%%\YouTube Music Desktop"
echo 
echo REM Copy files
echo xcopy "YouTube Music Desktop\*" "%%PROGRAMFILES%%\YouTube Music Desktop\" /E /I /Y
echo 
echo REM Create desktop shortcut
echo echo Creating desktop shortcut...
echo powershell "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut^('%%USERPROFILE%%\Desktop\YouTube Music Desktop.lnk'^); $Shortcut.TargetPath = '%%PROGRAMFILES%%\YouTube Music Desktop\YouTube Music Desktop.exe'; $Shortcut.Save^(^)"
echo 
echo REM Create start menu shortcut
echo echo Creating start menu shortcut...
echo if not exist "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\YouTube Music Desktop" mkdir "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\YouTube Music Desktop"
echo powershell "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut^('%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\YouTube Music Desktop\YouTube Music Desktop.lnk'^); $Shortcut.TargetPath = '%%PROGRAMFILES%%\YouTube Music Desktop\YouTube Music Desktop.exe'; $Shortcut.Save^(^)"
echo 
echo echo Installation complete!
echo echo You can now run YouTube Music Desktop from the Start Menu or Desktop.
echo pause
) > "installer\install.bat"

REM Create a portable version
echo Creating portable version...
7z a -tzip "YouTube Music Desktop Portable.zip" "dist\win-unpacked\*"

REM Create installer archive
echo Creating installer archive...
7z a -tzip "YouTube Music Desktop Installer.zip" "installer\*"

echo.
echo Build complete!
echo.
echo Files created:
echo - YouTube Music Desktop Portable.zip ^(Portable version^)
echo - YouTube Music Desktop Installer.zip ^(Installer version^)
echo.
echo To install on another computer:
echo 1. Extract the installer zip
echo 2. Run install.bat as administrator
echo.
echo Or use the portable version by extracting and running YouTube Music Desktop.exe
pause 