#!/bin/bash

# Script de instalación para Nueva Tienda
# Este script instala todas las dependencias necesarias

echo "🚀 Instalando Nueva Tienda..."
echo "================================"

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias del proyecto raíz
echo "📦 Instalando dependencias del proyecto raíz..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
cd ..

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

# Crear archivos de configuración si no existen
echo "⚙️ Configurando archivos de entorno..."

if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus configuraciones"
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creando archivo backend/.env..."
    cp backend/env.example backend/.env
    echo "⚠️  IMPORTANTE: Edita el archivo backend/.env con tus configuraciones"
fi

# Crear directorio de logs
echo "📁 Creando directorio de logs..."
mkdir -p logs

# Verificar instalación
echo "🔍 Verificando instalación..."

# Verificar backend
cd backend
if npm list express &> /dev/null; then
    echo "✅ Backend: Dependencias instaladas correctamente"
else
    echo "❌ Backend: Error en la instalación de dependencias"
    exit 1
fi
cd ..

# Verificar frontend
cd frontend
if npm list react &> /dev/null; then
    echo "✅ Frontend: Dependencias instaladas correctamente"
else
    echo "❌ Frontend: Error en la instalación de dependencias"
    exit 1
fi
cd ..

echo ""
echo "🎉 ¡Instalación completada exitosamente!"
echo "================================"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita los archivos .env con tus configuraciones"
echo "2. Ejecuta 'npm run dev' para iniciar el servidor de desarrollo"
echo "3. Abre http://localhost:5173 en tu navegador"
echo ""
echo "🔧 Comandos disponibles:"
echo "- npm run dev          # Iniciar servidor de desarrollo"
echo "- npm run build        # Construir para producción"
echo "- npm run start        # Iniciar servidor de producción"
echo "- npm run install-all  # Reinstalar todas las dependencias"
echo ""
echo "📚 Documentación:"
echo "- README.md           # Documentación principal"
echo "- REVISION_PROYECTO_COMPLETA.md  # Revisión del proyecto"
echo ""
echo "¡Disfruta desarrollando con Nueva Tienda! 🚀✨"
