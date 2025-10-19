import Venta from '../models/ventaModel.js';

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    console.log('📊 Obteniendo ventas...');
    
    Venta.getAll((err, results) => {
      if (err) {
        console.error('❌ Error obteniendo ventas:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      console.log('✅ Ventas obtenidas:', results.length);
      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('❌ Error en obtenerVentas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener ventas por rango de fechas
const obtenerVentasPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    console.log('📅 Obteniendo ventas por fecha:', fechaInicio, 'a', fechaFin);
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        error: 'Fechas de inicio y fin son requeridas'
      });
    }

    Venta.getByDateRange(fechaInicio, fechaFin, (err, results) => {
      if (err) {
        console.error('❌ Error obteniendo ventas por fecha:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      console.log('✅ Ventas por fecha obtenidas:', results.length);
      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('❌ Error en obtenerVentasPorFecha:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener detalles de una venta
const obtenerDetallesVenta = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 Obteniendo detalles de venta:', id);
    
    Venta.getDetalles(id, (err, results) => {
      if (err) {
        console.error('❌ Error obteniendo detalles:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      console.log('✅ Detalles obtenidos:', results.length);
      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('❌ Error en obtenerDetallesVenta:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Crear nueva venta
const crearVenta = async (req, res) => {
  try {
    console.log('💰 Creando nueva venta...');
    console.log('📦 Datos recibidos:', req.body);

    const {
      fecha_venta,
      hora_venta,
      total_venta,
      cliente_nombre,
      cliente_email,
      metodo_pago,
      observaciones,
      productos
    } = req.body;

    // Validar datos requeridos
    if (!fecha_venta || !hora_venta || !total_venta || !productos || productos.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: fecha, hora, total y productos son obligatorios'
      });
    }

    // Crear la venta
    const ventaData = {
      fecha_venta,
      hora_venta,
      total_venta,
      cliente_nombre: cliente_nombre || '',
      cliente_email: cliente_email || '',
      metodo_pago: metodo_pago || 'Efectivo',
      estado: 'Completada',
      observaciones: observaciones || ''
    };

    console.log('📝 Creando venta con datos:', ventaData);

    Venta.crear(ventaData, (err, result) => {
      if (err) {
        console.error('❌ Error creando venta:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      const ventaId = result.insertId;
      console.log('✅ Venta creada exitosamente:', ventaId);

      // Crear detalles de venta
      let detallesCreados = 0;
      const totalDetalles = productos.length;

      productos.forEach((producto, index) => {
        const detalleData = {
          venta_id: ventaId,
          producto_id: producto.id,
          producto_nombre: producto.nombre,
          producto_marca: producto.marca || '',
          categoria: producto.categoria || '',
          precio_unitario: producto.precio,
          cantidad: producto.cantidad,
          subtotal: producto.precio * producto.cantidad
        };

        Venta.crearDetalle(detalleData, (err, detalleResult) => {
          if (err) {
            console.error('❌ Error creando detalle:', err);
          } else {
            console.log('✅ Detalle creado:', detalleResult.insertId);
          }

          detallesCreados++;
          if (detallesCreados === totalDetalles) {
            console.log('✅ Todos los detalles creados');
            res.status(201).json({
              success: true,
              message: 'Venta creada exitosamente',
              venta_id: ventaId
            });
          }
        });
      });
    });

  } catch (error) {
    console.error('❌ Error en crearVenta:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de ventas
const obtenerEstadisticasVentas = async (req, res) => {
  try {
    const { periodo } = req.params;
    
    console.log('📈 Obteniendo estadísticas para periodo:', periodo);
    
    if (!periodo || !['dia', 'semana', 'mes', 'año'].includes(periodo)) {
      return res.status(400).json({
        success: false,
        error: 'Periodo inválido. Use: dia, semana, mes, año'
      });
    }

    Venta.getEstadisticas(periodo, (err, results) => {
      if (err) {
        console.error('❌ Error obteniendo estadísticas:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      console.log('✅ Estadísticas obtenidas:', results.length);
      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('❌ Error en obtenerEstadisticasVentas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener top productos más vendidos
const obtenerTopProductos = async (req, res) => {
  try {
    const { periodo } = req.params;
    const { limite } = req.query;
    
    console.log('🏆 Obteniendo top productos para periodo:', periodo);
    
    if (!periodo || !['mes', 'año'].includes(periodo)) {
      return res.status(400).json({
        success: false,
        error: 'Periodo inválido. Use: mes, año'
      });
    }

    const limiteNum = parseInt(limite) || 5;

    Venta.getTopProductos(periodo, limiteNum, (err, results) => {
      if (err) {
        console.error('❌ Error obteniendo top productos:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      console.log('✅ Top productos obtenidos:', results.length);
      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('❌ Error en obtenerTopProductos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener top categorías más vendidas
const obtenerTopCategorias = async (req, res) => {
  try {
    const { periodo } = req.params;
    
    console.log('📊 Obteniendo top categorías para periodo:', periodo);
    
    if (!periodo || !['mes', 'año'].includes(periodo)) {
      return res.status(400).json({
        success: false,
        error: 'Periodo inválido. Use: mes, año'
      });
    }

    Venta.getTopCategorias(periodo, (err, results) => {
      if (err) {
        console.error('❌ Error obteniendo top categorías:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      console.log('✅ Top categorías obtenidas:', results.length);
      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('❌ Error en obtenerTopCategorias:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};


export default {
  obtenerVentas,
  obtenerVentasPorFecha,
  obtenerDetallesVenta,
  crearVenta,
  obtenerEstadisticasVentas,
  obtenerTopProductos,
  obtenerTopCategorias
};
