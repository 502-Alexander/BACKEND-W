// Controlador para gestión de clientes unificados
import { db } from '../config/database.js';

// Obtener todos los clientes unificados (de citas + tabla clientes)
// Obtener todos los clientes unificados (de citas + tabla clientes)
const obtenerClientesUnificados = async (req, res) => {
  try {
    console.log('👥 Obteniendo clientes unificados...');
    
    // Query para obtener clientes únicos de las citas con estadísticas
    const query = `
      SELECT 
        c.nombre_cliente,
        c.apellidos_cliente,
        c.telefono,
        c.correo,
        COUNT(*) as total_citas,
        COUNT(CASE WHEN c.estado = 'Completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN c.estado = 'Cancelada' THEN 1 END) as citas_canceladas,
        COUNT(CASE WHEN c.estado = 'Pendiente' THEN 1 END) as citas_pendientes,
        MAX(c.fecha_cita) as ultima_cita,
        MIN(c.fecha_cita) as primera_cita,
        SUM(s.precio_base) as total_gastado,
        AVG(s.precio_base) as promedio_gasto
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
      WHERE c.estado != 'Eliminada'
        AND c.nombre_cliente IS NOT NULL
        AND c.nombre_cliente != ''
      GROUP BY c.nombre_cliente, c.apellidos_cliente, c.telefono, c.correo
      ORDER BY total_citas DESC, ultima_cita DESC
    `;

    const result = await db.query(query);
    console.log('Resultado de la consulta:', result);

    res.json({
      success: true,
      data: result.map(row => ({
        nombre: row.nombre_cliente,
        apellidos: row.apellidos_cliente,
        telefono: row.telefono,
        email: row.correo,
        total_citas: parseInt(row.total_citas),
        citas_completadas: parseInt(row.citas_completadas),
        citas_canceladas: parseInt(row.citas_canceladas),
        citas_pendientes: parseInt(row.citas_pendientes),
        ultima_cita: row.ultima_cita,
        primera_cita: row.primera_cita,
        total_gastado: Math.round(row.total_gastado || 0),
        promedio_gasto: Math.round(row.promedio_gasto || 0),
        porcentaje_completadas: row.total_citas > 0 
          ? Math.round((row.citas_completadas / row.total_citas) * 100)
          : 0
      }))
    });

  } catch (error) {
    console.error('Error obteniendo clientes unificados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estadísticas generales de clientes
const obtenerEstadisticasClientes = async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de clientes...');

    const query = `
      SELECT 
        COUNT(DISTINCT CONCAT(nombre_cliente, COALESCE(apellidos_cliente, ''))) as total_clientes_unicos,
        COUNT(*) as total_citas_clientes,
        COUNT(CASE WHEN estado = 'Completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN estado = 'Cancelada' THEN 1 END) as citas_canceladas,
        COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as citas_pendientes,
        COUNT(CASE WHEN fecha_cita >= NOW() - INTERVAL '30 days' THEN 1 END) as citas_mes_actual,
        COUNT(CASE WHEN fecha_cita >= NOW() - INTERVAL '7 days' THEN 1 END) as citas_semana_actual,
        AVG(s.precio_base) as promedio_gasto_por_cita,
        SUM(s.precio_base) as ingresos_totales_clientes
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
      WHERE c.estado != 'Eliminada'
        AND c.nombre_cliente IS NOT NULL
        AND c.nombre_cliente != ''
    `;

    const result = await db.query(query);
    const estadisticas = result.rows[0];

    res.json({
      success: true,
      data: {
        total_clientes_unicos: parseInt(estadisticas.total_clientes_unicos || 0),
        total_citas_clientes: parseInt(estadisticas.total_citas_clientes || 0),
        citas_completadas: parseInt(estadisticas.citas_completadas || 0),
        citas_canceladas: parseInt(estadisticas.citas_canceladas || 0),
        citas_pendientes: parseInt(estadisticas.citas_pendientes || 0),
        citas_mes_actual: parseInt(estadisticas.citas_mes_actual || 0),
        citas_semana_actual: parseInt(estadisticas.citas_semana_actual || 0),
        promedio_gasto_por_cita: Math.round(estadisticas.promedio_gasto_por_cita || 0),
        ingresos_totales_clientes: Math.round(estadisticas.ingresos_totales_clientes || 0),
        porcentaje_completadas: estadisticas.total_citas_clientes > 0 
          ? Math.round((estadisticas.citas_completadas / estadisticas.total_citas_clientes) * 100)
          : 0,
        porcentaje_canceladas: estadisticas.total_citas_clientes > 0 
          ? Math.round((estadisticas.citas_canceladas / estadisticas.total_citas_clientes) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener clientes más frecuentes
const obtenerClientesMasFrecuentes = async (req, res) => {
  try {
    console.log('👥 Obteniendo clientes más frecuentes...');

    const query = `
      SELECT 
        c.nombre_cliente,
        c.apellidos_cliente,
        c.telefono_cliente,
        COUNT(*) as total_citas,
        COUNT(CASE WHEN c.estado = 'Completada' THEN 1 END) as citas_completadas,
        MAX(c.fecha_cita) as ultima_cita,
        SUM(s.precio_base) as total_gastado
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
      WHERE c.estado != 'Eliminada'
        AND c.nombre_cliente IS NOT NULL
        AND c.nombre_cliente != ''
      GROUP BY c.nombre_cliente, c.apellidos_cliente, c.telefono_cliente
      HAVING COUNT(*) >= 2
      ORDER BY total_citas DESC, ultima_cita DESC
      LIMIT 20
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        nombre: row.nombre_cliente,
        apellidos: row.apellidos_cliente,
        telefono: row.telefono_cliente,
        total_citas: parseInt(row.total_citas),
        citas_completadas: parseInt(row.citas_completadas),
        ultima_cita: row.ultima_cita,
        total_gastado: Math.round(row.total_gastado || 0),
        porcentaje_completadas: row.total_citas > 0 
          ? Math.round((row.citas_completadas / row.total_citas) * 100)
          : 0
      }))
    });

  } catch (error) {
    console.error('Error obteniendo clientes más frecuentes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener clientes por período
const obtenerClientesPorPeriodo = async (req, res) => {
  try {
    const { periodo } = req.params;
    console.log(`📅 Obteniendo clientes del período: ${periodo}`);

    let fechaInicio;
    const fechaFin = new Date();

    switch (periodo) {
      case 'semana':
        fechaInicio = new Date(fechaFin.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        fechaInicio = new Date(fechaFin.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'trimestre':
        fechaInicio = new Date(fechaFin.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'año':
        fechaInicio = new Date(fechaFin.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        fechaInicio = new Date('2024-01-01');
    }

    const query = `
      SELECT 
        c.nombre_cliente,
        c.apellidos_cliente,
        c.telefono_cliente,
        COUNT(*) as total_citas,
        COUNT(CASE WHEN c.estado = 'Completada' THEN 1 END) as citas_completadas,
        MAX(c.fecha_cita) as ultima_cita,
        SUM(s.precio_base) as total_gastado
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
      WHERE c.estado != 'Eliminada'
        AND c.nombre_cliente IS NOT NULL
        AND c.nombre_cliente != ''
        AND c.fecha_cita >= $1
        AND c.fecha_cita <= $2
      GROUP BY c.nombre_cliente, c.apellidos_cliente, c.telefono_cliente
      ORDER BY total_citas DESC, ultima_cita DESC
    `;

    const result = await db.query(query, [fechaInicio, fechaFin]);

    res.json({
      success: true,
      data: {
        periodo: periodo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        clientes: result.rows.map(row => ({
          nombre: row.nombre_cliente,
          apellidos: row.apellidos_cliente,
          telefono: row.telefono_cliente,
          total_citas: parseInt(row.total_citas),
          citas_completadas: parseInt(row.citas_completadas),
          ultima_cita: row.ultima_cita,
          total_gastado: Math.round(row.total_gastado || 0),
          porcentaje_completadas: row.total_citas > 0 
            ? Math.round((row.citas_completadas / row.total_citas) * 100)
            : 0
        }))
      }
    });

  } catch (error) {
    console.error('Error obteniendo clientes por período:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener análisis de retención de clientes
const obtenerAnalisisRetencion = async (req, res) => {
  try {
    console.log('📊 Obteniendo análisis de retención de clientes...');

    const query = `
      WITH clientes_con_multiple_citas AS (
        SELECT 
          CONCAT(nombre_cliente, COALESCE(apellidos_cliente, '')) as cliente_completo,
          COUNT(*) as total_citas,
          MIN(fecha_cita) as primera_cita,
          MAX(fecha_cita) as ultima_cita,
          SUM(s.precio_base) as total_gastado
        FROM citas c
        LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
        WHERE c.estado != 'Eliminada'
          AND c.nombre_cliente IS NOT NULL
          AND c.nombre_cliente != ''
        GROUP BY CONCAT(nombre_cliente, COALESCE(apellidos_cliente, ''))
        HAVING COUNT(*) >= 2
      )
      SELECT 
        COUNT(*) as clientes_recurrentes,
        AVG(total_citas) as promedio_citas_por_cliente,
        AVG(total_gastado) as promedio_gasto_por_cliente,
        COUNT(CASE WHEN ultima_cita >= NOW() - INTERVAL '30 days' THEN 1 END) as clientes_activos_mes,
        COUNT(CASE WHEN ultima_cita >= NOW() - INTERVAL '90 days' THEN 1 END) as clientes_activos_trimestre,
        COUNT(CASE WHEN ultima_cita < NOW() - INTERVAL '90 days' THEN 1 END) as clientes_inactivos
      FROM clientes_con_multiple_citas
    `;

    const result = await db.query(query);
    const analisis = result.rows[0];

    res.json({
      success: true,
      data: {
        clientes_recurrentes: parseInt(analisis.clientes_recurrentes || 0),
        promedio_citas_por_cliente: Math.round(analisis.promedio_citas_por_cliente || 0),
        promedio_gasto_por_cliente: Math.round(analisis.promedio_gasto_por_cliente || 0),
        clientes_activos_mes: parseInt(analisis.clientes_activos_mes || 0),
        clientes_activos_trimestre: parseInt(analisis.clientes_activos_trimestre || 0),
        clientes_inactivos: parseInt(analisis.clientes_inactivos || 0),
        tasa_retencion_mes: analisis.clientes_recurrentes > 0 
          ? Math.round((analisis.clientes_activos_mes / analisis.clientes_recurrentes) * 100)
          : 0,
        tasa_retencion_trimestre: analisis.clientes_recurrentes > 0 
          ? Math.round((analisis.clientes_activos_trimestre / analisis.clientes_recurrentes) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('Error obteniendo análisis de retención:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener tendencias de clientes por mes
const obtenerTendenciasClientesMensuales = async (req, res) => {
  try {
    console.log('📊 Obteniendo tendencias de clientes mensuales...');

    const query = `
      SELECT 
        TO_CHAR(fecha_cita, 'YYYY-MM') as mes,
        COUNT(DISTINCT CONCAT(nombre_cliente, COALESCE(apellidos_cliente, ''))) as clientes_unicos_mes,
        COUNT(*) as total_citas_mes,
        COUNT(CASE WHEN estado = 'Completada' THEN 1 END) as citas_completadas_mes,
        SUM(s.precio_base) as ingresos_mes
      FROM citas c
      LEFT JOIN servicios s ON c.servicio_nombre = s.nombre
      WHERE c.estado != 'Eliminada'
        AND c.nombre_cliente IS NOT NULL
        AND c.nombre_cliente != ''
        AND c.fecha_cita >= '2024-01-01'
      GROUP BY TO_CHAR(fecha_cita, 'YYYY-MM')
      ORDER BY mes DESC
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        mes: row.mes,
        clientes_unicos_mes: parseInt(row.clientes_unicos_mes),
        total_citas_mes: parseInt(row.total_citas_mes),
        citas_completadas_mes: parseInt(row.citas_completadas_mes),
        ingresos_mes: Math.round(row.ingresos_mes || 0),
        promedio_citas_por_cliente: row.clientes_unicos_mes > 0 
          ? Math.round(row.total_citas_mes / row.clientes_unicos_mes)
          : 0,
        porcentaje_completadas: row.total_citas_mes > 0 
          ? Math.round((row.citas_completadas_mes / row.total_citas_mes) * 100)
          : 0
      }))
    });

  } catch (error) {
    console.error('Error obteniendo tendencias de clientes mensuales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

export default {
  obtenerClientesUnificados,
  obtenerEstadisticasClientes,
  obtenerClientesMasFrecuentes,
  obtenerClientesPorPeriodo,
  obtenerAnalisisRetencion,
  obtenerTendenciasClientesMensuales
};
