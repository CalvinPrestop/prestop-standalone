@echo off
setlocal
rem SiteKiosk mode returns on failure so its watchdog can detect an exit.
if /I "%~1"=="--unattended" set "PRESTOP_UNATTENDED=1"
rem Change this path if the showroom PC has a different Thales SDK version.
set "PRESTOP_THALES_SDK_BIN=C:\Program Files (x86)\Thales\Thales Document Reader SDK\3.9.2.42\Bin"
set "PRESTOP_ALLOWED_ORIGINS=https://fabulous-gaufre-1a3d46.netlify.app"

if not exist "%~dp0PrestopThalesScanner.exe" (
    echo ERROR: Put this batch file beside PrestopThalesScanner.exe
    echo in C:\PrestopScanner\deployment\win-x86.
    if not defined PRESTOP_UNATTENDED pause
    exit /b 1
)
if not exist "%PRESTOP_THALES_SDK_BIN%\MMMReader.ini" (
    echo ERROR: The configured Thales SDK Bin folder was not found.
    echo Right-click this batch file, choose Edit, and correct PRESTOP_THALES_SDK_BIN.
    if not defined PRESTOP_UNATTENDED pause
    exit /b 1
)

echo Prestop scanner service
 echo Website: %PRESTOP_ALLOWED_ORIGINS%
echo Close ReaderExpo and the Thales test application before scanning.
echo Keep this window open. Press Ctrl+C to stop the service.
echo Status: http://127.0.0.1:5081/api/scanner/status
echo.
"%~dp0PrestopThalesScanner.exe"
set "SCANNER_EXIT_CODE=%ERRORLEVEL%"
echo.
echo Scanner service stopped. Exit code: %SCANNER_EXIT_CODE%
if not defined PRESTOP_UNATTENDED pause
exit /b %SCANNER_EXIT_CODE%
