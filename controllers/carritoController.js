// Controlador para gestión del carrito de compras
import { db } from '../config/database.js';

class CarritoController {
  
  // Obtener carrito de un usuario específico
  static async obtenerCarrito(req, res) {
    try {
      const { usuario_id } = req.params;
      // Validar que el usuario_id sea numérico; si no, responder carrito vacío (200)
      if (!usuario_id || isNaN(Number(usuario_id))) {
        return res.json({
          success: true,
          data: {
            carrito_id: null,
            items: [],
            total: 0,
            cantidad: 0
          }
        });
      }
      
      // (ya validado arriba)

      // Buscar carrito activo del usuario
      const carritoQuery = `
        SELECT c.carrito_id, c.fecha_creacion
        FROM carrito c
        WHERE c.cliente_id = ?
        ORDER BY c.fecha_creacion DESC
        LIMIT 1
      `;
      
      const [carritoRows] = await db.execute(carritoQuery, [Number(usuario_id)]);
      
      if (carritoRows.length === 0) {
        return res.json({
          success: true,
          data: {
            carrito_id: null,
            items: [],
            total: 0,
            cantidad: 0
          }
        });
      }

      const carritoId = carritoRows[0].carrito_id;

      // Obtener items del carrito con información del producto
      const itemsQuery = `
        SELECT 
          cd.detalle_id,
          cd.producto_id,
          cd.cantidad,
          cd.precio_unitario,
          cd.subtotal,
          p.nombre as producto_nombre,
          p.marca,
          p.foto1 as imagen,
          p.activo,
          i.stock_actual,
          i.stock_minimo
        FROM carrito_detalles cd
        JOIN productos p ON cd.producto_id = p.producto_id
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        WHERE cd.carrito_id = ?
        ORDER BY cd.detalle_id
      `;

      const [itemsRows] = await db.execute(itemsQuery, [carritoId]);

      // Calcular totales
      const items = itemsRows.map(item => ({
        detalle_id: Number(item.detalle_id),
        producto_id: Number(item.producto_id),
        nombre: item.producto_nombre || '',
        marca: item.marca || '',
        imagen: item.imagen || '/images/producto-default.svg',
        cantidad: Number(item.cantidad) || 0,
        precio_unitario: parseFloat(item.precio_unitario ?? 0) || 0,
        subtotal: parseFloat(item.subtotal ?? (Number(item.cantidad || 0) * parseFloat(item.precio_unitario || 0))) || 0,
        stock_actual: Number(item.stock_actual) || 0,
        stock_minimo: Number(item.stock_minimo) || 0,
        activo: item.activo !== 0
      }));

      const total = items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
      const cantidad = items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);

      res.json({
        success: true,
        data: {
          carrito_id: carritoId,
          items: items,
          total: total,
          cantidad: cantidad,
          fecha_creacion: carritoRows[0].fecha_creacion
        }
      });

    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Agregar producto al carrito
  static async agregarAlCarrito(req, res) {
    try {
      const usuario_id = Number(req.params.usuario_id)
      const producto_id = Number(req.body?.producto_id)
      const cantidad = Number(req.body?.cantidad ?? 1)

      // Validaciones
      if (!Number.isFinite(usuario_id) || !Number.isFinite(producto_id)) {
        return res.status(400).json({
          success: false,
          mensaje: 'Usuario ID y Producto ID son requeridos'
        });
      }

      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        return res.status(400).json({
          success: false,
          mensaje: 'La cantidad debe ser mayor a 0'
        });
      }

      // Verificar que el producto existe y está activo
      const productoQuery = `
        SELECT p.producto_id, p.nombre, p.precio, p.activo,
               i.stock_actual, i.stock_minimo
        FROM productos p
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        WHERE p.producto_id = ?
      `;

      const [productoRows] = await db.execute(productoQuery, [producto_id]);

      if (productoRows.length === 0) {
        return res.status(404).json({
          success: false,
          mensaje: 'Producto no encontrado'
        });
      }

      const producto = productoRows[0];

      if (!producto.activo) {
        return res.status(400).json({
          success: false,
          mensaje: 'El producto no está disponible'
        });
      }

      // Verificar stock disponible
      const stockDisponible = producto.stock_actual || 0;
      if (stockDisponible < cantidad) {
        return res.status(400).json({
          success: false,
          mensaje: `Stock insuficiente. Disponible: ${stockDisponible}`,
          stock_disponible: stockDisponible
        });
      }

      // Buscar o crear carrito del usuario
      let carritoQuery = `
        SELECT carrito_id FROM carrito 
        WHERE cliente_id = ? 
        ORDER BY fecha_creacion DESC 
        LIMIT 1
      `;
      
      const [carritoRows] = await db.execute(carritoQuery, [usuario_id]);
      let carritoId;

      if (carritoRows.length === 0) {
        // Crear nuevo carrito
        const crearCarritoQuery = `
          INSERT INTO carrito (cliente_id) VALUES (?)
        `;
        const [result] = await db.execute(crearCarritoQuery, [usuario_id]);
        carritoId = result.insertId;
      } else {
        carritoId = carritoRows[0].carrito_id;
      }

      // Verificar si el producto ya está en el carrito
      const itemExistenteQuery = `
        SELECT detalle_id, cantidad FROM carrito_detalles 
        WHERE carrito_id = ? AND producto_id = ?
      `;
      
      const [itemExistenteRows] = await db.execute(itemExistenteQuery, [carritoId, producto_id]);

      if (itemExistenteRows.length > 0) {
        // Actualizar cantidad existente
        const nuevaCantidad = itemExistenteRows[0].cantidad + cantidad;
        
        if (nuevaCantidad > stockDisponible) {
          return res.status(400).json({
            success: false,
            mensaje: `Stock insuficiente. Disponible: ${stockDisponible}, solicitado: ${nuevaCantidad}`,
            stock_disponible: stockDisponible
          });
        }

        const actualizarQuery = `
          UPDATE carrito_detalles 
          SET cantidad = ?, subtotal = cantidad * precio_unitario
          WHERE detalle_id = ?
        `;
        
        await db.execute(actualizarQuery, [nuevaCantidad, itemExistenteRows[0].detalle_id]);
      } else {
        // Agregar nuevo item al carrito
        const agregarItemQuery = `
          INSERT INTO carrito_detalles 
          (carrito_id, producto_id, cantidad, precio_unitario) 
          VALUES (?, ?, ?, ?)
        `;
        
        await db.execute(agregarItemQuery, [carritoId, producto_id, cantidad, producto.precio]);
      }

      res.json({
        success: true,
        mensaje: 'Producto agregado al carrito exitosamente',
        data: {
          carrito_id: carritoId,
          producto_id: producto_id,
          cantidad: cantidad,
          precio_unitario: producto.precio
        }
      });

    } catch (error) {
      console.error('Error agregando al carrito:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar cantidad de un item en el carrito
  static async actualizarCantidad(req, res) {
    try {
      const { usuario_id, producto_id } = req.params;
      const { cantidad } = req.body;

      if (!usuario_id || !producto_id || cantidad === undefined) {
        return res.status(400).json({
          success: false,
          mensaje: 'Usuario ID, Producto ID y cantidad son requeridos'
        });
      }

      if (cantidad < 0) {
        return res.status(400).json({
          success: false,
          mensaje: 'La cantidad no puede ser negativa'
        });
      }

      // Verificar stock disponible
      const stockQuery = `
        SELECT i.stock_actual FROM inventario i
        WHERE i.producto_id = ?
      `;
      
      const [stockRows] = await db.execute(stockQuery, [producto_id]);
      const stockDisponible = stockRows.length > 0 ? stockRows[0].stock_actual : 0;

      if (cantidad > stockDisponible) {
        return res.status(400).json({
          success: false,
          mensaje: `Stock insuficiente. Disponible: ${stockDisponible}`,
          stock_disponible: stockDisponible
        });
      }

      // Buscar el item en el carrito del usuario
      const itemQuery = `
        SELECT cd.detalle_id FROM carrito_detalles cd
        JOIN carrito c ON cd.carrito_id = c.carrito_id
        WHERE c.cliente_id = ? AND cd.producto_id = ?
      `;
      
      const [itemRows] = await db.execute(itemQuery, [usuario_id, producto_id]);

      if (itemRows.length === 0) {
        return res.status(404).json({
          success: false,
          mensaje: 'Producto no encontrado en el carrito'
        });
      }

      if (cantidad === 0) {
        // Eliminar item del carrito
        const eliminarQuery = `DELETE FROM carrito_detalles WHERE detalle_id = ?`;
        await db.execute(eliminarQuery, [itemRows[0].detalle_id]);
        
        res.json({
          success: true,
          mensaje: 'Producto eliminado del carrito'
        });
      } else {
        // Actualizar cantidad
        const actualizarQuery = `
          UPDATE carrito_detalles 
          SET cantidad = ?, subtotal = cantidad * precio_unitario
          WHERE detalle_id = ?
        `;
        
        await db.execute(actualizarQuery, [cantidad, itemRows[0].detalle_id]);
        
        res.json({
          success: true,
          mensaje: 'Cantidad actualizada exitosamente',
          data: {
            producto_id: producto_id,
            cantidad: cantidad
          }
        });
      }

    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Eliminar producto del carrito
  static async eliminarDelCarrito(req, res) {
    try {
      const { usuario_id, producto_id } = req.params;

      if (!usuario_id || !producto_id) {
        return res.status(400).json({
          success: false,
          mensaje: 'Usuario ID y Producto ID son requeridos'
        });
      }

      // Buscar y eliminar el item del carrito
      const eliminarQuery = `
        DELETE cd FROM carrito_detalles cd
        JOIN carrito c ON cd.carrito_id = c.carrito_id
        WHERE c.cliente_id = ? AND cd.producto_id = ?
      `;
      
      const [result] = await db.execute(eliminarQuery, [usuario_id, producto_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          mensaje: 'Producto no encontrado en el carrito'
        });
      }

      res.json({
        success: true,
        mensaje: 'Producto eliminado del carrito exitosamente'
      });

    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Vaciar carrito completo
  static async vaciarCarrito(req, res) {
    try {
      const { usuario_id } = req.params;

      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          mensaje: 'Usuario ID es requerido'
        });
      }

      // Eliminar todos los items del carrito del usuario
      const vaciarQuery = `
        DELETE cd FROM carrito_detalles cd
        JOIN carrito c ON cd.carrito_id = c.carrito_id
        WHERE c.cliente_id = ?
      `;
      
      const [result] = await db.execute(vaciarQuery, [usuario_id]);

      res.json({
        success: true,
        mensaje: 'Carrito vaciado exitosamente',
        items_eliminados: result.affectedRows
      });

    } catch (error) {
      console.error('Error vaciando carrito:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener resumen del carrito (para checkout)
  static async obtenerResumenCarrito(req, res) {
    try {
      const { usuario_id } = req.params;

      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          mensaje: 'Usuario ID es requerido'
        });
      }

      // Obtener carrito con información completa
      const resumenQuery = `
        SELECT 
          cd.producto_id,
          cd.cantidad,
          cd.precio_unitario,
          cd.subtotal,
          p.nombre as producto_nombre,
          p.marca,
          p.foto1 as imagen,
          i.stock_actual,
          p.activo
        FROM carrito_detalles cd
        JOIN carrito c ON cd.carrito_id = c.carrito_id
        JOIN productos p ON cd.producto_id = p.producto_id
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        WHERE c.cliente_id = ?
        ORDER BY cd.detalle_id
      `;

      const [itemsRows] = await db.execute(resumenQuery, [usuario_id]);

      if (itemsRows.length === 0) {
        return res.json({
          success: true,
          data: {
            items: [],
            subtotal: 0,
            envio: 50,
            impuestos: 0,
            total: 50
          }
        });
      }

      const items = itemsRows.map(item => ({
        producto_id: item.producto_id,
        nombre: item.producto_nombre,
        marca: item.marca,
        imagen: item.imagen,
        cantidad: item.cantidad,
        precio_unitario: parseFloat(item.precio_unitario),
        subtotal: parseFloat(item.subtotal),
        stock_actual: item.stock_actual || 0,
        activo: item.activo
      }));

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const envio = subtotal >= 500 ? 0 : 50;
      const impuestos = subtotal * 0.16;
      const total = subtotal + envio + impuestos;

      res.json({
        success: true,
        data: {
          items: items,
          subtotal: subtotal,
          envio: envio,
          impuestos: impuestos,
          total: total,
          envio_gratis_desde: 500,
          faltante_envio_gratis: subtotal < 500 ? 500 - subtotal : 0
        }
      });

    } catch (error) {
      console.error('Error obteniendo resumen del carrito:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Procesar checkout - Crear venta y rebajar inventario
  static async procesarCheckout(req, res) {
    try {
      const { usuario_id } = req.params;
      const { metodo_pago = 'Efectivo', observaciones = '' } = req.body;

      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          mensaje: 'Usuario ID es requerido'
        });
      }

      // Iniciar transacción con conexión dedicada
      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();
        // 1. Obtener carrito del usuario
        const carritoQuery = `
          SELECT c.carrito_id, c.cliente_id, cl.nombre, cl.apellido, cl.correo_electronico
          FROM carrito c
          JOIN clientes cl ON c.cliente_id = cl.cliente_id
          WHERE c.cliente_id = ?
          ORDER BY c.fecha_creacion DESC
          LIMIT 1
        `;
        
        const [carritoRows] = await conn.execute(carritoQuery, [usuario_id]);
        
        if (carritoRows.length === 0) {
          await conn.rollback();
          conn.release();
          return res.status(404).json({
            success: false,
            mensaje: 'No hay carrito activo para este usuario'
          });
        }

        const carrito = carritoRows[0];

        // 2. Obtener items del carrito con verificación de stock
        const itemsQuery = `
          SELECT 
            cd.producto_id,
            cd.cantidad,
            cd.precio_unitario,
            cd.subtotal,
            p.nombre as producto_nombre,
            i.stock_actual
          FROM carrito_detalles cd
          JOIN productos p ON cd.producto_id = p.producto_id
          LEFT JOIN inventario i ON p.producto_id = i.producto_id
          WHERE cd.carrito_id = ?
        `;

        const [itemsRows] = await conn.execute(itemsQuery, [carrito.carrito_id]);

        if (itemsRows.length === 0) {
          await conn.rollback();
          conn.release();
          return res.status(404).json({
            success: false,
            mensaje: 'El carrito está vacío'
          });
        }

        // 3. Verificar stock disponible antes de procesar
        for (const item of itemsRows) {
          const stockDisponible = item.stock_actual || 0;
          if (stockDisponible < item.cantidad) {
            await conn.rollback();
            conn.release();
            return res.status(400).json({
              success: false,
              mensaje: `Stock insuficiente para ${item.producto_nombre}. Disponible: ${stockDisponible}, solicitado: ${item.cantidad}`,
              producto: item.producto_nombre,
              stock_disponible: stockDisponible,
              cantidad_solicitada: item.cantidad
            });
          }
        }

        // 4. Calcular totales
        const subtotal = itemsRows.reduce((sum, item) => sum + item.subtotal, 0);
        const envio = subtotal >= 500 ? 0 : 50;
        const impuestos = subtotal * 0.16;
        const total = subtotal + envio + impuestos;

        // 5. Crear venta
        const ventaQuery = `
          INSERT INTO ventas 
          (fecha_venta, hora_venta, total_venta, cliente_id, cliente_nombre, cliente_email, metodo_pago, observaciones)
          VALUES (CURDATE(), CURTIME(), ?, ?, ?, ?, ?, ?)
        `;
        
        const clienteNombre = `${carrito.nombre} ${carrito.apellido}`;
        const [ventaResult] = await conn.execute(ventaQuery, [
          total, carrito.cliente_id, clienteNombre, carrito.correo_electronico, metodo_pago, observaciones
        ]);

        const ventaId = ventaResult.insertId;

        // 6. Crear detalles de venta y rebajar inventario
        for (const item of itemsRows) {
          // Insertar detalle de venta
          const detalleVentaQuery = `
            INSERT INTO venta_detalles 
            (venta_id, producto_id, cantidad, precio_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?)
          `;
          
          await conn.execute(detalleVentaQuery, [
            ventaId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal
          ]);

          // Rebajar inventario
          const rebajarInventarioQuery = `
            UPDATE inventario 
            SET stock_actual = stock_actual - ?
            WHERE producto_id = ?
          `;
          
          await conn.execute(rebajarInventarioQuery, [item.cantidad, item.producto_id]);

          // Log de movimiento de inventario
          const logMovimientoQuery = `
            INSERT INTO movimientos_inventario 
            (producto_id, tipo_movimiento, cantidad, motivo, fecha_movimiento)
            VALUES (?, 'Salida', ?, 'Venta #?', NOW())
          `;
          
          await conn.execute(logMovimientoQuery, [item.producto_id, item.cantidad, ventaId]);
        }

        // 7. Vaciar carrito
        const vaciarCarritoQuery = `
          DELETE FROM carrito_detalles WHERE carrito_id = ?
        `;
        await conn.execute(vaciarCarritoQuery, [carrito.carrito_id]);

        // 8. Confirmar transacción
        await conn.commit();
        conn.release();

        res.json({
          success: true,
          mensaje: 'Venta procesada exitosamente',
          data: {
            venta_id: ventaId,
            total: total,
            subtotal: subtotal,
            envio: envio,
            impuestos: impuestos,
            productos_vendidos: itemsRows.length,
            fecha_venta: new Date().toISOString().split('T')[0],
            hora_venta: new Date().toTimeString().split(' ')[0]
          }
        });

      } catch (error) {
        try { await conn.rollback(); } catch {}
        try { conn.release(); } catch {}
        throw error;
      }

    } catch (error) {
      console.error('Error procesando checkout:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default CarritoController;
