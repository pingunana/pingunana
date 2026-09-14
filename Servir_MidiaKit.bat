@echo off
setlocal
title Midia Kit PinguNana - servidor local
cd /d "%~dp0"

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object {$_.IPAddress -notlike '169.254.*' -and $_.IPAddress -ne '127.0.0.1'} ^| Select-Object -First 1).IPAddress"') do set LANIP=%%i
if "%LANIP%"=="" set LANIP=localhost

echo ==================================================
echo    Midia Kit PinguNana - servidor local
echo ==================================================
echo    Endereco na rede (abra no celular no mesmo Wi-Fi):
echo        http://%LANIP%:8080/
echo    Se o Windows pedir, clique em "Permitir acesso".
echo    Para PARAR: feche esta janela.
echo ==================================================
echo.

where node >nul 2>&1
if %errorlevel%==0 (
  echo Servindo com Node...
  node "%~dp0server.js"
  goto end
)

where python >nul 2>&1
if %errorlevel%==0 (
  echo Servindo com Python...
  python -m http.server 8080 --bind 0.0.0.0
  goto end
)

where py >nul 2>&1
if %errorlevel%==0 (
  echo Servindo com Python...
  py -3 -m http.server 8080 --bind 0.0.0.0
  goto end
)

echo Nao encontrei Node nem Python instalados nesta maquina.
echo Instale o Node ^(https://nodejs.org^) ou Python ^(https://python.org^) e rode de novo.

:end
echo.
echo Servidor encerrado.
pause
endlocal
