// Servicio para gestión de clientes unificados
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

class ClienteService {
  // Obtener todos los clientes unificados
  async obtenerClientesUnificados() {
    try {
      const response = await axios.get(`${API_BASE_URL}/clientes/unificados`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo clientes unificados:', error);
      throw error;
    }
  }

  // Buscar clientes por criterios
  async buscarClientes(termino = '', tipo = 'todos') {
    try {
      console.log('🔍 Servicio: Buscando clientes con:', { termino, tipo });
      
      const params = new URLSearchParams();
      if (termino) params.append('termino', termino);
      if (tipo && tipo !== 'todos') params.append('tipo', tipo);

      const url = `${API_BASE_URL}/clientes/buscar?${params}`;
      console.log('🌐 URL de búsqueda:', url);

      const response = await axios.get(url);
      console.log('✅ Servicio: Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Servicio: Error buscando clientes:', error);
      console.error('❌ Servicio: Detalles del error:', error.response?.data);
      throw error;
    }
  }

  // Obtener historial de citas de un cliente
  async obtenerHistorialCliente(nombre, apellidos, telefono) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/clientes/${encodeURIComponent(nombre)}/${encodeURIComponent(apellidos)}/${encodeURIComponent(telefono)}/historial`
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo historial del cliente:', error);
      throw error;
    }
  }

  // Obtener estadísticas de un cliente
  async obtenerEstadisticasCliente(nombre, apellidos, telefono) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/clientes/${encodeURIComponent(nombre)}/${encodeURIComponent(apellidos)}/${encodeURIComponent(telefono)}/estadisticas`
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas del cliente:', error);
      throw error;
    }
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Formatear fecha y hora para mostrar
  formatearFechaHora(fecha, hora) {
    if (!fecha) return 'N/A';
    const fechaCompleta = new Date(`${fecha}T${hora}`);
    return fechaCompleta.toLocaleString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calcular días desde la última cita
  calcularDiasDesdeUltimaCita(fechaUltimaCita) {
    if (!fechaUltimaCita) return 'N/A';
    const hoy = new Date();
    const ultimaCita = new Date(fechaUltimaCita);
    const diferencia = hoy - ultimaCita;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `${dias} días`;
    if (dias < 30) return `${Math.floor(dias / 7)} semanas`;
    return `${Math.floor(dias / 30)} meses`;
  }

  // Obtener color del tipo de cliente
  obtenerColorTipoCliente(tipo) {
    switch (tipo) {
      case 'Frecuente':
        return '#10b981'; // Verde
      case 'Nuevo':
        return '#3b82f6'; // Azul
      default:
        return '#6b7280'; // Gris
    }
  }

  // Obtener icono del tipo de cliente
  obtenerIconoTipoCliente(tipo) {
    switch (tipo) {
      case 'Frecuente':
        return '⭐';
      case 'Nuevo':
        return '🆕';
      default:
        return '👤';
    }
  }

  // Obtener clientes nuevos por período
  async obtenerClientesNuevos(periodo = 'mes') {
    try {
      const response = await axios.get(`${API_BASE_URL}/clientes/estadisticas/nuevos`, {
        params: { periodo }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo clientes nuevos:', error);
      throw error;
    }
  }

  // Obtener clientes frecuentes
  async obtenerClientesFrecuentes(limite = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/clientes/estadisticas/frecuentes`, {
        params: { limite }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo clientes frecuentes:', error);
      throw error;
    }
  }

  // Obtener estadísticas generales
  async obtenerEstadisticasGenerales() {
    try {
      const response = await axios.get(`${API_BASE_URL}/clientes/estadisticas/generales`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas generales:', error);
      throw error;
    }
  }
}

export default new ClienteService();
