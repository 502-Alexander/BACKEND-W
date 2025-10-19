// Componente de login para usuarios y administradores
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

function Login({ onClose, onSwitchToRegistro, onSwitchToAdmin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { login, error, clearError } = useAuth()

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      clearError()
    }
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return
    }

    setLoading(true)
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Login exitoso, cerrar modal
        onClose()
      }
    } catch (error) {
      console.error('Error en login:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-overlay">
      <div className="login-modal">
        {/* Header del modal */}
        <div className="login-header">
          <h2 className="login-title">Iniciar Sesión</h2>
          <button 
            className="login-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            
          </button>
        </div>

        {/* Formulario de login */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo de email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          {/* Campo de contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Tu contraseña"
              required
              disabled={loading}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className={`btn btn-primary login-submit ${loading ? 'loading' : ''}`}
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Enlaces adicionales */}
        <div className="login-footer">
          <p className="login-text">
            ¿No tienes cuenta?{' '}
            <button 
              className="login-link"
              onClick={onSwitchToRegistro}
            >
              Regístrate aquí
            </button>
          </p>
          
          <div className="login-divider">
            <span>o</span>
          </div>
          
          <button 
            className="btn btn-outline login-admin-btn"
            onClick={onSwitchToAdmin}
          >
            Acceso Administrador
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
