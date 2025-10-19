// Servicio para manejar las operaciones del carrito con el backend
import axios from 'axios'

// Configuración base de axios
const API_BASE_URL = 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Función para normalizar datos del carrito
const normalizarItemCarrito = (item) => ({
  producto_id: item.producto_id,
  nombre: item.nombre,
  marca: item.marca || '',
  precio_unitario: parseFloat(item.precio_unitario || item.precio || 0),
  imagen: item.imagen || item.foto1 || '/images/producto-default.svg',
  cantidad: parseInt(item.cantidad || 0),
  subtotal: parseFloat(item.subtotal || 0),
  stock_actual: parseInt(item.stock_actual || item.stock || 0),
  stock_minimo: parseInt(item.stock_minimo || 0),
  activo: Boolean(item.activo !== false)
})

// Servicio del carrito
export const carritoService = {
  // Obtener todos los items del carrito de un usuario
  async obtenerCarrito(usuarioId) {
    try {
      const response = await api.get(`/carrito/${usuarioId}`)
      const data = response.data.data || { items: [], total: 0, cantidad: 0 }
      
      // Normalizar items del carrito
      const itemsNormalizados = data.items.map(normalizarItemCarrito)
      
      return {
        ...data,
        items: itemsNormalizados,
        total: parseFloat(data.total || 0),
        cantidad: parseInt(data.cantidad || 0)
      }
    } catch (error) {
      console.log('Error obteniendo carrito:', error.message)
      return { items: [], total: 0, cantidad: 0 }
    }
  },

  // Agregar producto al carrito
  async agregarAlCarrito(usuarioId, productoId, cantidad = 1) {
    try {
      const response = await api.post(`/carrito/${usuarioId}/agregar`, {
        producto_id: productoId,
        cantidad: cantidad
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al agregar producto al carrito')
    }
  },

  // Actualizar cantidad de un item en el carrito
  async actualizarCantidad(usuarioId, productoId, cantidad) {
    try {
      const response = await api.put(`/carrito/${usuarioId}/${productoId}`, {
        cantidad: cantidad
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al actualizar cantidad')
    }
  },

  // Eliminar producto del carrito
  async eliminarDelCarrito(usuarioId, productoId) {
    try {
      const response = await api.delete(`/carrito/${usuarioId}/${productoId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al eliminar producto del carrito')
    }
  },

  // Vaciar todo el carrito
  async vaciarCarrito(usuarioId) {
    try {
      const response = await api.delete(`/carrito/${usuarioId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al vaciar el carrito')
    }
  },

  // Obtener resumen del carrito para checkout
  async obtenerResumenCarrito(usuarioId) {
    try {
      const response = await api.get(`/carrito/${usuarioId}/resumen`)
      const data = response.data.data || { items: [], subtotal: 0, envio: 50, impuestos: 0, total: 50 }
      
      // Normalizar items del resumen
      const itemsNormalizados = data.items.map(normalizarItemCarrito)
      
      return {
        ...data,
        items: itemsNormalizados,
        subtotal: parseFloat(data.subtotal || 0),
        envio: parseFloat(data.envio || 50),
        impuestos: parseFloat(data.impuestos || 0),
        total: parseFloat(data.total || 50),
        faltante_envio_gratis: parseFloat(data.faltante_envio_gratis || 0)
      }
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener resumen del carrito')
    }
  },

  // Procesar checkout
  async procesarCheckout(usuarioId, datosCheckout = {}) {
    try {
      const response = await api.post(`/carrito/${usuarioId}/checkout`, datosCheckout)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al procesar el checkout')
    }
  }
}
