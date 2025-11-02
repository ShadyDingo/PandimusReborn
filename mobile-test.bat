@echo off
setlocal enableextensions

rem Change to project root (location of this script)
cd /d "%~dp0"

if not exist "package.json" (
  echo [!] Run this script from the project root (where package.json lives).
  pause
  exit /b 1
)

echo [*] Ensuring root dependencies are installed...
if not exist "node_modules" (
  call npm install || goto :error
)

echo [*] Ensuring server dependencies are installed...
pushd server
if not exist "node_modules" (
  call npm install || goto :error
)
rem Start server in its own window
start "pandimus-server" cmd /c "npm run dev"
popd

echo [*] Ensuring client dependencies are installed...
pushd client
if not exist "node_modules" (
  call npm install || goto :error
)
rem Start client dev server in its own window
start "pandimus-client" cmd /c "npm start"
popd

echo.
echo [*] Waiting a few seconds for the client dev server (port 3000) to boot...
timeout /t 8 >nul

echo [*] Opening tunnel so your phone can reach the dev server.
echo     Keep this window open while testing.
echo.
echo     ^> When the link appears below, point your phone's browser to it.
echo.

rem Use npx to launch localtunnel without a global install
npx localtunnel --port 3000 --subdomain pandimus-mobile || goto :error

goto :eof

:error
echo.
echo [!] Something went wrong. Check the messages above for details.
pause
exit /b 1
