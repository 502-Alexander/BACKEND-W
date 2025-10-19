# Script de inicio para Nueva Tienda - PowerShell
Write-Host "🚀 Iniciando Nueva Tienda - Salón Sandra Fajardo" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host "`n📁 Verificando estructura del proyecto..." -ForegroundColor Yellow

if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: Directorio backend no encontrado" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

if (-not (Test-Path "frontend")) {
    Write-Host "❌ Error: Directorio frontend no encontrado" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Estructura del proyecto verificada" -ForegroundColor Green

Write-Host "`n📦 Verificando dependencias..." -ForegroundColor Yellow

$backendDeps = Test-Path "backend\node_modules"
$frontendDeps = Test-Path "frontend\node_modules"
$rootDeps = Test-Path "node_modules"

if (-not $backendDeps -or -not $frontendDeps -or -not $rootDeps) {
    Write-Host "⚠️  Algunas dependencias faltan. Ejecutando instalación..." -ForegroundColor Yellow
    Write-Host "💡 Ejecuta: npm run install-all" -ForegroundColor Cyan
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Todas las dependencias están instaladas" -ForegroundColor Green

Write-Host "`n🔧 Verificando configuración..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Archivo .env no encontrado en backend\" -ForegroundColor Yellow
    Write-Host "💡 Copia backend\env.example a backend\.env y configura las variables" -ForegroundColor Cyan
} else {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
}

Write-Host "`n🌐 URLs del proyecto:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:4000" -ForegroundColor Blue
Write-Host "   API:      http://localhost:4000/api" -ForegroundColor Magenta

Write-Host "`n🎯 Iniciando servicios..." -ForegroundColor White
Write-Host "=" * 50 -ForegroundColor Cyan

# Ejecutar concurrently
npx concurrently --kill-others --prefix-colors "bgBlue.bold,cyan" --names "BACKEND,FRONTEND" "npm run server" "npm run client"


