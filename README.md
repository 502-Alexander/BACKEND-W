# Nueva Tienda - Salón Sandra Fajardo

Sistema completo de e-commerce y gestión para salón de belleza.

## 🚀 Tecnologías

- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express + MySQL
- **Base de Datos:** MySQL con 15 tablas
- **Autenticación:** JWT + bcryptjs
- **PDF:** jsPDF + html2canvas
- **WhatsApp:** Integración para pedidos

## 📋 Funcionalidades

### Tienda Online
- ✅ Catálogo de productos
- ✅ Carrito de compras persistente
- ✅ Checkout con WhatsApp
- ✅ PDF de comprobante
- ✅ Gestión de stock automática

### Dashboard Administrativo
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de inventario
- ✅ Gestión de citas del salón
- ✅ Gestión de clientes
- ✅ Reportes avanzados con gráficas
- ✅ Análisis de logs

### Sistema de Citas
- ✅ Formulario completo de citas
- ✅ Calendario por fecha
- ✅ Gestión de servicios y combos
- ✅ Estados de citas
- ✅ Upload de fotos de clientes

## 🛠️ Instalación Local

```bash
# Instalar dependencias
npm run install-all

# Configurar variables de entorno
cp backend/env.example backend/.env

# Ejecutar en desarrollo
npm run dev
```

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000
- **API Docs:** http://localhost:4000/api

## 📊 Base de Datos

Ejecutar el script: `backend/database/salon_sf_LDD.sql`

Incluye:
- 15 tablas con relaciones FK
- 90 citas de ejemplo del salón
- Datos de productos y servicios
- Usuario admin por defecto

## 🔧 Variables de Entorno

```env
# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=salon_sf
PORT=4000
JWT_SECRET=tu_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email
EMAIL_PASS=tu_password
```

## 📱 Responsive

- ✅ Desktop (>1024px)
- ✅ Tablet (768px-1024px)
- ✅ Mobile (<768px)

## 🚀 Desarrollo Local

Este proyecto está configurado para funcionar **exclusivamente en desarrollo local** con un **comando unificado**.

### ⚡ Inicio Rápido

```bash
# Un solo comando para todo
npm run dev
```

Este comando:
- ✅ Verifica la estructura del proyecto
- ✅ Comprueba que las dependencias estén instaladas
- ✅ Valida la configuración
- ✅ Inicia backend y frontend simultáneamente
- ✅ Muestra URLs y estado de los servicios

### 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **MySQL** (versión 8.0 o superior)
- **npm** o **yarn**

### 🛠️ Instalación Completa

```bash
# 1. Instalar todas las dependencias
npm run install-all

# 2. Configurar MySQL local
# Ejecutar: backend/database/salon_sf_LDD.sql

# 3. Configurar variables de entorno
cp backend/env.example backend/.env

# 4. ¡Ejecutar proyecto!
npm run dev
```

### 🎯 Comandos Disponibles

#### Comandos Principales
```bash
npm run dev          # Inicia backend + frontend (recomendado)
npm start            # Alias para npm run dev
npm run dev:simple   # Inicio simple sin verificaciones
npm run dev:win      # Script de Windows (start.bat)
npm run dev:ps       # Script de PowerShell (start.ps1)
```

#### Comandos Individuales
```bash
npm run server       # Solo backend
npm run client       # Solo frontend
```

#### Comandos de Desarrollo
```bash
npm run build        # Construir frontend para producción
npm run test         # Ejecutar todos los tests
npm run lint         # Linter del frontend
npm run clean        # Limpiar node_modules
npm run reset        # Limpiar e instalar todo de nuevo
```

### 🌐 URLs del Proyecto

Una vez ejecutado `npm run dev`:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000  
- **API:** http://localhost:4000/api

### 🔧 Configuración Avanzada

El script de inicio incluye verificaciones automáticas:

- ✅ **Estructura del proyecto** - Verifica directorios backend/frontend
- ✅ **Dependencias** - Comprueba que node_modules existan
- ✅ **Archivo .env** - Valida configuración de variables
- ✅ **Puertos** - Muestra URLs disponibles
- ✅ **Logs coloreados** - Distingue backend (azul) y frontend (cyan)

## 📞 WhatsApp

Número configurado: **50240439206**
- Integración para confirmación de pedidos
- Mensajes formateados automáticamente

## 👥 Usuarios por Defecto

- **Admin:** admin@salonsf.com / password123
- **Cliente:** Registro libre

## 📈 Reportes

- Dashboard con métricas en tiempo real
- Gráficas interactivas con Recharts
- Reportes de ventas por período
- Estadísticas de clientes
- Análisis de logs del sistema