// Controlador para gestión de inventario
import { db } from '../config/database.js';

class InventarioController {
  
  // Obtener inventario completo con información de productos
  static async obtenerInventarioCompleto(req, res) {
    try {
      const query = `
        SELECT 
          i.inventario_id,
          i.producto_id,
          p.nombre as producto_nombre,
          p.marca,
          p.precio as costo_producto,
          c.nombre as categoria_nombre,
          i.stock_actual,
          i.stock_minimo,
          i.fecha_actualizacion,
          CASE 
            WHEN i.stock_actual <= i.stock_minimo THEN 'bajo'
            WHEN i.stock_actual <= (i.stock_minimo * 1.5) THEN 'medio'
            ELSE 'normal'
          END as estado_stock
        FROM inventario i
        INNER JOIN productos p ON i.producto_id = p.producto_id
        LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
        WHERE p.activo = 1
        ORDER BY p.nombre ASC
      `;
      
      const [rows] = await db.execute(query);
      
      const inventario = rows.map(row => ({
        inventario_id: row.inventario_id,
        producto_id: row.producto_id,
        producto_nombre: row.producto_nombre,
        marca: row.marca,
        categoria_nombre: row.categoria_nombre,
        costo_producto: parseFloat(row.costo_producto),
        stock_actual: row.stock_actual,
        stock_minimo: row.stock_minimo,
        fecha_actualizacion: row.fecha_actualizacion,
        estado_stock: row.estado_stock
      }));
      
      res.json({ success: true, data: inventario });
    } catch (error) {
      console.error('Error en obtenerInventarioCompleto:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Obtener movimientos recientes de un producto
  static async obtenerMovimientosProducto(req, res) {
    try {
      const { productoId } = req.params;
      const query = `
        SELECT 
          m.movimiento_id,
          m.tipo_movimiento,
          m.cantidad,
          m.motivo,
          m.fecha_movimiento,
          u.nombre as usuario_nombre
        FROM movimientos_inventario m
        LEFT JOIN usuarios u ON m.usuario_id = u.id
        WHERE m.producto_id = ?
        ORDER BY m.fecha_movimiento DESC
        LIMIT 10
      `;
      
      const [rows] = await db.execute(query, [productoId]);
      
      const movimientos = rows.map(row => ({
        movimiento_id: row.movimiento_id,
        tipo_movimiento: row.tipo_movimiento,
        cantidad: row.cantidad,
        motivo: row.motivo,
        fecha_movimiento: row.fecha_movimiento,
        usuario_nombre: row.usuario_nombre || 'Sistema'
      }));
      
      res.json({ success: true, data: movimientos });
    } catch (error) {
      console.error('Error en obtenerMovimientosProducto:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Registrar movimiento de inventario
  static async registrarMovimiento(req, res) {
    let conn;
    try {
      const { producto_id, tipo_movimiento, cantidad, motivo, usuario_id } = req.body;
      
      // Validar datos
      if (!producto_id || !tipo_movimiento || !cantidad) {
        return res.status(400).json({ 
          success: false, 
          error: 'Faltan datos requeridos' 
        });
      }

      // Obtener conexión del pool
      conn = await db.getConnection();
      await conn.beginTransaction();

      // Verificar que el producto existe
      const verificarProducto = `
        SELECT producto_id FROM productos WHERE producto_id = ? AND activo = 1
      `;
      
      const [productoRows] = await conn.execute(verificarProducto, [producto_id]);
      
      if (productoRows.length === 0) {
        await conn.rollback();
        conn.release();
        return res.status(404).json({ 
          success: false, 
          error: 'Producto no encontrado' 
        });
      }

      // Registrar el movimiento
      const insertMovimiento = `
        INSERT INTO movimientos_inventario 
        (producto_id, tipo_movimiento, cantidad, motivo, usuario_id) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const [movimientoResult] = await conn.execute(insertMovimiento, [
        producto_id, tipo_movimiento, cantidad, motivo, usuario_id
      ]);

      // Actualizar el stock en inventario
      const signo = tipo_movimiento === 'entrada' ? '+' : '-';
      const actualizarStock = `
        UPDATE inventario 
        SET stock_actual = stock_actual ${signo} ?, 
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE producto_id = ?
      `;
      
      await conn.execute(actualizarStock, [cantidad, producto_id]);

      // Confirmar transacción
      await conn.commit();
      conn.release();
      
      res.json({ 
        success: true, 
        message: 'Movimiento registrado exitosamente',
        movimiento_id: movimientoResult.insertId
      });

    } catch (error) {
      console.error('Error en registrarMovimiento:', error);
      if (conn) {
        await conn.rollback();
        conn.release();
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Actualizar stock mínimo
  static async actualizarStockMinimo(req, res) {
    try {
      const { inventario_id, stock_minimo } = req.body;
      
      const query = `
        UPDATE inventario 
        SET stock_minimo = ?, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE inventario_id = ?
      `;
      
      const [result] = await db.execute(query, [stock_minimo, inventario_id]);
      
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, error: 'Registro no encontrado' });
      } else {
        res.json({ success: true, message: 'Stock mínimo actualizado exitosamente' });
      }
    } catch (error) {
      console.error('Error en actualizarStockMinimo:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Obtener estadísticas de inventario
  static async obtenerEstadisticasInventario(req, res) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_productos,
          SUM(stock_actual) as stock_total,
          SUM(stock_actual * p.precio) as valor_total_inventario,
          COUNT(CASE WHEN stock_actual <= stock_minimo THEN 1 END) as productos_stock_bajo,
          COUNT(CASE WHEN stock_actual <= (stock_minimo * 1.5) THEN 1 END) as productos_stock_medio,
          AVG(stock_actual) as stock_promedio
        FROM inventario i
        INNER JOIN productos p ON i.producto_id = p.producto_id
        WHERE p.activo = 1
      `;
      
      const [rows] = await db.execute(query);
      const stats = rows[0];
      
      res.json({
        success: true,
        data: {
          total_productos: stats.total_productos || 0,
          stock_total: stats.stock_total || 0,
          valor_total_inventario: parseFloat(stats.valor_total_inventario || 0),
          productos_stock_bajo: stats.productos_stock_bajo || 0,
          productos_stock_medio: stats.productos_stock_medio || 0,
          stock_promedio: parseFloat(stats.stock_promedio || 0)
        }
      });
    } catch (error) {
      console.error('Error en obtenerEstadisticasInventario:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Eliminar producto del inventario (borrado lógico)
  static async eliminarProductoInventario(req, res) {
    try {
      const { producto_id } = req.params;
      
      // Desactivar el producto en lugar de eliminarlo físicamente
      const query = `
        UPDATE productos 
        SET activo = 0, fecha_modificacion = CURRENT_TIMESTAMP
        WHERE producto_id = ?
      `;
      
      const [result] = await db.execute(query, [producto_id]);
      
      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, error: 'Producto no encontrado' });
      } else {
        res.json({ success: true, message: 'Producto eliminado exitosamente' });
      }
    } catch (error) {
      console.error('Error en eliminarProductoInventario:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default InventarioController;
