import express from 'express';
const router = express.Router();
import CarritoController from '../controllers/carritoController.js';

// ===== RUTAS DEL CARRITO =====

// Middleware simple para validar :cliente_id numérico
function validarClienteId(req, res, next) {
  const { cliente_id } = req.params;
  const idNum = Number(cliente_id);
  if (!Number.isFinite(idNum)) {
    return res.status(400).json({ success: false, mensaje: 'cliente_id inválido' });
  }
  req.params.cliente_id = idNum;
  next();
}

// GET /api/carrito/:cliente_id - Obtener carrito de un usuario
router.get('/:cliente_id', validarClienteId, (req, res, next) => {
  // Reutilizamos el controlador usando la misma firma interna (usuario_id)
  req.params.usuario_id = req.params.cliente_id;
  return CarritoController.obtenerCarrito(req, res, next);
});

// POST /api/carrito/:cliente_id/agregar - Agregar producto al carrito
router.post('/:cliente_id/agregar', validarClienteId, (req, res, next) => {
  req.params.usuario_id = req.params.cliente_id;
  return CarritoController.agregarAlCarrito(req, res, next);
});

// PUT /api/carrito/:cliente_id/:producto_id - Actualizar cantidad de un producto
router.put('/:cliente_id/:producto_id', validarClienteId, (req, res, next) => {
  req.params.usuario_id = req.params.cliente_id;
  return CarritoController.actualizarCantidad(req, res, next);
});

// DELETE /api/carrito/:cliente_id/:producto_id - Eliminar producto del carrito
router.delete('/:cliente_id/:producto_id', validarClienteId, (req, res, next) => {
  req.params.usuario_id = req.params.cliente_id;
  return CarritoController.eliminarDelCarrito(req, res, next);
});

// DELETE /api/carrito/:cliente_id - Vaciar carrito completo
router.delete('/:cliente_id', validarClienteId, (req, res, next) => {
  req.params.usuario_id = req.params.cliente_id;
  return CarritoController.vaciarCarrito(req, res, next);
});

// GET /api/carrito/:cliente_id/resumen - Obtener resumen del carrito para checkout
router.get('/:cliente_id/resumen', validarClienteId, (req, res, next) => {
  req.params.usuario_id = req.params.cliente_id;
  return CarritoController.obtenerResumenCarrito(req, res, next);
});

// POST /api/carrito/:cliente_id/checkout - Procesar checkout y crear venta
router.post('/:cliente_id/checkout', validarClienteId, (req, res, next) => {
  req.params.usuario_id = req.params.cliente_id;
  return CarritoController.procesarCheckout(req, res, next);
});

export default router;