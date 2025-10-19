#!/usr/bin/env node

/**
 * Script de inicio unificado para Nueva Tienda
 * Ejecuta backend y frontend simultáneamente con verificaciones
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para imprimir mensajes con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para verificar si un directorio existe
function checkDirectory(dir) {
  return fs.existsSync(dir);
}

// Función para verificar si node_modules existe
function checkNodeModules(dir) {
  return fs.existsSync(path.join(dir, 'node_modules'));
}

// Función principal
async function startApp() {
  log('🚀 Iniciando Nueva Tienda - Salón Sandra Fajardo', 'bright');
  log('=' .repeat(50), 'cyan');
  
  // Verificar estructura del proyecto
  log('\n📁 Verificando estructura del proyecto...', 'yellow');
  
  if (!checkDirectory('backend')) {
    log('❌ Error: Directorio backend no encontrado', 'red');
    process.exit(1);
  }
  
  if (!checkDirectory('frontend')) {
    log('❌ Error: Directorio frontend no encontrado', 'red');
    process.exit(1);
  }
  
  log('✅ Estructura del proyecto verificada', 'green');
  
  // Verificar dependencias
  log('\n📦 Verificando dependencias...', 'yellow');
  
  const backendDeps = checkNodeModules('backend');
  const frontendDeps = checkNodeModules('frontend');
  const rootDeps = checkNodeModules('.');
  
  if (!backendDeps || !frontendDeps || !rootDeps) {
    log('⚠️  Algunas dependencias faltan. Ejecutando instalación...', 'yellow');
    log('💡 Ejecuta: npm run install-all', 'cyan');
    process.exit(1);
  }
  
  log('✅ Todas las dependencias están instaladas', 'green');
  
  // Verificar archivo .env
  log('\n🔧 Verificando configuración...', 'yellow');
  
  if (!fs.existsSync('backend/.env')) {
    log('⚠️  Archivo .env no encontrado en backend/', 'yellow');
    log('💡 Copia backend/env.example a backend/.env y configura las variables', 'cyan');
  } else {
    log('✅ Archivo .env encontrado', 'green');
  }
  
  // Mostrar información de inicio
  log('\n🌐 URLs del proyecto:', 'bright');
  log('   Frontend: http://localhost:5173', 'cyan');
  log('   Backend:  http://localhost:4000', 'blue');
  log('   API:      http://localhost:4000/api', 'magenta');
  
  log('\n🎯 Iniciando servicios...', 'bright');
  log('=' .repeat(50), 'cyan');
  
  // Ejecutar concurrently
  const concurrently = spawn('npx', ['concurrently', 
    '--kill-others',
    '--prefix-colors', 'bgBlue.bold,cyan',
    '--names', 'BACKEND,FRONTEND',
    'npm run server',
    'npm run client'
  ], {
    stdio: 'inherit',
    shell: true
  });
  
  // Manejar señales de terminación
  process.on('SIGINT', () => {
    log('\n\n🛑 Deteniendo servicios...', 'yellow');
    concurrently.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('\n\n🛑 Deteniendo servicios...', 'yellow');
    concurrently.kill('SIGTERM');
    process.exit(0);
  });
  
  concurrently.on('close', (code) => {
    log(`\n\n🏁 Servicios terminados con código: ${code}`, 'yellow');
    process.exit(code);
  });
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  startApp().catch(error => {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { startApp };


