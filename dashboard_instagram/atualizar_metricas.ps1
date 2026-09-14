# Script de Atualização Automática de Métricas do Instagram via Playwright CDP
Write-Host "=== Atualizador de Métricas do Instagram ===" -ForegroundColor Cyan

# 1. Abre o Chromium Ungoogled na porta 9222 se necessário
Write-Host "1. Iniciando Chromium Ungoogled na porta 9222..." -ForegroundColor Yellow
Start-Process "C:\Users\Admin\AppData\Local\Chromium\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222"

Start-Sleep -Seconds 3

# 2. Executa a coleta via CDP
Write-Host "2. Coletando dados via Playwright CDP..." -ForegroundColor Yellow
node collector.js --account pingunana --cdp

Write-Host "=== Concluído com Sucesso! Abra o Power BI e clique em Atualizar ===" -ForegroundColor Green
