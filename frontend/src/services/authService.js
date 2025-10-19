// Servicio para manejar las operaciones de autenticación con el backend
import axios from 'axios'

// Configuración base de axios
const API_BASE_URL = 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token automáticamente a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Servicio de autenticación
export const authService = {
  // Registro de usuarios
  async registro(nombre, email, password) {
    try {
      const response = await api.post('/auth/registro', {
        nombre,
        email,
        password
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al registrarse')
    }
  },

  // Login de usuarios normales
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión')
    }
  },

  // Login de administrador
  async loginAdmin(email, password) {
    try {
      const response = await api.post('/auth/admin-login', {
        email,
        password
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión como administrador')
    }
  },

  // Verificar token
  async verificarToken(token) {
    try {
      const response = await api.get('/auth/verificar', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw new Error('Token inválido')
    }
  }
}
