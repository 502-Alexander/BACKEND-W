@echo off
echo 🚀 Iniciando Nueva Tienda - Salón Sandra Fajardo
echo ==================================================

echo.
echo 📁 Verificando estructura del proyecto...

if not exist "backend" (
    echo ❌ Error: Directorio backend no encontrado
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: Directorio frontend no encontrado
    pause
    exit /b 1
)

echo ✅ Estructura del proyecto verificada

echo.
echo 📦 Verificando dependencias...

if not exist "backend\node_modules" (
    echo ⚠️  Dependencias del backend faltan
    echo 💡 Ejecuta: npm run install-all
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ⚠️  Dependencias del frontend faltan
    echo 💡 Ejecuta: npm run install-all
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo ⚠️  Dependencias principales faltan
    echo 💡 Ejecuta: npm run install-all
    pause
    exit /b 1
)

echo ✅ Todas las dependencias están instaladas

echo.
echo 🔧 Verificando configuración...

if not exist "backend\.env" (
    echo ⚠️  Archivo .env no encontrado en backend\
    echo 💡 Copia backend\env.example a backend\.env y configura las variables
) else (
    echo ✅ Archivo .env encontrado
)

echo.
echo 🌐 URLs del proyecto:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:4000
echo    API:      http://localhost:4000/api

echo.
echo 🎯 Iniciando servicios...
echo ==================================================

npx concurrently --kill-others --prefix-colors "bgBlue.bold,cyan" --names "BACKEND,FRONTEND" "npm run server" "npm run client"


