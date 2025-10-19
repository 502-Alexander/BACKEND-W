// Rutas para productos - Conectadas a base de datos MySQL del Salón Sandra Fajardo
import express from 'express';
const router = express.Router();
import ProductoController from '../controllers/productoController.js';
import multer from 'multer';
import path from 'path';

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)'));
    }
  }
});

// ===== RUTAS PÚBLICAS =====

// GET /api/productos - Obtener todos los productos
router.get('/', ProductoController.obtenerTodos);

// GET /api/productos/destacados - Obtener productos destacados
router.get('/destacados', ProductoController.obtenerDestacados);

// GET /api/productos/categorias - Obtener todas las categorías
router.get('/categorias', ProductoController.obtenerCategorias);

// GET /api/productos/buscar?q=termino - Buscar productos
router.get('/buscar', ProductoController.buscar);

// GET /api/productos/categoria/:categoriaId - Obtener productos por categoría
router.get('/categoria/:categoriaId', ProductoController.obtenerPorCategoria);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', ProductoController.obtenerPorId);

// ===== RUTAS DE ADMINISTRACIÓN =====

// POST /api/productos - Crear un nuevo producto
router.post('/', ProductoController.crear);

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', ProductoController.actualizar);

// DELETE /api/productos/:id - Eliminar un producto (borrado lógico)
router.delete('/:id', ProductoController.eliminar);

// POST /api/productos/:id/imagen - Subir imagen de producto
router.post('/:id/imagen', upload.single('imagen'), ProductoController.subirImagen);

export default router;
