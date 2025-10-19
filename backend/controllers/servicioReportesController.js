// Controlador para reportes de servicios
import { db } from '../config/database.js';

class ServicioReportesController {
  // Obtener estadísticas generales de servicios
  static async obtenerEstadisticasGenerales(req, res) {
    try {
      console.log('📊 Obteniendo estadísticas generales de servicios...');

      const query = `
        SELECT 
          COUNT(DISTINCT servicio_nombre) as total_servicios_diferentes,
          COUNT(*) as total_citas_servicios,
          COUNT(CASE WHEN fecha_cita >= NOW() - INTERVAL '30 days' THEN 1 END) as citas_mes_actual,
          COUNT(CASE WHEN fecha_cita >= NOW() - INTERVAL '7 days' THEN 1 END) as citas_semana_actual,
          COUNT(CASE WHEN estado = 'Completada' THEN 1 END) as servicios_completados,
          COUNT(CASE WHEN estado = 'Cancelada' THEN 1 END) as servicios_cancelados,
          COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as servicios_pendientes,
          AVG(precio_base) as precio_promedio_servicio
        FROM citas c
        LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
        WHERE c.estado != 'Eliminada' 
          AND c.fecha_cita >= '2024-01-01'
          AND c.servicio_nombre IS NOT NULL
      `;

      const result = await db.query(query);
      const estadisticas = result.rows[0];

      res.json({
        success: true,
        data: {
          total_servicios_diferentes: estadisticas.total_servicios_diferentes || 0,
          total_citas_servicios: estadisticas.total_citas_servicios || 0,
          citas_mes_actual: estadisticas.citas_mes_actual || 0,
          citas_semana_actual: estadisticas.citas_semana_actual || 0,
          servicios_completados: estadisticas.servicios_completados || 0,
          servicios_cancelados: estadisticas.servicios_cancelados || 0,
          servicios_pendientes: estadisticas.servicios_pendientes || 0,
          precio_promedio_servicio: Math.round(estadisticas.precio_promedio_servicio || 0),
          porcentaje_completados: estadisticas.total_citas_servicios > 0 
            ? Math.round((estadisticas.servicios_completados / estadisticas.total_citas_servicios) * 100)
            : 0,
          porcentaje_cancelados: estadisticas.total_citas_servicios > 0 
            ? Math.round((estadisticas.servicios_cancelados / estadisticas.total_citas_servicios) * 100)
            : 0
        }
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas generales:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener estadísticas por servicio
  static async obtenerEstadisticasPorServicio(req, res) {
    try {
      console.log('📊 Obteniendo estadísticas por servicio...');

      const query = `
        SELECT 
          servicio_nombre,
          COUNT(*) as total_citas,
          COUNT(CASE WHEN estado = 'Completada' THEN 1 END) as completadas,
          COUNT(CASE WHEN estado = 'Cancelada' THEN 1 END) as canceladas,
          COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as pendientes,
          AVG(precio_base) as precio_promedio,
          SUM(precio_base) as ingresos_totales
        FROM citas c
        LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
        WHERE c.estado != 'Eliminada' 
          AND c.fecha_cita >= '2024-01-01'
          AND c.servicio_nombre IS NOT NULL
        GROUP BY servicio_nombre
        ORDER BY total_citas DESC
      `;

      const result = await db.query(query);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          servicio: row.servicio_nombre,
          total_citas: parseInt(row.total_citas),
          completadas: parseInt(row.completadas),
          canceladas: parseInt(row.canceladas),
          pendientes: parseInt(row.pendientes),
          precio_promedio: Math.round(row.precio_promedio || 0),
          ingresos_totales: Math.round(row.ingresos_totales || 0),
          porcentaje_completadas: row.total_citas > 0 
            ? Math.round((row.completadas / row.total_citas) * 100)
            : 0
        }))
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas por servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener estadísticas mensuales
  static async obtenerEstadisticasMensuales(req, res) {
    try {
      console.log('📊 Obteniendo estadísticas mensuales...');

      const query = `
        SELECT 
          TO_CHAR(fecha_cita, 'YYYY-MM') as mes,
          COUNT(*) as total_citas,
          COUNT(CASE WHEN estado = 'Completada' THEN 1 END) as completadas,
          COUNT(CASE WHEN estado = 'Cancelada' THEN 1 END) as canceladas,
          SUM(precio_base) as ingresos_mes
        FROM citas c
        LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
        WHERE c.estado != 'Eliminada' 
          AND c.fecha_cita >= '2024-01-01'
          AND c.servicio_nombre IS NOT NULL
        GROUP BY TO_CHAR(fecha_cita, 'YYYY-MM')
        ORDER BY mes DESC
      `;

      const result = await db.query(query);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          mes: row.mes,
          total_citas: parseInt(row.total_citas),
          completadas: parseInt(row.completadas),
          canceladas: parseInt(row.canceladas),
          ingresos_mes: Math.round(row.ingresos_mes || 0),
          porcentaje_completadas: row.total_citas > 0 
            ? Math.round((row.completadas / row.total_citas) * 100)
            : 0
        }))
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas mensuales:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener servicios más rentables
  static async obtenerServiciosMasRentables(req, res) {
    try {
      console.log('📊 Obteniendo servicios más rentables...');

      const query = `
        SELECT 
          servicio_nombre,
          COUNT(*) as total_citas,
          SUM(precio_base) as ingresos_totales,
          AVG(precio_base) as precio_promedio
        FROM citas c
        LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
        WHERE c.estado != 'Eliminada' 
          AND c.fecha_cita >= '2024-01-01'
          AND c.servicio_nombre IS NOT NULL
        GROUP BY servicio_nombre
        ORDER BY ingresos_totales DESC
      `;

      const result = await db.query(query);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          servicio: row.servicio_nombre,
          total_citas: parseInt(row.total_citas),
          ingresos_totales: Math.round(row.ingresos_totales || 0),
          precio_promedio: Math.round(row.precio_promedio || 0),
          ingresos_por_cita: row.total_citas > 0 
            ? Math.round(row.ingresos_totales / row.total_citas)
            : 0
        }))
      });

    } catch (error) {
      console.error('Error obteniendo servicios más rentables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener tendencias diarias
  static async obtenerTendenciasDiarias(req, res) {
    try {
      console.log('📊 Obteniendo tendencias diarias...');

      const query = `
        SELECT 
          TO_CHAR(fecha_cita, 'YYYY-MM-DD') as fecha,
          COUNT(*) as total_citas,
          SUM(precio_base) as ingresos_dia
        FROM citas c
        LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
        WHERE c.estado != 'Eliminada' 
          AND c.fecha_cita >= '2024-01-01'
          AND c.servicio_nombre IS NOT NULL
        GROUP BY TO_CHAR(fecha_cita, 'YYYY-MM-DD')
        ORDER BY fecha DESC
        LIMIT 30
      `;

      const result = await db.query(query);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          fecha: row.fecha,
          total_citas: parseInt(row.total_citas),
          ingresos_dia: Math.round(row.ingresos_dia || 0)
        }))
      });

    } catch (error) {
      console.error('Error obteniendo tendencias diarias:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

export default ServicioReportesController;