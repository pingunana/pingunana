$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8080
$default = "06_MediaKit_Beta.html"

$ip = (Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp,Manual -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike "169.254.*" -and $_.IPAddress -ne "127.0.0.1" } |
    Select-Object -First 1).IPAddress
if (-not $ip) { $ip = "localhost" }

$prefix = "http://$ip`:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try {
    $listener.Start()
} catch {
    Write-Host "Nao consegui abrir em $prefix (tentando somente neste PC)..." -ForegroundColor Yellow
    $listener = New-Object System.Net.HttpListener
    $prefix = "http://localhost:$port/"
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    $ip = "localhost"
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Magenta
Write-Host "   Midia Kit PinguNana - servidor local ATIVO" -ForegroundColor Magenta
Write-Host "==================================================" -ForegroundColor Magenta
Write-Host "   Neste PC:    http://localhost:$port/" -ForegroundColor Cyan
Write-Host "   Nesta rede:  $prefix" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Abra o endereco 'Nesta rede' no celular/tablet"
Write-Host "   conectado a MESMA rede Wi-Fi."
Write-Host ""
Write-Host "   Para PARAR: feche esta janela ou aperte Ctrl+C" -ForegroundColor DarkGray
Write-Host "==================================================" -ForegroundColor Magenta

$mime = @{
    ".html"="text/html; charset=utf-8"; ".htm"="text/html; charset=utf-8";
    ".css"="text/css"; ".js"="application/javascript";
    ".jpeg"="image/jpeg"; ".jpg"="image/jpeg"; ".png"="image/png";
    ".svg"="image/svg+xml"; ".ico"="image/x-icon"; ".json"="application/json"
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart("/"))
        if ([string]::IsNullOrWhiteSpace($rel)) { $rel = $default }
        $path = Join-Path $root $rel
        if ((Test-Path $path -PathType Leaf) -and ($path.StartsWith($root))) {
            $bytes = [System.IO.File]::ReadAllBytes($path)
            $ext = [System.IO.Path]::GetExtension($path).ToLower()
            if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host ("  200  " + $rel) -ForegroundColor DarkGray
        } else {
            $ctx.Response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - nao encontrado: $rel")
            $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host ("  404  " + $rel) -ForegroundColor DarkYellow
        }
        $ctx.Response.OutputStream.Close()
    } catch { }
}
