// Servicio para gestión de stock
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Obtener todo el stock
export const getStock = async () => {
  try {
    const response = await axios.get(`${API_URL}/stock`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener stock:', error);
    throw error;
  }
};

// Obtener item de stock por ID
export const getStockItem = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stock/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener item de stock:', error);
    throw error;
  }
};

// Crear nuevo item de stock
export const createStockItem = async (stockData) => {
  try {
    const response = await axios.post(`${API_URL}/stock`, stockData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al crear item de stock:', error);
    throw error;
  }
};

// Actualizar item de stock
export const updateStockItem = async (id, stockData) => {
  try {
    const response = await axios.put(`${API_URL}/stock/${id}`, stockData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar item de stock:', error);
    throw error;
  }
};

// Eliminar item de stock
export const deleteStockItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/stock/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al eliminar item de stock:', error);
    throw error;
  }
};

// Obtener alertas de stock
export const getStockAlerts = async () => {
  try {
    const response = await axios.get(`${API_URL}/stock/alertas`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener alertas de stock:', error);
    throw error;
  }
};

// Actualizar stock (entrada/salida)
export const updateStockMovement = async (id, movementData) => {
  try {
    const response = await axios.post(`${API_URL}/stock/${id}/movimiento`, movementData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar movimiento de stock:', error);
    throw error;
  }
};

// Obtener estadísticas de stock
export const getStockStatistics = async () => {
  try {
    const response = await axios.get(`${API_URL}/stock/estadisticas`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de stock:', error);
    throw error;
  }
};

export default {
  getStock,
  getStockItem,
  createStockItem,
  updateStockItem,
  deleteStockItem,
  getStockAlerts,
  updateStockMovement,
  getStockStatistics
};
