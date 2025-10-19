# 📸 INSTRUCCIONES PARA SUBIR FOTOS DE PRODUCTOS

## 🎯 **Productos que necesitan fotos:**

### **Due Faccetta Lunga Durata** (ID: 1)
- **Precio:** Q269
- **Fotos necesarias:** 2 fotos
- **Descripción:** Hidratante protector de color para cabello teñido

### **Due Faccetta Massimo** (ID: 2)
- **Precio:** Q269
- **Fotos necesarias:** 2 fotos
- **Descripción:** Reparador para cabello sobreprocesado

### **Due Faccetta Giorno Per Giorno** (ID: 3)
- **Precio:** Q269
- **Fotos necesarias:** 2 fotos
- **Descripción:** Hidratación intensiva diaria

### **Balsami Presto Treatment** (ID: 4)
- **Precio:** Q199
- **Fotos necesarias:** 2 fotos
- **Descripción:** Tratamiento revitalizante

### **Riccioli Leave-In Cream** (ID: 5)
- **Precio:** Q229
- **Fotos necesarias:** 2 fotos
- **Descripción:** Crema definidora para rizos

### **Silk System Shine** (ID: 6)
- **Precio:** Q149
- **Fotos necesarias:** 2 fotos
- **Descripción:** Sérum para brillo

### **Perfect Blonder 1 - Shampoo** (ID: 7)
- **Precio:** Q279
- **Fotos necesarias:** 2 fotos
- **Descripción:** Shampoo para cabellos rubios

### **Perfect Blonder 2 - Máscara** (ID: 8)
- **Precio:** Q279
- **Fotos necesarias:** 2 fotos
- **Descripción:** Máscara para cabellos rubios

### **W-One Shampoo** (ID: 9)
- **Precio:** Q269
- **Fotos necesarias:** 2 fotos
- **Descripción:** Shampoo regenerador

### **W-One Acondicionador 3 en 1** (ID: 10)
- **Precio:** Q269
- **Fotos necesarias:** 2 fotos
- **Descripción:** Acondicionador multifunción

---

## 📋 **Cómo subir las fotos:**

### **Opción 1: Directamente en la base de datos**
```sql
-- Ejemplo para el producto ID 1 (Due Faccetta Lunga Durata)
UPDATE productos 
SET foto1 = 'ruta/a/foto1.jpg', 
    foto2 = 'ruta/a/foto2.jpg' 
WHERE producto_id = 1;
```

### **Opción 2: Usando el panel de administración (cuando esté listo)**
- Subir las fotos desde la interfaz web
- Las fotos se guardarán automáticamente

### **Opción 3: Crear carpeta de imágenes**
1. Crear carpeta: `frontend/public/images/productos/`
2. Subir las fotos con nombres descriptivos:
   - `due-faccetta-lunga-durata-1.jpg`
   - `due-faccetta-lunga-durata-2.jpg`
   - `due-faccetta-massimo-1.jpg`
   - etc.

---

## 🎨 **Especificaciones de las fotos:**

- **Formato:** JPG, PNG
- **Tamaño:** Máximo 2MB por foto
- **Resolución:** Mínimo 800x600px
- **Cantidad:** 2 fotos por producto
- **Calidad:** Buena iluminación, fondo limpio

---

## 📁 **Estructura recomendada:**

```
frontend/public/images/productos/
├── due-faccetta-lunga-durata-1.jpg
├── due-faccetta-lunga-durata-2.jpg
├── due-faccetta-massimo-1.jpg
├── due-faccetta-massimo-2.jpg
├── due-faccetta-giorno-per-giorno-1.jpg
├── due-faccetta-giorno-per-giorno-2.jpg
├── balsami-presto-treatment-1.jpg
├── balsami-presto-treatment-2.jpg
├── riccioli-leave-in-cream-1.jpg
├── riccioli-leave-in-cream-2.jpg
├── silk-system-shine-1.jpg
├── silk-system-shine-2.jpg
├── perfect-blonder-shampoo-1.jpg
├── perfect-blonder-shampoo-2.jpg
├── perfect-blonder-mascara-1.jpg
├── perfect-blonder-mascara-2.jpg
├── w-one-shampoo-1.jpg
├── w-one-shampoo-2.jpg
├── w-one-acondicionador-1.jpg
└── w-one-acondicionador-2.jpg
```

---

## ✅ **Después de subir las fotos:**

1. **Actualizar la base de datos** con las rutas de las fotos
2. **Probar en el frontend** que las imágenes se muestren correctamente
3. **Verificar** que los productos aparezcan en la página de productos

---

## 🔧 **Script SQL para actualizar fotos:**

```sql
-- Ejemplo para actualizar todas las fotos
UPDATE productos SET foto1 = '/images/productos/due-faccetta-lunga-durata-1.jpg', foto2 = '/images/productos/due-faccetta-lunga-durata-2.jpg' WHERE producto_id = 1;
UPDATE productos SET foto1 = '/images/productos/due-faccetta-massimo-1.jpg', foto2 = '/images/productos/due-faccetta-massimo-2.jpg' WHERE producto_id = 2;
UPDATE productos SET foto1 = '/images/productos/due-faccetta-giorno-per-giorno-1.jpg', foto2 = '/images/productos/due-faccetta-giorno-per-giorno-2.jpg' WHERE producto_id = 3;
UPDATE productos SET foto1 = '/images/productos/balsami-presto-treatment-1.jpg', foto2 = '/images/productos/balsami-presto-treatment-2.jpg' WHERE producto_id = 4;
UPDATE productos SET foto1 = '/images/productos/riccioli-leave-in-cream-1.jpg', foto2 = '/images/productos/riccioli-leave-in-cream-2.jpg' WHERE producto_id = 5;
UPDATE productos SET foto1 = '/images/productos/silk-system-shine-1.jpg', foto2 = '/images/productos/silk-system-shine-2.jpg' WHERE producto_id = 6;
UPDATE productos SET foto1 = '/images/productos/perfect-blonder-shampoo-1.jpg', foto2 = '/images/productos/perfect-blonder-shampoo-2.jpg' WHERE producto_id = 7;
UPDATE productos SET foto1 = '/images/productos/perfect-blonder-mascara-1.jpg', foto2 = '/images/productos/perfect-blonder-mascara-2.jpg' WHERE producto_id = 8;
UPDATE productos SET foto1 = '/images/productos/w-one-shampoo-1.jpg', foto2 = '/images/productos/w-one-shampoo-2.jpg' WHERE producto_id = 9;
UPDATE productos SET foto1 = '/images/productos/w-one-acondicionador-1.jpg', foto2 = '/images/productos/w-one-acondicionador-2.jpg' WHERE producto_id = 10;
```
