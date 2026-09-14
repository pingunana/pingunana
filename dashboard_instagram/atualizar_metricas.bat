@echo off
echo === Atualizador de Métricas do Instagram via Playwright CDP ===

echo 1. Verificando/Iniciando Chromium Ungoogled na porta 9222...
start "" "C:\Users\Admin\AppData\Local\Chromium\Application\chrome.exe" --remote-debugging-port=9222

timeout /t 3 /nobreak >nul

echo 2. Executando Coletor Playwright via CDP...
node collector.js --account pingunana --cdp

echo.
echo === Coleta Finalizada! Abra o Power BI e clique em Atualizar. ===
pause
