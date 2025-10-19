// Rutas para subir imágenes de productos
import express from 'express';
const router = express.Router();
import { uploadImages, processUploadedImages } from '../middlewares/uploadMiddleware.js';
import ProductoModel from '../models/productoModel.js';

// POST /api/upload/producto/:id - Subir imágenes para un producto específico
router.post('/producto/:id', uploadImages, processUploadedImages, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        mensaje: 'ID de producto inválido'
      });
    }

    if (!req.processedImages || Object.keys(req.processedImages).length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'No se proporcionaron imágenes válidas'
      });
    }

    console.log('📸 Subiendo imágenes para producto ID:', id);
    console.log('🖼️ Imágenes procesadas:', req.processedImages);

    // Actualizar el producto en la base de datos con las rutas de las imágenes
    const updateData = {};
    if (req.processedImages.foto1) {
      updateData.foto1 = req.processedImages.foto1;
    }
    if (req.processedImages.foto2) {
      updateData.foto2 = req.processedImages.foto2;
    }

    // Aquí necesitarías implementar el método actualizarProducto en ProductoModel
    // Por ahora, retornamos las rutas de las imágenes
    res.json({
      success: true,
      mensaje: 'Imágenes subidas exitosamente',
      data: {
        producto_id: id,
        imagenes: req.processedImages
      }
    });

  } catch (error) {
    console.error('❌ Error subiendo imágenes:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/upload/producto/:id - Obtener imágenes de un producto
router.get('/producto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        mensaje: 'ID de producto inválido'
      });
    }

    console.log('🔍 Obteniendo imágenes para producto ID:', id);
    
    // Obtener información del producto incluyendo las imágenes
    const producto = await ProductoModel.obtenerPorId(id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Imágenes obtenidas exitosamente',
      data: {
        producto_id: id,
        foto1: producto.foto1 || null,
        foto2: producto.foto2 || null
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo imágenes:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/upload/cita - Subir foto para una cita
router.post('/cita', uploadImages, processUploadedImages, async (req, res) => {
  try {
    if (!req.processedImages || Object.keys(req.processedImages).length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'No se proporcionó una foto válida'
      });
    }

    console.log('📸 Subiendo foto para cita');
    console.log('🖼️ Foto procesada:', req.processedImages);

    // Retornar la ruta de la foto para que el frontend la use
    const fotoUrl = req.processedImages.foto1 || req.processedImages.foto2;
    
    res.json({
      success: true,
      mensaje: 'Foto subida exitosamente',
      data: {
        foto_url: fotoUrl,
        ruta_relativa: fotoUrl.replace(`${process.env.BACKEND_URL || 'http://localhost:4000'}/`, '')
      }
    });

  } catch (error) {
    console.error('❌ Error subiendo foto de cita:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
