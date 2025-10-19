import db from '../database/ConexionBDD.js';

const Venta = {
  // Obtener todas las ventas
  getAll: (callback) => {
    const query = `
      SELECT 
        v.id_venta, v.fecha_venta, v.hora_venta, v.total_venta,
        v.cliente_nombre, v.cliente_email, v.metodo_pago, v.estado,
        v.observaciones, v.fecha_registro
      FROM ventas v
      WHERE v.estado = 'Completada'
      ORDER BY v.fecha_venta DESC, v.hora_venta DESC
    `;
    db.query(query, callback);
  },

  // Obtener ventas por rango de fechas
  getByDateRange: (fechaInicio, fechaFin, callback) => {
    const query = `
      SELECT 
        v.id_venta, v.fecha_venta, v.hora_venta, v.total_venta,
        v.cliente_nombre, v.cliente_email, v.metodo_pago, v.estado,
        v.observaciones, v.fecha_registro
      FROM ventas v
      WHERE v.fecha_venta BETWEEN ? AND ? AND v.estado = 'Completada'
      ORDER BY v.fecha_venta DESC, v.hora_venta DESC
    `;
    db.query(query, [fechaInicio, fechaFin], callback);
  },

  // Obtener detalles de una venta
  getDetalles: (ventaId, callback) => {
    const query = `
      SELECT 
        dv.id_detalle, dv.producto_id, dv.producto_nombre, dv.producto_marca,
        dv.categoria, dv.precio_unitario, dv.cantidad, dv.subtotal,
        dv.fecha_registro
      FROM detalle_ventas dv
      WHERE dv.venta_id = ?
      ORDER BY dv.id_detalle
    `;
    db.query(query, [ventaId], callback);
  },

  // Crear nueva venta
  crear: (ventaData, callback) => {
    const query = 'INSERT INTO ventas SET ?';
    db.query(query, ventaData, callback);
  },

  // Crear detalle de venta
  crearDetalle: (detalleData, callback) => {
    const query = 'INSERT INTO detalle_ventas SET ?';
    db.query(query, detalleData, callback);
  },

  // Estadísticas de ventas
  getEstadisticas: (periodo, callback) => {
    let query = '';
    let params = [];

    switch (periodo) {
      case 'dia':
        query = `
          SELECT 
            DATE(fecha_venta) as fecha,
            COUNT(*) as total_ventas,
            SUM(total_venta) as ingresos_totales,
            SUM((
              SELECT SUM(cantidad) 
              FROM detalle_ventas dv 
              WHERE dv.venta_id = v.id_venta
            )) as productos_vendidos
          FROM ventas v
          WHERE DATE(fecha_venta) = CURDATE() AND estado = 'Completada'
        `;
        break;
      
      case 'semana':
        query = `
          SELECT 
            DATE(fecha_venta) as fecha,
            COUNT(*) as total_ventas,
            SUM(total_venta) as ingresos_totales,
            SUM((
              SELECT SUM(cantidad) 
              FROM detalle_ventas dv 
              WHERE dv.venta_id = v.id_venta
            )) as productos_vendidos
          FROM ventas v
          WHERE fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND estado = 'Completada'
          GROUP BY DATE(fecha_venta)
          ORDER BY fecha DESC
        `;
        break;
      
      case 'mes':
        query = `
          SELECT 
            YEAR(fecha_venta) as año,
            MONTH(fecha_venta) as mes,
            COUNT(*) as total_ventas,
            SUM(total_venta) as ingresos_totales,
            SUM((
              SELECT SUM(cantidad) 
              FROM detalle_ventas dv 
              WHERE dv.venta_id = v.id_venta
            )) as productos_vendidos
          FROM ventas v
          WHERE YEAR(fecha_venta) = YEAR(CURDATE()) AND estado = 'Completada'
          GROUP BY YEAR(fecha_venta), MONTH(fecha_venta)
          ORDER BY año DESC, mes DESC
        `;
        break;
      
      case 'año':
        query = `
          SELECT 
            YEAR(fecha_venta) as año,
            COUNT(*) as total_ventas,
            SUM(total_venta) as ingresos_totales,
            SUM((
              SELECT SUM(cantidad) 
              FROM detalle_ventas dv 
              WHERE dv.venta_id = v.id_venta
            )) as productos_vendidos
          FROM ventas v
          WHERE estado = 'Completada'
          GROUP BY YEAR(fecha_venta)
          ORDER BY año DESC
        `;
        break;
    }

    db.query(query, params, callback);
  },

  // Top productos más vendidos
  getTopProductos: (periodo, limite = 5, callback) => {
    let query = '';
    let params = [];

    switch (periodo) {
      case 'mes':
        query = `
          SELECT 
            dv.producto_nombre,
            dv.producto_marca,
            dv.categoria,
            SUM(dv.cantidad) as total_vendido,
            SUM(dv.subtotal) as ingresos_generados,
            COUNT(DISTINCT dv.venta_id) as veces_vendido
          FROM detalle_ventas dv
          INNER JOIN ventas v ON dv.venta_id = v.id_venta
          WHERE YEAR(v.fecha_venta) = YEAR(CURDATE()) 
            AND MONTH(v.fecha_venta) = MONTH(CURDATE())
            AND v.estado = 'Completada'
          GROUP BY dv.producto_id, dv.producto_nombre, dv.producto_marca, dv.categoria
          ORDER BY total_vendido DESC
          LIMIT ?
        `;
        params = [limite];
        break;
      
      case 'año':
        query = `
          SELECT 
            dv.producto_nombre,
            dv.producto_marca,
            dv.categoria,
            SUM(dv.cantidad) as total_vendido,
            SUM(dv.subtotal) as ingresos_generados,
            COUNT(DISTINCT dv.venta_id) as veces_vendido
          FROM detalle_ventas dv
          INNER JOIN ventas v ON dv.venta_id = v.id_venta
          WHERE YEAR(v.fecha_venta) = YEAR(CURDATE()) AND v.estado = 'Completada'
          GROUP BY dv.producto_id, dv.producto_nombre, dv.producto_marca, dv.categoria
          ORDER BY total_vendido DESC
          LIMIT ?
        `;
        params = [limite];
        break;
    }

    db.query(query, params, callback);
  },

  // Top categorías más vendidas
  getTopCategorias: (periodo, callback) => {
    let query = '';
    let params = [];

    switch (periodo) {
      case 'mes':
        query = `
          SELECT 
            dv.categoria,
            SUM(dv.cantidad) as total_vendido,
            SUM(dv.subtotal) as ingresos_generados,
            COUNT(DISTINCT dv.venta_id) as ventas_realizadas
          FROM detalle_ventas dv
          INNER JOIN ventas v ON dv.venta_id = v.id_venta
          WHERE YEAR(v.fecha_venta) = YEAR(CURDATE()) 
            AND MONTH(v.fecha_venta) = MONTH(CURDATE())
            AND v.estado = 'Completada'
          GROUP BY dv.categoria
          ORDER BY total_vendido DESC
        `;
        break;
      
      case 'año':
        query = `
          SELECT 
            dv.categoria,
            SUM(dv.cantidad) as total_vendido,
            SUM(dv.subtotal) as ingresos_generados,
            COUNT(DISTINCT dv.venta_id) as ventas_realizadas
          FROM detalle_ventas dv
          INNER JOIN ventas v ON dv.venta_id = v.id_venta
          WHERE YEAR(v.fecha_venta) = YEAR(CURDATE()) AND v.estado = 'Completada'
          GROUP BY dv.categoria
          ORDER BY total_vendido DESC
        `;
        break;
    }

    db.query(query, params, callback);
  }
};

export default Venta;
