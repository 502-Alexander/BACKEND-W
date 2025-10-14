# 📦 Módulo de Inventario - Salón de Belleza

Sistema completo de gestión de inventario para el salón de belleza.

## 🎯 Funcionalidades Implementadas

### **Gestión de Stock**
- ✅ **Entrada de mercancía**: Solo compras
- ✅ **Salida de mercancía**: Ventas y mermas
- ✅ **Stock mínimo** con alertas automáticas
- ✅ **Stock máximo** para control de sobreabastecimiento
- ✅ **Ubicaciones** de productos en almacén

### **Control de Calidad**
- ✅ **Fechas de vencimiento** con alertas automáticas
- ✅ **Trazabilidad** completa de productos

### **Reportes y Analytics**
- ✅ **Movimientos de inventario** con historial completo
- ✅ **Rotación de productos** (más/menos vendidos)
- ✅ **Valor del inventario** en tiempo real
- ✅ **Productos con stock bajo**
- ✅ **Productos próximos a vencer**

## 🗄️ Modelos de Base de Datos

### **1. Inventario**
```javascript
{
  producto: ObjectId,        // Referencia al producto
  stockActual: Number,       // Stock disponible
  stockMinimo: Number,       // Stock mínimo (alerta)
  stockMaximo: Number,       // Stock máximo
  ubicacion: String,         // Ubicación en almacén
  costoUnitario: Number,     // Costo por unidad
  valorTotal: Number,        // Valor total del stock
  fechaVencimiento: Date,    // Fecha de vencimiento
  ultimaActualizacion: Date  // Última actualización
}
```

### **2. Movimiento**
```javascript
{
  producto: ObjectId,        // Producto afectado
  tipo: String,              // 'Compra', 'Venta', 'Merma', 'Ajuste'
  cantidad: Number,          // Cantidad movida
  stockAnterior: Number,     // Stock antes del movimiento
  stockNuevo: Number,        // Stock después del movimiento
  motivo: String,            // Razón del movimiento
  referencia: String,        // Número de factura, etc.
  usuario: ObjectId,         // Usuario que realizó el movimiento
  fecha: Date,               // Fecha del movimiento
  notas: String,             // Notas adicionales
  costoUnitario: Number,     // Costo en el momento del movimiento
  valorMovimiento: Number    // Valor total del movimiento
}
```

### **3. Proveedor**
```javascript
{
  nombre: String,            // Nombre del proveedor
  contacto: String,          // Persona de contacto
  telefono: String,          // Teléfono
  email: String,             // Email
  direccion: String,         // Dirección
  productos: [ObjectId],     // Productos que suministra
  activo: Boolean,           // Estado activo/inactivo
  fechaCreacion: Date        // Fecha de registro
}
```

## 🔌 Endpoints de la API

### **Gestión de Stock**
```bash
# Obtener inventario completo
GET /api/inventario

# Obtener inventario de un producto específico
GET /api/inventario/producto/:id

# Actualizar configuración de inventario
PUT /api/inventario/producto/:id
```

### **Movimientos de Inventario**
```bash
# Registrar entrada de mercancía (compra)
POST /api/inventario/entrada

# Registrar salida de mercancía (venta/merma)
POST /api/inventario/salida

# Ajustar inventario manualmente
POST /api/inventario/ajustar

# Historial de movimientos
GET /api/inventario/movimientos
```

### **Reportes**
```bash
# Valor total del inventario
GET /api/inventario/valor-total

# Productos con stock bajo
GET /api/inventario/stock-bajo

# Productos próximos a vencer
GET /api/inventario/vencimiento

# Rotación de productos
GET /api/inventario/rotacion
```

### **Proveedores**
```bash
# Listar proveedores
GET /api/proveedores

# Crear proveedor
POST /api/proveedores
```

## 🚀 Instalación y Configuración

### **1. Poblar productos básicos:**
```bash
npm run seed
```

### **2. Poblar inventario y proveedores:**
```bash
npm run seed-inventario
```

### **3. Iniciar servidor:**
```bash
npm run dev
```

## 📊 Flujos de Trabajo

### **Entrada de Mercancía (Compra)**
1. Recibir productos del proveedor
2. Verificar cantidad y calidad
3. Registrar entrada con `POST /api/inventario/entrada`
4. Stock se actualiza automáticamente
5. Se registra movimiento de tipo "Compra"

### **Salida de Mercancía (Venta/Merma)**
1. Procesar venta o registrar merma
2. Verificar stock disponible
3. Registrar salida con `POST /api/inventario/salida`
4. Stock se reduce automáticamente
5. Se registra movimiento de tipo "Venta" o "Merma"

### **Ajustes de Inventario**
1. Realizar conteo físico
2. Registrar ajuste con `POST /api/inventario/ajustar`
3. Stock se actualiza al valor especificado
4. Se registra movimiento de tipo "Ajuste"

## ⚠️ Sistema de Alertas

### **Alertas Automáticas:**
- **Stock bajo**: Cuando `stockActual <= stockMinimo`
- **Stock agotado**: Cuando `stockActual = 0`
- **Productos próximos a vencer**: 30 días antes de `fechaVencimiento`

### **Notificaciones:**
- **Dashboard** con indicadores visuales
- **Reportes** automáticos
- **Logs** de movimientos para auditoría

## 📈 Reportes Disponibles

### **1. Valor del Inventario**
- Valor total en tiempo real
- Promedio por producto
- Total de productos en inventario

### **2. Stock Bajo**
- Lista de productos que requieren reposición
- Comparación stock actual vs mínimo

### **3. Vencimientos**
- Productos próximos a vencer (30 días)
- Fechas de vencimiento por producto

### **4. Rotación de Productos**
- Productos más vendidos (últimos 30 días)
- Productos menos vendidos
- Análisis de tendencias

### **5. Movimientos**
- Historial completo de entradas/salidas
- Filtros por fecha, tipo, producto
- Trazabilidad completa

## 🔧 Personalización

### **Configuración de Alertas:**
- Modificar `stockMinimo` por producto
- Ajustar días de alerta de vencimiento
- Personalizar ubicaciones de almacén

### **Tipos de Movimientos:**
- Agregar nuevos tipos si es necesario
- Personalizar motivos de movimientos
- Configurar usuarios autorizados

## 📞 Soporte

Para dudas sobre el módulo de inventario:
1. Revisar logs del servidor
2. Verificar endpoints con Postman/Insomnia
3. Consultar la documentación de la API

---

**¡El módulo de inventario está listo para usar! 🎉**

