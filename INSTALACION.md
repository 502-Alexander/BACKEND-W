# 🛍️ Nueva Tienda - Guía de Instalación

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** (viene incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Instalación Paso a Paso

### 1. Clonar o Descargar el Proyecto

```bash
# Si tienes Git instalado
git clone <url-del-repositorio>
cd nueva-tienda

# O simplemente descarga y extrae el archivo ZIP
```

### 2. Instalar Dependencias

Ejecuta este comando en la raíz del proyecto para instalar todas las dependencias:

```bash
npm run install-all
```

Este comando instalará automáticamente las dependencias de:
- ✅ Proyecto principal
- ✅ Backend (Node.js + Express)
- ✅ Frontend (React + Vite)

### 3. Configurar Variables de Entorno (Opcional)

Crea un archivo `.env` en la carpeta `backend/` con:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 🎯 Ejecutar la Aplicación

### Opción 1: Ejecutar Todo Junto (Recomendado)

```bash
npm run dev
```

Esto ejecutará:
- 🌐 **Backend** en http://localhost:3001
- ⚛️ **Frontend** en http://localhost:5173

### Opción 2: Ejecutar por Separado

**Backend:**
```bash
npm run server
# o
cd backend && npm run dev
```

**Frontend:**
```bash
npm run client
# o
cd frontend && npm run dev
```

## 🌐 Acceder a la Aplicación

Una vez que todo esté ejecutándose:

1. **Frontend (Tienda)**: http://localhost:5173
2. **Backend (API)**: http://localhost:3001
3. **API Docs**: http://localhost:3001/api

## 📁 Estructura del Proyecto

```
nueva-tienda/
├── 📁 backend/              # API Node.js + Express
│   ├── 📄 server.js         # Servidor principal
│   ├── 📄 package.json      # Dependencias del backend
│   └── 📄 .gitignore        # Archivos ignorados
├── 📁 frontend/             # Aplicación React + Vite
│   ├── 📁 src/
│   │   ├── 📁 components/   # Componentes reutilizables
│   │   ├── 📁 pages/        # Páginas de la aplicación
│   │   ├── 📁 context/      # Contexto global (carrito)
│   │   ├── 📁 services/     # Servicios API
│   │   └── 📄 App.jsx       # Componente principal
│   ├── 📄 package.json      # Dependencias del frontend
│   └── 📄 vite.config.js    # Configuración de Vite
├── 📄 package.json          # Scripts principales
├── 📄 README.md             # Documentación principal
└── 📄 INSTALACION.md        # Esta guía
```

## 🔧 Scripts Disponibles

### Scripts Principales (raíz del proyecto)

```bash
npm run dev          # Ejecutar frontend y backend
npm run server       # Solo backend
npm run client       # Solo frontend
npm run install-all  # Instalar todas las dependencias
npm run build        # Construir para producción
npm start            # Ejecutar en producción
```

### Scripts del Backend

```bash
cd backend
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm install          # Instalar dependencias
```

### Scripts del Frontend

```bash
cd frontend
npm run dev          # Desarrollo con Vite
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
npm install          # Instalar dependencias
```

## 🐛 Solución de Problemas

### Error: Puerto en uso

Si obtienes un error de puerto en uso:

```bash
# Para el puerto 3001 (backend)
npx kill-port 3001

# Para el puerto 5173 (frontend)
npx kill-port 5173
```

### Error: Dependencias no encontradas

```bash
# Limpiar caché e instalar de nuevo
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run install-all
```

### Error: CORS

Si tienes problemas de CORS, verifica que:
1. El backend esté ejecutándose en el puerto 3001
2. El frontend esté ejecutándose en el puerto 5173
3. Las URLs en los servicios coincidan

## 📱 Características de la Tienda

- ✅ **Catálogo de productos** con filtros y búsqueda
- ✅ **Carrito de compras** funcional
- ✅ **Detalles de productos** individuales
- ✅ **Diseño responsive** para móviles y desktop
- ✅ **API REST** completa
- ✅ **Interfaz moderna** y profesional

## 🎨 Personalización

### Cambiar colores

Edita las variables CSS en `frontend/src/index.css`:

```css
:root {
  --primary-color: #667eea;    /* Color principal */
  --secondary-color: #764ba2;  /* Color secundario */
  --accent-color: #f093fb;     /* Color de acento */
}
```

### Agregar productos

Modifica el array `productos` en `backend/server.js`:

```javascript
const productos = [
  {
    id: 1,
    nombre: "Tu Producto",
    precio: 99.99,
    // ... más propiedades
  }
];
```

## 📞 Soporte

Si tienes problemas con la instalación:

1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de que los puertos 3001 y 5173 estén libres
3. Revisa la consola para mensajes de error
4. Ejecuta `npm run install-all` nuevamente

¡Disfruta tu nueva tienda en línea! 🛍️✨
