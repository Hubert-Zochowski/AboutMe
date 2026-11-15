@echo off
setlocal
for /d %%D in ("%~dp0..\.tools\node-v24.*-win-x64") do set "ABOUTME_NODE=%%~fD"
if not defined ABOUTME_NODE (
    echo Brak lokalnego Node.js 24 LTS w .tools. Zainstaluj Node.js lub pobierz oficjalne archiwum Windows.
    exit /b 1
)
set "PATH=%ABOUTME_NODE%;%PATH%"
set "WRANGLER_SEND_METRICS=false"
cd /d "%~dp0.."
call npm.cmd %*
exit /b %errorlevel%
