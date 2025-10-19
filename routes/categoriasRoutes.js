// Rutas para categorías de productos - Conectadas a base de datos MySQL
import express from 'express';
const router = express.Router();
import ProductoController from '../controllers/productoController.js';

// GET /api/categorias - Obtener todas las categorías
router.get('/', ProductoController.obtenerCategorias);

export default router;
