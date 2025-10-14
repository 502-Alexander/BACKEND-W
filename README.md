# 🎨 Backend - Salón de Belleza (Versión Simplificada)

## 📋 Descripción
Backend simplificado para el salón de belleza que funciona **SIN base de datos**. Utiliza datos mock para demostrar toda la funcionalidad del proyecto.

## 🚀 Características
- ✅ **Sin MongoDB** - Funciona completamente con datos simulados
- ✅ **API REST** - Endpoints para productos, categorías, citas y administración
- ✅ **Panel de Administrador** - Sistema completo de administración
- ✅ **Datos Mock** - Productos, categorías y citas predefinidas
- ✅ **CORS habilitado** - Compatible con frontend React

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Modo desarrollo (con auto-reload)
npm run dev
```

## 📡 Endpoints Disponibles

### 🏠 Generales
- `GET /` - Página principal
- `GET /health` - Estado del servidor

### 🛍️ Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/destacados` - Productos destacados

### 📂 Categorías
- `GET /api/categorias` - Listar categorías

### 📅 Citas
- `GET /api/citas` - Listar citas
- `POST /api/citas` - Crear nueva cita

### 👤 Usuarios
- `POST /api/login` - Login de usuario
- `POST /api/registro` - Registro de usuario

### 👨‍💼 Administrador
- `POST /api/admin/auth/login` - Login de administrador
- `GET /api/admin/auth/profile` - Perfil de administrador
- `GET /api/admin/products` - Productos para admin
- `GET /api/admin/dashboard/stats` - Estadísticas del dashboard

## 🔑 Credenciales de Prueba

### Administrador
- **Email:** admin@salon.com
- **Contraseña:** admin123

### Usuario
- **Email:** cualquier email
- **Contraseña:** cualquier contraseña

## 📊 Datos Mock Incluidos

### Productos (5 productos)
- Crema Hidratante Facial
- Base de Maquillaje
- Shampoo Reparador
- Crema Corporal
- Kit de Brochas

### Categorías (5 categorías)
- Cuidado Facial
- Maquillaje
- Cuidado Capilar
- Cuidado Corporal
- Accesorios

### Citas (2 citas de ejemplo)
- María González
- Ana López

## 🌐 Configuración

El servidor se ejecuta en:
- **Puerto:** 5000
- **URL:** http://localhost:5000
- **Frontend:** http://localhost:3000

## 📝 Notas Importantes

- ⚠️ **No hay persistencia de datos** - Los datos se reinician al reiniciar el servidor
- ⚠️ **Solo para demostración** - No apto para producción
- ✅ **Funcionalidad completa** - Todas las características del panel admin funcionan
- ✅ **Fácil de probar** - No requiere configuración de base de datos

## 🔧 Desarrollo

Para agregar nuevos datos mock, edita el archivo `server.js` en las secciones de datos mock:

```javascript
// Datos mock para productos
const productos = [
  // Agregar nuevos productos aquí
];
```

## 📞 Soporte

Este backend simplificado está diseñado para demostrar la funcionalidad completa del salón de belleza sin la complejidad de una base de datos real.