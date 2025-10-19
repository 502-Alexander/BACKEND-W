import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Configurar axios con headers por defecto
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Obtener todas las ventas
export const getVentas = async () => {
  try {
    console.log('📊 Obteniendo ventas...');
    const response = await api.get('/ventas');
    console.log('✅ Ventas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo ventas:', error);
    throw error;
  }
};

// Obtener ventas por rango de fechas
export const getVentasPorFecha = async (fechaInicio, fechaFin) => {
  try {
    console.log('📅 Obteniendo ventas por fecha:', fechaInicio, 'a', fechaFin);
    const response = await api.get('/ventas/por-fecha', {
      params: { fechaInicio, fechaFin }
    });
    console.log('✅ Ventas por fecha obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo ventas por fecha:', error);
    throw error;
  }
};

// Obtener detalles de una venta
export const getDetallesVenta = async (ventaId) => {
  try {
    console.log('🔍 Obteniendo detalles de venta:', ventaId);
    const response = await api.get(`/ventas/${ventaId}/detalles`);
    console.log('✅ Detalles obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo detalles:', error);
    throw error;
  }
};

// Crear nueva venta
export const crearVenta = async (ventaData) => {
  try {
    console.log('💰 Creando nueva venta...');
    console.log('📦 Datos de la venta:', ventaData);
    
    const response = await api.post('/ventas', ventaData);
    console.log('✅ Venta creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando venta:', error);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', error.response.data);
    }
    throw error;
  }
};

// Obtener estadísticas de ventas
export const getEstadisticasVentas = async (periodo) => {
  try {
    console.log('📈 Obteniendo estadísticas para periodo:', periodo);
    const response = await api.get(`/ventas/estadisticas/${periodo}`);
    console.log('✅ Estadísticas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error;
  }
};

// Obtener top productos más vendidos
export const getTopProductos = async (periodo, limite = 5) => {
  try {
    console.log('🏆 Obteniendo top productos para periodo:', periodo);
    const response = await api.get(`/ventas/top-productos/${periodo}`, {
      params: { limite }
    });
    console.log('✅ Top productos obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo top productos:', error);
    throw error;
  }
};

// Obtener top categorías más vendidas
export const getTopCategorias = async (periodo) => {
  try {
    console.log('📊 Obteniendo top categorías para periodo:', periodo);
    const response = await api.get(`/ventas/top-categorias/${periodo}`);
    console.log('✅ Top categorías obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo top categorías:', error);
    throw error;
  }
};

// Funciones auxiliares para formatear datos
export const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-GT');
};

export const formatearHora = (hora) => {
  return hora.substring(0, 5); // HH:MM
};

export const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ'
  }).format(cantidad);
};

export default {
  getVentas,
  getVentasPorFecha,
  getDetallesVenta,
  crearVenta,
  getEstadisticasVentas,
  getTopProductos,
  getTopCategorias,
  formatearFecha,
  formatearHora,
  formatearMoneda
};
