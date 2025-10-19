// Servicio para gestión de inventario
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

class InventarioService {
  
  // Obtener inventario completo
  static async obtenerInventarioCompleto() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo inventario:', error);
      throw error;
    }
  }

  // Obtener estadísticas de inventario
  static async obtenerEstadisticasInventario() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // Obtener movimientos de un producto
  static async obtenerMovimientosProducto(productoId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/${productoId}/movimientos`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo movimientos:', error);
      throw error;
    }
  }

  // Registrar movimiento de inventario
  static async registrarMovimiento(datosMovimiento) {
    try {
      const response = await axios.post(`${API_BASE_URL}/inventario/movimiento`, datosMovimiento);
      return response.data;
    } catch (error) {
      console.error('Error registrando movimiento:', error);
      throw error;
    }
  }

  // Actualizar stock mínimo
  static async actualizarStockMinimo(inventarioId, stockMinimo) {
    try {
      const response = await axios.put(`${API_BASE_URL}/inventario/stock-minimo`, {
        inventario_id: inventarioId,
        stock_minimo: stockMinimo
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando stock mínimo:', error);
      throw error;
    }
  }

  // Eliminar producto del inventario
  static async eliminarProductoInventario(productoId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/inventario/${productoId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  }
}

export default InventarioService;
