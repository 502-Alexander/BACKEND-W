// Servicio para reportes y estadísticas de productos
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

class ProductoReportesService {
  
  // Obtener estadísticas generales
  static async obtenerEstadisticasGenerales() {
    try {
      const response = await axios.get(`${API_BASE_URL}/productos/reportes/estadisticas-generales`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas generales:', error);
      throw error;
    }
  }

  // Obtener productos más vendidos
  static async obtenerProductosMasVendidos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/productos/reportes/mas-vendidos`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos más vendidos:', error);
      throw error;
    }
  }

  // Obtener distribución por categorías
  static async obtenerDistribucionCategorias() {
    try {
      const response = await axios.get(`${API_BASE_URL}/productos/reportes/distribucion-categorias`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo distribución por categorías:', error);
      throw error;
    }
  }

  // Obtener productos con stock bajo
  static async obtenerProductosStockBajo() {
    try {
      const response = await axios.get(`${API_BASE_URL}/productos/reportes/stock-bajo`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos con stock bajo:', error);
      throw error;
    }
  }

  // Obtener análisis de precios
  static async obtenerAnalisisPrecios() {
    try {
      const response = await axios.get(`${API_BASE_URL}/productos/reportes/analisis-precios`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo análisis de precios:', error);
      throw error;
    }
  }
}

export default ProductoReportesService;
