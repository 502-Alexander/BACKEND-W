// Servicio para reportes de servicios
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

class ServicioReportesService {
  // Obtener estadísticas generales de servicios
  static async obtenerEstadisticasGenerales() {
    try {
      const response = await axios.get(`${API_BASE_URL}/servicios/reportes/estadisticas-generales`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de servicios:', error);
      throw error;
    }
  }

  // Obtener servicios más solicitados
  static async obtenerServiciosMasSolicitados(limite = 10, periodo = 'todos') {
    try {
      const response = await axios.get(`${API_BASE_URL}/servicios/reportes/mas-solicitados`, {
        params: { limite, periodo }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo servicios más solicitados:', error);
      throw error;
    }
  }

  // Obtener distribución de servicios por período
  static async obtenerDistribucionServicios(periodo = 'mes') {
    try {
      const response = await axios.get(`${API_BASE_URL}/servicios/reportes/distribucion`, {
        params: { periodo }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo distribución de servicios:', error);
      throw error;
    }
  }

  // Obtener análisis de precios de servicios
  static async obtenerAnalisisPrecios() {
    try {
      const response = await axios.get(`${API_BASE_URL}/servicios/reportes/analisis-precios`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo análisis de precios:', error);
      throw error;
    }
  }

  // Obtener servicios por tipo de cliente
  static async obtenerServiciosPorTipoCliente() {
    try {
      const response = await axios.get(`${API_BASE_URL}/servicios/reportes/por-tipo-cliente`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo servicios por tipo de cliente:', error);
      throw error;
    }
  }
}

export default ServicioReportesService;
