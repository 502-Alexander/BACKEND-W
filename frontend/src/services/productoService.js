// Servicio para manejar las operaciones de productos con el backend
import axios from 'axios'

// Configuración base de axios
const API_BASE_URL = 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Servicio de productos
export const productoService = {
  // Obtener todos los productos
  async obtenerProductos() {
    try {
      const response = await api.get('/productos')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener productos')
    }
  },

  // Obtener un producto por ID
  async obtenerProducto(id) {
    try {
      const response = await api.get(`/productos/${id}`)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener el producto')
    }
  },

  // Obtener categorías
  async obtenerCategorias() {
    try {
      const response = await api.get('/categorias')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener categorías')
    }
  }
}
