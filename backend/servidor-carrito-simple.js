// Servidor simple para probar el carrito
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Datos de prueba del carrito
const carritoPrueba = {
  items: [
    {
      producto_id: 1,
      nombre: 'Shampoo Hidratante',
      marca: 'Pantene',
      precio_unitario: 25.50,
      imagen: '/uploads/producto-1759610743489-757083540.png',
      cantidad: 2,
      subtotal: 51.00,
      stock_actual: 50,
      stock_minimo: 10,
      activo: true
    },
    {
      producto_id: 2,
      nombre: 'Acondicionador Reparador',
      marca: 'Pantene',
      precio_unitario: 28.00,
      imagen: '/uploads/producto-1759610407000-107108434.png',
      cantidad: 1,
      subtotal: 28.00,
      stock_actual: 35,
      stock_minimo: 8,
      activo: true
    }
  ],
  total: 79.00,
  cantidad: 3
};

// Rutas del carrito
app.get('/api/carrito/:usuario_id', (req, res) => {
  console.log('🛒 Obteniendo carrito para usuario:', req.params.usuario_id);
  res.json({
    success: true,
    data: carritoPrueba
  });
});

app.post('/api/carrito/:usuario_id/agregar', (req, res) => {
  console.log('➕ Agregando producto:', req.body);
  res.json({
    success: true,
    mensaje: 'Producto agregado al carrito exitosamente'
  });
});

app.put('/api/carrito/:usuario_id/:producto_id', (req, res) => {
  console.log('🔄 Actualizando cantidad:', req.params, req.body);
  res.json({
    success: true,
    mensaje: 'Cantidad actualizada exitosamente'
  });
});

app.delete('/api/carrito/:usuario_id/:producto_id', (req, res) => {
  console.log('🗑️ Eliminando producto:', req.params);
  res.json({
    success: true,
    mensaje: 'Producto eliminado del carrito exitosamente'
  });
});

app.delete('/api/carrito/:usuario_id', (req, res) => {
  console.log('🧹 Vaciando carrito:', req.params);
  res.json({
    success: true,
    mensaje: 'Carrito vaciado exitosamente'
  });
});

app.get('/api/carrito/:usuario_id/resumen', (req, res) => {
  console.log('📋 Obteniendo resumen:', req.params);
  const subtotal = carritoPrueba.total;
  const envio = subtotal >= 500 ? 0 : 50;
  const impuestos = subtotal * 0.16;
  const total = subtotal + envio + impuestos;
  
  res.json({
    success: true,
    data: {
      items: carritoPrueba.items,
      subtotal: subtotal,
      envio: envio,
      impuestos: impuestos,
      total: total,
      envio_gratis_desde: 500,
      faltante_envio_gratis: subtotal < 500 ? 500 - subtotal : 0
    }
  });
});

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor de prueba del carrito funcionando',
    puerto: PORT,
    estado: 'OK'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba del carrito corriendo en http://localhost:${PORT}`);
  console.log(`📱 API disponible en http://localhost:${PORT}/api`);
  console.log(`🛒 Carrito de prueba con ${carritoPrueba.items.length} productos`);
});
