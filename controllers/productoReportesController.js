// Controlador para reportes y estadísticas de productos
import db from '../database/ConexionBDD.js';

class ProductoReportesController {
  
  // Obtener estadísticas generales de productos
  static async obtenerEstadisticasGenerales(req, res) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT p.producto_id) as total_productos,
          COUNT(DISTINCT CASE WHEN p.activo = 1 THEN p.producto_id END) as productos_activos,
          COUNT(DISTINCT CASE WHEN i.stock_actual <= i.stock_minimo THEN p.producto_id END) as productos_stock_bajo,
          COUNT(DISTINCT p.categoria_id) as total_categorias,
          SUM(i.stock_actual * p.precio) as valor_total_inventario,
          AVG(p.precio) as precio_promedio,
          SUM(i.stock_actual) as stock_total
        FROM productos p
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        WHERE p.activo = 1
      `;
      
      db.query(query, (err, rows) => {
        if (err) {
          console.error('Error obteniendo estadísticas:', err);
          res.status(500).json({ success: false, error: err.message });
        } else {
          const stats = rows[0];
          res.json({
            success: true,
            data: {
              total_productos: stats.total_productos || 0,
              productos_activos: stats.productos_activos || 0,
              productos_stock_bajo: stats.productos_stock_bajo || 0,
              total_categorias: stats.total_categorias || 0,
              valor_total_inventario: parseFloat(stats.valor_total_inventario || 0),
              precio_promedio: parseFloat(stats.precio_promedio || 0),
              stock_total: stats.stock_total || 0
            }
          });
        }
      });
    } catch (error) {
      console.error('Error en obtenerEstadisticasGenerales:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Obtener productos más vendidos (simulado con datos de inventario)
  static async obtenerProductosMasVendidos(req, res) {
    try {
      const query = `
        SELECT 
          p.producto_id,
          p.nombre,
          p.marca,
          p.precio,
          c.nombre as categoria_nombre,
          i.stock_actual,
          i.stock_minimo,
          (i.stock_minimo * 2 - i.stock_actual) as ventas_simuladas
        FROM productos p
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
        WHERE p.activo = 1 AND i.stock_actual > 0
        ORDER BY ventas_simuladas DESC
        LIMIT 10
      `;
      
      db.query(query, (err, rows) => {
        if (err) {
          console.error('Error obteniendo productos más vendidos:', err);
          res.status(500).json({ success: false, error: err.message });
        } else {
          const productos = rows.map(row => ({
            producto_id: row.producto_id,
            nombre: row.nombre,
            marca: row.marca,
            precio: parseFloat(row.precio),
            categoria_nombre: row.categoria_nombre,
            stock_actual: row.stock_actual,
            stock_minimo: row.stock_minimo,
            ventas_simuladas: row.ventas_simuladas || 0
          }));
          res.json({ success: true, data: productos });
        }
      });
    } catch (error) {
      console.error('Error en obtenerProductosMasVendidos:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Obtener distribución por categorías
  static async obtenerDistribucionCategorias(req, res) {
    try {
      const query = `
        SELECT 
          c.nombre as categoria_nombre,
          COUNT(p.producto_id) as cantidad_productos,
          SUM(i.stock_actual) as stock_total,
          SUM(i.stock_actual * p.precio) as valor_categoria,
          AVG(p.precio) as precio_promedio
        FROM categorias c
        LEFT JOIN productos p ON c.id_categoria = p.categoria_id AND p.activo = 1
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        GROUP BY c.id_categoria, c.nombre
        HAVING cantidad_productos > 0
        ORDER BY cantidad_productos DESC
      `;
      
      db.query(query, (err, rows) => {
        if (err) {
          console.error('Error obteniendo distribución por categorías:', err);
          res.status(500).json({ success: false, error: err.message });
        } else {
          const categorias = rows.map(row => ({
            categoria_nombre: row.categoria_nombre,
            cantidad_productos: row.cantidad_productos,
            stock_total: row.stock_total || 0,
            valor_categoria: parseFloat(row.valor_categoria || 0),
            precio_promedio: parseFloat(row.precio_promedio || 0)
          }));
          res.json({ success: true, data: categorias });
        }
      });
    } catch (error) {
      console.error('Error en obtenerDistribucionCategorias:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Obtener productos con stock bajo
  static async obtenerProductosStockBajo(req, res) {
    try {
      const query = `
        SELECT 
          p.producto_id,
          p.nombre,
          p.marca,
          p.precio,
          c.nombre as categoria_nombre,
          i.stock_actual,
          i.stock_minimo,
          (i.stock_minimo - i.stock_actual) as diferencia_stock
        FROM productos p
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
        WHERE p.activo = 1 AND i.stock_actual <= i.stock_minimo
        ORDER BY diferencia_stock DESC
      `;
      
      db.query(query, (err, rows) => {
        if (err) {
          console.error('Error obteniendo productos con stock bajo:', err);
          res.status(500).json({ success: false, error: err.message });
        } else {
          const productos = rows.map(row => ({
            producto_id: row.producto_id,
            nombre: row.nombre,
            marca: row.marca,
            precio: parseFloat(row.precio),
            categoria_nombre: row.categoria_nombre,
            stock_actual: row.stock_actual,
            stock_minimo: row.stock_minimo,
            diferencia_stock: row.diferencia_stock
          }));
          res.json({ success: true, data: productos });
        }
      });
    } catch (error) {
      console.error('Error en obtenerProductosStockBajo:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Obtener análisis de precios
  static async obtenerAnalisisPrecios(req, res) {
    try {
      const query = `
        SELECT 
          MIN(p.precio) as precio_minimo,
          MAX(p.precio) as precio_maximo,
          AVG(p.precio) as precio_promedio,
          COUNT(CASE WHEN p.precio < 100 THEN 1 END) as productos_economicos,
          COUNT(CASE WHEN p.precio BETWEEN 100 AND 300 THEN 1 END) as productos_medios,
          COUNT(CASE WHEN p.precio > 300 THEN 1 END) as productos_premium
        FROM productos p
        WHERE p.activo = 1
      `;
      
      db.query(query, (err, rows) => {
        if (err) {
          console.error('Error obteniendo análisis de precios:', err);
          res.status(500).json({ success: false, error: err.message });
        } else {
          const analisis = rows[0];
          res.json({
            success: true,
            data: {
              precio_minimo: parseFloat(analisis.precio_minimo || 0),
              precio_maximo: parseFloat(analisis.precio_maximo || 0),
              precio_promedio: parseFloat(analisis.precio_promedio || 0),
              productos_economicos: analisis.productos_economicos || 0,
              productos_medios: analisis.productos_medios || 0,
              productos_premium: analisis.productos_premium || 0
            }
          });
        }
      });
    } catch (error) {
      console.error('Error en obtenerAnalisisPrecios:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default ProductoReportesController;
