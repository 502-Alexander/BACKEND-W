// Rutas para el carrito de compras
const express = require('express');
const router = express.Router();

// Array temporal para almacenar carritos (en producción usar base de datos)
let carritos = {};

// Ruta para obtener el carrito de un usuario
router.get('/:usuarioId', (req, res) => {
  const { usuarioId } = req.params;
  
  if (!carritos[usuarioId]) {
    carritos[usuarioId] = {
      items: [],
      total: 0,
      cantidad: 0
    };
  }

  res.json({
    success: true,
    data: carritos[usuarioId]
  });
});

// Ruta para agregar producto al carrito
router.post('/:usuarioId/agregar', (req, res) => {
  const { usuarioId } = req.params;
  const { productoId, cantidad = 1 } = req.body;

  if (!carritos[usuarioId]) {
    carritos[usuarioId] = {
      items: [],
      total: 0,
      cantidad: 0
    };
  }

  // Buscar si el producto ya está en el carrito
  const itemExistente = carritos[usuarioId].items.find(item => item.productoId === productoId);
  
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carritos[usuarioId].items.push({
      productoId,
      cantidad,
      precio: 25.99 // Precio temporal
    });
  }

  // Recalcular totales
  carritos[usuarioId].cantidad = carritos[usuarioId].items.reduce((total, item) => total + item.cantidad, 0);
  carritos[usuarioId].total = carritos[usuarioId].items.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  res.json({
    success: true,
    data: carritos[usuarioId]
  });
});

// Ruta para eliminar producto del carrito
router.delete('/:usuarioId/eliminar/:productoId', (req, res) => {
  const { usuarioId, productoId } = req.params;

  if (carritos[usuarioId]) {
    carritos[usuarioId].items = carritos[usuarioId].items.filter(item => item.productoId !== parseInt(productoId));
    
    // Recalcular totales
    carritos[usuarioId].cantidad = carritos[usuarioId].items.reduce((total, item) => total + item.cantidad, 0);
    carritos[usuarioId].total = carritos[usuarioId].items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  res.json({
    success: true,
    data: carritos[usuarioId] || { items: [], total: 0, cantidad: 0 }
  });
});

// Ruta para limpiar el carrito
router.delete('/:usuarioId/limpiar', (req, res) => {
  const { usuarioId } = req.params;
  
  if (carritos[usuarioId]) {
    carritos[usuarioId] = {
      items: [],
      total: 0,
      cantidad: 0
    };
  }

  res.json({
    success: true,
    data: carritos[usuarioId]
  });
});

module.exports = router;
