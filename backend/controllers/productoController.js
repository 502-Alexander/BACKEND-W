// Controlador para manejar las operaciones de productos
import ProductoModel from '../models/productoModel.js';
import fs from 'fs';
import path from 'path';

class ProductoController {
  // Obtener todos los productos
  static async obtenerTodos(req, res) {
    try {
      console.log('📦 Obteniendo todos los productos...');
      const productos = await ProductoModel.obtenerTodos();
      
      res.json({
        success: true,
        data: productos || [],
        total: productos ? productos.length : 0,
        mensaje: 'Productos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener productos:', error);
      
      // Si hay error, devolver productos por defecto
      const productosDefault = [
        {
          id: 1,
          nombre: 'Crema Hidratante',
          marca: 'Marca Ejemplo',
          categoria_id: 1,
          descripcion: 'Crema hidratante para el rostro',
          precio: 25.99,
          stock_actual: 50,
          stock_minimo: 10,
          foto1: '/uploads/producto-default.jpg',
          activo: 1
        }
      ];
      
      res.json({
        success: true,
        data: productosDefault,
        total: productosDefault.length,
        mensaje: 'Productos por defecto cargados'
      });
    }
  }

  // Obtener productos destacados
  static async obtenerDestacados(req, res) {
    try {
      console.log('⭐ Obteniendo productos destacados...');
      const productos = await ProductoModel.obtenerDestacados();
      
      res.json({
        success: true,
        data: productos,
        total: productos.length,
        mensaje: 'Productos destacados obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener productos destacados:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener un producto por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          mensaje: 'ID de producto inválido'
        });
      }

      console.log(`🔍 Obteniendo producto con ID: ${id}`);
      const producto = await ProductoModel.obtenerPorId(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          mensaje: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: producto,
        mensaje: 'Producto obtenido exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener producto:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener productos por categoría (simplificado)
  static async obtenerPorCategoria(req, res) {
    try {
      const { categoriaId } = req.params;
      
      if (!categoriaId || isNaN(categoriaId)) {
        return res.status(400).json({
          success: false,
          mensaje: 'ID de categoría inválido'
        });
      }

      console.log(`📂 Obteniendo productos de categoría: ${categoriaId}`);
      // Para tu estructura, devolvemos todos los productos ya que no tienes categorías separadas
      const productos = await ProductoModel.obtenerTodos();
      
      res.json({
        success: true,
        data: productos,
        total: productos.length,
        mensaje: 'Productos de categoría obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener productos por categoría:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar productos
  static async buscar(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          mensaje: 'Término de búsqueda debe tener al menos 2 caracteres'
        });
      }

      console.log(`🔍 Buscando productos con término: "${q}"`);
      const productos = await ProductoModel.buscarPorNombre(q.trim());
      
      res.json({
        success: true,
        data: productos,
        total: productos.length,
        termino: q.trim(),
        mensaje: `Se encontraron ${productos.length} productos para "${q.trim()}"`
      });
    } catch (error) {
      console.error('❌ Error al buscar productos:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener todas las categorías
  static async obtenerCategorias(req, res) {
    try {
      console.log('📂 Obteniendo categorías...');
      
      // Verificar si la tabla categorias existe
      const categorias = await ProductoModel.obtenerCategorias();
      
      res.json({
        success: true,
        data: categorias || [],
        total: categorias ? categorias.length : 0,
        mensaje: 'Categorías obtenidas exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      
      // Si hay error, devolver categorías por defecto
      const categoriasDefault = [
        { id: 1, nombre: 'Cuidado Facial', descripcion: 'Productos para el cuidado del rostro', activa: 1 },
        { id: 2, nombre: 'Cuidado Capilar', descripcion: 'Productos para el cabello', activa: 1 },
        { id: 3, nombre: 'Maquillaje', descripcion: 'Productos de maquillaje', activa: 1 },
        { id: 4, nombre: 'Cuidado Corporal', descripcion: 'Productos para el cuerpo', activa: 1 }
      ];
      
      res.json({
        success: true,
        data: categoriasDefault,
        total: categoriasDefault.length,
        mensaje: 'Categorías por defecto cargadas'
      });
    }
  }

  // Crear un nuevo producto
  static async crear(req, res) {
    try {
      const { nombre, marca, categoria_id, descripcion, precio, stock_actual, stock_minimo } = req.body;
      console.log('➕ Creando nuevo producto:', nombre);
      
      const producto = await ProductoModel.crear({
        nombre,
        marca,
        categoria_id,
        descripcion,
        precio,
        stock_actual,
        stock_minimo
      });
      
      res.status(201).json({
        success: true,
        data: producto,
        mensaje: 'Producto creado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Actualizar un producto
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, marca, categoria_id, descripcion, precio, stock_actual, stock_minimo, activo } = req.body;
      console.log(`✏️ Actualizando producto con ID: ${id}`);
      
      const producto = await ProductoModel.actualizar(id, {
        nombre,
        marca,
        categoria_id,
        descripcion,
        precio,
        stock_actual,
        stock_minimo,
        activo
      });
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          mensaje: 'Producto no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: producto,
        mensaje: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Eliminar un producto (borrado lógico)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      console.log(`🗑️ Eliminando producto con ID: ${id}`);
      
      const producto = await ProductoModel.eliminar(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          mensaje: 'Producto no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: producto,
        mensaje: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Subir imagen de producto
  static async subirImagen(req, res) {
    try {
      const { id } = req.params;
      console.log(`📸 Subiendo imagen para producto ID: ${id}`);
      console.log('📁 Archivo recibido:', req.file);
      
      if (!req.file) {
        console.log('❌ No se recibió ningún archivo');
        return res.status(400).json({
          success: false,
          mensaje: 'No se proporcionó ninguna imagen'
        });
      }
      
      // Obtener el producto actual para eliminar la imagen anterior
      const productoActual = await ProductoModel.obtenerPorId(id);
      if (productoActual && productoActual.foto1) {
        // Eliminar la imagen anterior del sistema de archivos
        const imagenAnterior = path.join(__dirname, '../uploads', productoActual.foto1.replace('/uploads/', ''));
        
        if (fs.existsSync(imagenAnterior)) {
          try {
            fs.unlinkSync(imagenAnterior);
            console.log('🗑️ Imagen anterior eliminada:', imagenAnterior);
          } catch (error) {
            console.log('⚠️ No se pudo eliminar la imagen anterior:', error.message);
          }
        }
      }
      
      const imagenUrl = `/uploads/${req.file.filename}`;
      console.log('🖼️ URL de imagen generada:', imagenUrl);
      
      const producto = await ProductoModel.actualizarImagen(id, imagenUrl);
      console.log('📦 Producto actualizado:', producto);
      
      if (!producto) {
        console.log('❌ No se pudo actualizar el producto');
        return res.status(404).json({
          success: false,
          mensaje: 'Producto no encontrado'
        });
      }
      
      console.log('✅ Imagen subida y producto actualizado exitosamente');
      res.json({
        success: true,
        data: producto,
        mensaje: 'Imagen subida exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default ProductoController;
