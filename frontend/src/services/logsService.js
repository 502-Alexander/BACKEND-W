import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

class LogsService {
  /**
   * Obtener estadísticas generales de todos los logs
   */
  static async obtenerEstadisticasGenerales() {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs/estadisticas-generales`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas generales de logs:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis de logs de autenticación
   */
  static async obtenerLogsAuth() {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs/auth`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo logs de auth:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis de logs de errores
   */
  static async obtenerLogsErrores() {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs/errores`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo logs de errores:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis de logs de requests
   */
  static async obtenerLogsRequests() {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs/requests`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo logs de requests:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis de logs de responses
   */
  static async obtenerLogsResponses() {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs/responses`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo logs de responses:', error);
      throw error;
    }
  }
}

export default LogsService;
