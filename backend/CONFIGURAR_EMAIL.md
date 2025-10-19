# 📧 CONFIGURACIÓN DEL EMAIL - SALÓN SANDRA FAJARDO

## 🔧 Pasos para configurar Gmail

### 1. **Activar Verificación en 2 Pasos**
- Ve a: https://myaccount.google.com/
- Clic en **"Seguridad"**
- Busca **"Verificación en 2 pasos"**
- **ACTÍVALA** si no está activada

### 2. **Generar Contraseña de Aplicación**
- En la misma página de **"Seguridad"**
- Busca **"Contraseñas de aplicaciones"**
- Clic en **"Contraseñas de aplicaciones"**
- Selecciona **"Correo"**
- Selecciona **"Otro (nombre personalizado)"**
- Escribe: **"Salón Sandra Fajardo - Backend"**
- Clic en **"Generar"**
- **COPIA** la contraseña de 16 caracteres que aparece

### 3. **Actualizar archivo .env**
Edita el archivo `backend/.env` y cambia estas líneas:

```env
# Cambia esto:
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password-de-aplicacion

# Por esto (con tus datos reales):
EMAIL_USER=tu-email-real@gmail.com
EMAIL_PASS=abcd-efgh-ijkl-mnop
```

### 4. **Ejemplo de configuración correcta:**
```env
# Configuración para la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=hlbs30032024
DB_NAME=salon-belleza

# Configuración para la conexión con el servidor
PORT=3001
FRONTEND_URL=http://localhost:5173

# Configuración de email para verificación
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=salonsandrafajardo@gmail.com
EMAIL_PASS=abcd-efgh-ijkl-mnop
```

## ✅ Verificar configuración

Después de configurar, ejecuta:
```bash
node scripts/probar_email.js
```

## 🚨 Importante
- **NO uses tu contraseña normal** de Gmail
- **USA la contraseña de aplicación** de 16 caracteres
- **Mantén segura** esta contraseña de aplicación
