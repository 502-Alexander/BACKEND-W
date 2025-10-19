// Servicio para manejar las operaciones de servicios con el backend
import axios from 'axios'

// Configuración base de axios
const API_BASE_URL = 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Servicio de servicios
export const servicioService = {
  // Obtener todos los servicios
  async obtenerServicios() {
    try {
      const response = await api.get('/servicios')
      return response.data.data || []
    } catch (error) {
      console.error('Error obteniendo servicios:', error.message)
      return []
    }
  },

  // Obtener servicio por ID
  async obtenerServicioPorId(id) {
    try {
      const response = await api.get(`/servicios/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo servicio:', error.message)
      return null
    }
  },

  // Obtener todos los combos
  async obtenerCombos() {
    try {
      const response = await api.get('/servicios/combos')
      return response.data.data || []
    } catch (error) {
      console.error('Error obteniendo combos:', error.message)
      return []
    }
  },

  // Obtener combo por ID
  async obtenerComboPorId(id) {
    try {
      const response = await api.get(`/servicios/combos/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo combo:', error.message)
      return null
    }
  },

  // Crear servicio (solo admin)
  async crearServicio(servicioData) {
    try {
      const response = await api.post('/servicios', servicioData)
      return response.data
    } catch (error) {
      console.error('Error creando servicio:', error.message)
      throw error
    }
  },

  // Crear combo (solo admin)
  async crearCombo(comboData) {
    try {
      const response = await api.post('/servicios/combos', comboData)
      return response.data
    } catch (error) {
      console.error('Error creando combo:', error.message)
      throw error
    }
  },

  // Actualizar servicio (solo admin)
  async actualizarServicio(id, servicioData) {
    try {
      const response = await api.put(`/servicios/${id}`, servicioData)
      return response.data
    } catch (error) {
      console.error('Error actualizando servicio:', error.message)
      throw error
    }
  },

  // Actualizar combo (solo admin)
  async actualizarCombo(id, comboData) {
    try {
      const response = await api.put(`/servicios/combos/${id}`, comboData)
      return response.data
    } catch (error) {
      console.error('Error actualizando combo:', error.message)
      throw error
    }
  },

  // Eliminar servicio (solo admin)
  async eliminarServicio(id) {
    try {
      const response = await api.delete(`/servicios/${id}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando servicio:', error.message)
      throw error
    }
  },

  // Eliminar combo (solo admin)
  async eliminarCombo(id) {
    try {
      const response = await api.delete(`/servicios/combos/${id}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando combo:', error.message)
      throw error
    }
  }
}

export default servicioService



