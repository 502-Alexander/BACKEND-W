import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LogsController {
  /**
   * Filtrar logs por año (2024 en adelante)
   */
  static filtrarLogsPorAno(logs, anoMinimo = 2024) {
    return logs.filter(log => {
      try {
        // Extraer fecha del log (formato: [2025-09-23T03:23:55.941Z])
        const fechaMatch = log.match(/\[(.*?)\]/);
        if (!fechaMatch) return false;
        
        const fecha = new Date(fechaMatch[1]);
        return fecha.getFullYear() >= anoMinimo;
      } catch (error) {
        console.warn('Error parseando fecha del log:', error.message);
        return false;
      }
    });
  }

  /**
   * Obtener estadísticas generales de todos los logs
   */
  static async obtenerEstadisticasGenerales(req, res) {
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      
      // Leer todos los archivos de logs
      const [authLogsRaw, errorLogsRaw, requestLogsRaw, responseLogsRaw] = await Promise.all([
        LogsController.leerArchivoLog(path.join(logsDir, 'auth.log')),
        LogsController.leerArchivoLog(path.join(logsDir, 'errors.log')),
        LogsController.leerArchivoLog(path.join(logsDir, 'requests.log')),
        LogsController.leerArchivoLog(path.join(logsDir, 'responses.log'))
      ]);

      // Filtrar logs por año (2024 en adelante)
      const authLogs = LogsController.filtrarLogsPorAno(authLogsRaw);
      const errorLogs = LogsController.filtrarLogsPorAno(errorLogsRaw);
      const requestLogs = LogsController.filtrarLogsPorAno(requestLogsRaw);
      const responseLogs = LogsController.filtrarLogsPorAno(responseLogsRaw);

      console.log(`📊 Logs filtrados por año 2024+: Auth=${authLogs.length}, Errors=${errorLogs.length}, Requests=${requestLogs.length}, Responses=${responseLogs.length}`);

      // Procesar estadísticas
      const estadisticas = {
        total_logs: authLogs.length + errorLogs.length + requestLogs.length + responseLogs.length,
        auth_logs: authLogs.length,
        error_logs: errorLogs.length,
        request_logs: requestLogs.length,
        response_logs: responseLogs.length,
        auth_failed: authLogs.filter(log => log.includes('AUTH FAILED')).length,
        auth_success: authLogs.filter(log => log.includes('AUTH SUCCESS')).length,
        errors_404: errorLogs.filter(log => log.includes('404')).length,
        errors_500: errorLogs.filter(log => log.includes('500')).length,
        requests_get: requestLogs.filter(log => log.includes('GET')).length,
        requests_post: requestLogs.filter(log => log.includes('POST')).length,
        responses_200: responseLogs.filter(log => log.includes('200')).length,
        responses_404: responseLogs.filter(log => log.includes('404')).length,
        responses_500: responseLogs.filter(log => log.includes('500')).length
      };

      res.json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas de logs:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener logs de autenticación con análisis temporal
   */
  static async obtenerLogsAuth(req, res) {
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const authLogsRaw = await LogsController.leerArchivoLog(path.join(logsDir, 'auth.log'));
      
      // Filtrar logs por año (2024 en adelante)
      const authLogs = LogsController.filtrarLogsPorAno(authLogsRaw);
      
      console.log(`🔐 Logs de auth filtrados por año 2024+: ${authLogs.length} logs`);

      // Procesar logs por día
      const logsPorDia = {};
      const logsPorHora = {};
      const intentosPorUsuario = {};

      authLogs.forEach(log => {
        const fecha = new Date(log.match(/\[(.*?)\]/)[1]);
        const dia = fecha.toISOString().split('T')[0];
        const hora = fecha.getHours();
        
        // Contar por día
        logsPorDia[dia] = (logsPorDia[dia] || 0) + 1;
        
        // Contar por hora
        logsPorHora[hora] = (logsPorHora[hora] || 0) + 1;

        // Extraer usuario
        const usuarioMatch = log.match(/Email: ([^\s-]+)/);
        if (usuarioMatch) {
          const usuario = usuarioMatch[1];
          intentosPorUsuario[usuario] = (intentosPorUsuario[usuario] || 0) + 1;
        }
      });

      res.json({
        success: true,
        data: {
          total_intentos: authLogs.length,
          logs_por_dia: Object.entries(logsPorDia).map(([dia, count]) => ({ dia, count })),
          logs_por_hora: Object.entries(logsPorHora).map(([hora, count]) => ({ hora: parseInt(hora), count })),
          intentos_por_usuario: Object.entries(intentosPorUsuario).map(([usuario, count]) => ({ usuario, count }))
        }
      });

    } catch (error) {
      console.error('Error obteniendo logs de auth:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener logs de errores con análisis detallado
   */
  static async obtenerLogsErrores(req, res) {
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const errorLogsRaw = await LogsController.leerArchivoLog(path.join(logsDir, 'errors.log'));
      
      // Filtrar logs por año (2024 en adelante)
      const errorLogs = LogsController.filtrarLogsPorAno(errorLogsRaw);
      
      console.log(`❌ Logs de errores filtrados por año 2024+: ${errorLogs.length} logs`);

      // Procesar errores por tipo y ruta
      const erroresPorTipo = {};
      const erroresPorRuta = {};
      const erroresPorDia = {};

      errorLogs.forEach(log => {
        const fecha = new Date(log.match(/\[(.*?)\]/)[1]);
        const dia = fecha.toISOString().split('T')[0];
        
        // Extraer código de error
        const codigoMatch = log.match(/(\d{3})/);
        if (codigoMatch) {
          const codigo = codigoMatch[1];
          erroresPorTipo[codigo] = (erroresPorTipo[codigo] || 0) + 1;
        }

        // Extraer ruta
        const rutaMatch = log.match(/(GET|POST|PUT|DELETE) ([^\s]+)/);
        if (rutaMatch) {
          const ruta = rutaMatch[2];
          erroresPorRuta[ruta] = (erroresPorRuta[ruta] || 0) + 1;
        }

        // Contar por día
        erroresPorDia[dia] = (erroresPorDia[dia] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          total_errores: errorLogs.length,
          errores_por_tipo: Object.entries(erroresPorTipo).map(([tipo, count]) => ({ tipo, count })),
          errores_por_ruta: Object.entries(erroresPorRuta).map(([ruta, count]) => ({ ruta, count })),
          errores_por_dia: Object.entries(erroresPorDia).map(([dia, count]) => ({ dia, count }))
        }
      });

    } catch (error) {
      console.error('Error obteniendo logs de errores:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener logs de requests con análisis de tráfico
   */
  static async obtenerLogsRequests(req, res) {
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const requestLogsRaw = await LogsController.leerArchivoLog(path.join(logsDir, 'requests.log'));
      
      // Filtrar logs por año (2024 en adelante)
      const requestLogs = LogsController.filtrarLogsPorAno(requestLogsRaw);
      
      console.log(`📥 Logs de requests filtrados por año 2024+: ${requestLogs.length} logs`);

      // Procesar requests por método y endpoint
      const requestsPorMetodo = {};
      const requestsPorEndpoint = {};
      const requestsPorDia = {};
      const requestsPorHora = {};

      requestLogs.forEach(log => {
        const fecha = new Date(log.match(/\[(.*?)\]/)[1]);
        const dia = fecha.toISOString().split('T')[0];
        const hora = fecha.getHours();
        
        // Extraer método HTTP
        const metodoMatch = log.match(/(GET|POST|PUT|DELETE|PATCH)/);
        if (metodoMatch) {
          const metodo = metodoMatch[1];
          requestsPorMetodo[metodo] = (requestsPorMetodo[metodo] || 0) + 1;
        }

        // Extraer endpoint
        const endpointMatch = log.match(/(GET|POST|PUT|DELETE|PATCH) ([^\s]+)/);
        if (endpointMatch) {
          const endpoint = endpointMatch[2];
          requestsPorEndpoint[endpoint] = (requestsPorEndpoint[endpoint] || 0) + 1;
        }

        // Contar por día y hora
        requestsPorDia[dia] = (requestsPorDia[dia] || 0) + 1;
        requestsPorHora[hora] = (requestsPorHora[hora] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          total_requests: requestLogs.length,
          requests_por_metodo: Object.entries(requestsPorMetodo).map(([metodo, count]) => ({ metodo, count })),
          requests_por_endpoint: Object.entries(requestsPorEndpoint).map(([endpoint, count]) => ({ endpoint, count })),
          requests_por_dia: Object.entries(requestsPorDia).map(([dia, count]) => ({ dia, count })),
          requests_por_hora: Object.entries(requestsPorHora).map(([hora, count]) => ({ hora: parseInt(hora), count }))
        }
      });

    } catch (error) {
      console.error('Error obteniendo logs de requests:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener logs de responses con análisis de rendimiento
   */
  static async obtenerLogsResponses(req, res) {
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const responseLogsRaw = await LogsController.leerArchivoLog(path.join(logsDir, 'responses.log'));
      
      // Filtrar logs por año (2024 en adelante)
      const responseLogs = LogsController.filtrarLogsPorAno(responseLogsRaw);
      
      console.log(`📤 Logs de responses filtrados por año 2024+: ${responseLogs.length} logs`);

      // Procesar responses por código y tiempo
      const responsesPorCodigo = {};
      const responsesPorDia = {};
      const tiemposRespuesta = [];

      responseLogs.forEach(log => {
        const fecha = new Date(log.match(/\[(.*?)\]/)[1]);
        const dia = fecha.toISOString().split('T')[0];
        
        // Extraer código de respuesta
        const codigoMatch = log.match(/(\d{3})/);
        if (codigoMatch) {
          const codigo = codigoMatch[1];
          responsesPorCodigo[codigo] = (responsesPorCodigo[codigo] || 0) + 1;
        }

        // Extraer tiempo de respuesta
        const tiempoMatch = log.match(/Time: (\d+)ms/);
        if (tiempoMatch) {
          const tiempo = parseInt(tiempoMatch[1]);
          tiemposRespuesta.push(tiempo);
        }

        // Contar por día
        responsesPorDia[dia] = (responsesPorDia[dia] || 0) + 1;
      });

      // Calcular estadísticas de tiempo
      const tiempoPromedio = tiemposRespuesta.length > 0 
        ? tiemposRespuesta.reduce((a, b) => a + b, 0) / tiemposRespuesta.length 
        : 0;
      
      const tiempoMaximo = tiemposRespuesta.length > 0 ? Math.max(...tiemposRespuesta) : 0;
      const tiempoMinimo = tiemposRespuesta.length > 0 ? Math.min(...tiemposRespuesta) : 0;

      res.json({
        success: true,
        data: {
          total_responses: responseLogs.length,
          responses_por_codigo: Object.entries(responsesPorCodigo).map(([codigo, count]) => ({ codigo, count })),
          responses_por_dia: Object.entries(responsesPorDia).map(([dia, count]) => ({ dia, count })),
          estadisticas_tiempo: {
            promedio: Math.round(tiempoPromedio),
            maximo: tiempoMaximo,
            minimo: tiempoMinimo,
            total_muestras: tiemposRespuesta.length
          }
        }
      });

    } catch (error) {
      console.error('Error obteniendo logs de responses:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Función auxiliar para leer archivos de log
   */
  static async leerArchivoLog(rutaArchivo) {
    try {
      const contenido = await fs.readFile(rutaArchivo, 'utf8');
      return contenido.split('\n').filter(linea => linea.trim() !== '');
    } catch (error) {
      console.warn(`No se pudo leer el archivo ${rutaArchivo}:`, error.message);
      return [];
    }
  }
}

export default LogsController;
