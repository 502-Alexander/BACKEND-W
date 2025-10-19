# 📧 Configuración de Correos de Confirmación de Inicio de Sesión

## 🎯 **DESCRIPCIÓN**

Este sistema envía automáticamente un correo de confirmación cada vez que un usuario inicia sesión exitosamente en el sistema del Salón Sandra Fajardo. Esto mejora la seguridad al notificar al usuario sobre accesos a su cuenta.

## 🔧 **CONFIGURACIÓN REQUERIDA**

### **1. Variables de Entorno (.env)**

```bash
# Configuración de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# URLs del Frontend
FRONTEND_URL=http://localhost:5173

# Configuración JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h
```

### **2. Configuración de Gmail (Recomendado)**

#### **Paso 1: Habilitar Autenticación de 2 Factores**
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos
3. Activa la verificación en 2 pasos

#### **Paso 2: Generar Contraseña de Aplicación**
1. Ve a Seguridad → Contraseñas de aplicaciones
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Escribe "Salon Sandra Fajardo"
4. Copia la contraseña generada (16 caracteres)
5. Usa esta contraseña en `EMAIL_PASS`

### **3. Configuración Alternativa con Outlook**

```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=tu_email@outlook.com
EMAIL_PASS=tu_contraseña
```

## 🚀 **FUNCIONALIDADES IMPLEMENTADAS**

### **✅ Correo de Confirmación de Inicio de Sesión**

**Cuándo se envía:**
- Cada vez que un usuario inicia sesión exitosamente
- Para usuarios normales y administradores
- Se envía de forma asíncrona (no bloquea el login)

**Información incluida:**
- ✅ Nombre del usuario
- ✅ Fecha y hora del acceso (zona horaria de Guatemala)
- ✅ Dirección IP del dispositivo
- ✅ Información del navegador/dispositivo
- ✅ Enlace directo al dashboard
- ✅ Consejos de seguridad

**Diseño del correo:**
- 🎨 Template HTML profesional
- 📱 Diseño responsive
- 🏢 Branding del Salón Sandra Fajardo
- 🔒 Información de seguridad

### **📧 Plantilla del Correo**

```html
🔐 Confirmación de inicio de sesión - Salón Sandra Fajardo

✅ Inicio de sesión exitoso
Hola [Nombre], se ha iniciado sesión en tu cuenta.

📋 Detalles del acceso:
• Fecha y hora: [Fecha completa]
• Dirección IP: [IP del dispositivo]
• Dispositivo: [Información del navegador]

¿No fuiste tú?
Si no iniciaste sesión, te recomendamos:
• Cambiar tu contraseña inmediatamente
• Revisar la actividad reciente
• Contactarnos si tienes dudas

Consejos de seguridad:
• Nunca compartas tu contraseña
• Cierra sesión en dispositivos públicos
• Usa contraseñas seguras y únicas
```

## 🧪 **PRUEBAS**

### **1. Probar Configuración de Email**

```bash
# Ejecutar script de prueba
cd backend
node scripts/probar_email_login.js
```

### **2. Probar Login con Correo**

1. **Iniciar sesión** en el frontend
2. **Verificar** que llegue el correo
3. **Revisar** la información del correo
4. **Confirmar** que los datos son correctos

### **3. Logs del Sistema**

```bash
# Ver logs de correos enviados
tail -f logs/auth.log

# Ver logs de errores
tail -f logs/errors.log
```

## 🔒 **SEGURIDAD**

### **Protecciones Implementadas:**

1. **Envío Asíncrono**
   - El correo no bloquea el proceso de login
   - Si falla el envío, el usuario puede iniciar sesión igual

2. **Información de Seguridad**
   - Incluye IP y dispositivo para detectar accesos sospechosos
   - Consejos de seguridad en cada correo
   - Enlaces para cambiar contraseña

3. **Validación de Datos**
   - Verificación de email válido
   - Sanitización de datos del usuario
   - Manejo de errores robusto

4. **Logs de Seguridad**
   - Registro de todos los intentos de login
   - Logs de correos enviados
   - Registro de errores de envío

## 📊 **MONITOREO**

### **Métricas Disponibles:**

- ✅ Correos enviados exitosamente
- ❌ Correos fallidos
- 📧 Direcciones de email válidas
- 🌐 IPs de acceso
- ⏰ Horarios de login

### **Comandos de Monitoreo:**

```bash
# Ver estadísticas de login
grep "Correo de inicio de sesión enviado" logs/auth.log | wc -l

# Ver errores de correo
grep "Error enviando correo" logs/errors.log

# Ver IPs únicas
grep "IP:" logs/auth.log | cut -d' ' -f2 | sort | uniq
```

## 🛠️ **MANTENIMIENTO**

### **Tareas Regulares:**

1. **Revisar Logs** (Diario)
   - Verificar correos enviados
   - Identificar errores de envío
   - Monitorear IPs sospechosas

2. **Actualizar Configuración** (Mensual)
   - Verificar credenciales de email
   - Actualizar contraseñas de aplicación
   - Revisar límites de envío

3. **Backup de Configuración** (Semanal)
   - Respaldar archivo .env
   - Guardar configuración de email
   - Documentar cambios

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Problemas Comunes:**

#### **1. Correo no llega**
```bash
# Verificar configuración
node scripts/probar_email_login.js

# Revisar logs
tail -f logs/errors.log
```

#### **2. Error de autenticación**
- Verificar contraseña de aplicación
- Confirmar que 2FA está activado
- Revisar configuración SMTP

#### **3. Correo va a spam**
- Configurar SPF, DKIM, DMARC
- Usar dominio propio para envío
- Evitar palabras spam en el contenido

### **Comandos de Diagnóstico:**

```bash
# Verificar conexión SMTP
telnet smtp.gmail.com 587

# Probar envío manual
node -e "require('./services/emailService').verificarConexion().then(console.log)"

# Ver configuración actual
node -e "console.log(process.env.EMAIL_HOST, process.env.EMAIL_PORT)"
```

## 📈 **MEJORAS FUTURAS**

### **Funcionalidades Planificadas:**

1. **Notificaciones Push**
   - Integración con service workers
   - Notificaciones en tiempo real

2. **Análisis de Seguridad**
   - Detección de accesos sospechosos
   - Alertas automáticas
   - Geolocalización de IPs

3. **Personalización**
   - Configuración por usuario
   - Frecuencia de notificaciones
   - Tipos de alertas

4. **Integración Avanzada**
   - Webhooks para eventos
   - API para terceros
   - Dashboard de seguridad

## 📞 **SOPORTE**

### **Contacto Técnico:**
- 📧 Email: admin@salonsandra.com
- 📱 WhatsApp: +502 1234-5678
- 🕒 Horario: Lunes a Viernes, 8:00 AM - 6:00 PM

### **Documentación Adicional:**
- [Configuración de Email](./CONFIGURAR_EMAIL.md)
- [Sistema de Logs](./README.md)
- [API de Autenticación](./README.md)

---

**Última actualización:** $(date)
**Versión:** 1.0.0
**Desarrollado por:** Equipo de Desarrollo Salón Sandra Fajardo
