# INSTRUCCIONES PARA CREAR EL ARCHIVO .env

## 📋 Pasos para crear el archivo .env en backend/

1. **Crea un archivo llamado `.env` en la carpeta `backend/`**

2. **Copia y pega este contenido:**

```
# Configuración del Backend - Nueva Tienda
PORT=4000
NODE_ENV=development

# Configuración de JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# Configuración de base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=salon_sf

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true

# Configuración de rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## ⚠️ IMPORTANTE:
- Cambia `DB_PASSWORD=` por tu contraseña de MySQL si la tienes
- Si no tienes contraseña, déjalo vacío como está
- Asegúrate de que MySQL esté corriendo
- La base de datos debe llamarse `salon_sf`

## 🚀 Después de crear el .env:
1. Ejecuta: `cd backend && node src/server.js`
2. Deberías ver: "✅ Conectado a la Base de Datos MySQL"
3. La tienda en línea debería mostrar productos

