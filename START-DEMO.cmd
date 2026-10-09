@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.12 or newer before starting the demo.
  pause
  exit /b 1
)
if not exist node_modules\.bin\vite.cmd (
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 goto failed
)
call npm.cmd run build
if errorlevel 1 goto failed
echo Keep this window open while presenting. Press F11 in your browser for fullscreen.
start "" "http://127.0.0.1:4173"
call npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
if errorlevel 1 goto failed
exit /b 0
:failed
echo The demo could not start. Check the message above.
pause
exit /b 1
