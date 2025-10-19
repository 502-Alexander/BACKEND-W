# 🚀 Nueva Tienda - Inicio Rápido

## ⚡ Un Solo Comando

```bash
npm run dev
```

¡Eso es todo! Este comando:
- ✅ Verifica todo automáticamente
- ✅ Inicia backend (puerto 4000) y frontend (puerto 5173)
- ✅ Muestra logs coloreados
- ✅ Maneja errores y dependencias

## 🌐 URLs

Una vez ejecutado:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000
- **API:** http://localhost:4000/api

## 🛠️ Si es la Primera Vez

```bash
# 1. Instalar dependencias
npm run install-all

# 2. Configurar MySQL
# Ejecutar: backend/database/salon_sf_LDD.sql

# 3. Configurar variables
cp backend/env.example backend/.env

# 4. ¡Ejecutar!
npm run dev
```

## 🎯 Comandos Alternativos

```bash
npm run dev:simple   # Sin verificaciones
npm run dev:win      # Script Windows
npm run dev:ps       # Script PowerShell
npm run server       # Solo backend
npm run client       # Solo frontend
```

## 🆘 Solución de Problemas

### Error: Dependencias faltantes
```bash
npm run install-all
```

### Error: Puerto en uso
```bash
# Windows
npx kill-port 4000
npx kill-port 5173

# Linux/Mac
lsof -ti:4000 | xargs kill
lsof -ti:5173 | xargs kill
```

### Limpiar todo y empezar de nuevo
```bash
npm run reset
```

## 📱 Usuarios por Defecto

- **Admin:** admin@nuevatienda.com / password
- **Cliente:** Registro libre

---

**¡Disfruta desarrollando! 🎉**


