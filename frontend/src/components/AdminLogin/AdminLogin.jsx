// Componente de login específico para administradores
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './AdminLogin.css'
function AdminLogin({ onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { loginAdmin, error, clearError } = useAuth()

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
      const result = await loginAdmin(formData.email, formData.password)
      
      if (result.success) {
        // Login exitoso, cerrar modal
        onClose()
      }
    } catch (error) {
      console.error('Error en login de administrador:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        {/* cabecera del modal */}
        <div className="admin-login-header">
          <div className="admin-icon">🔐</div>
          <h2 className="admin-login-title">Acceso Administrador</h2>
          <button 
            className="admin-login-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Formulario de login de administrador */}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {/* Campo de usuario */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Administrador
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="admin@salonsandra.com"
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
              placeholder="password"
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
            className={`btn btn-primary admin-login-submit ${loading ? 'loading' : ''}`}
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Verificando acceso...
              </>
            ) : (
              <>
                 Acceder al Dashboard
              </>
            )}
          </button>
        </form>

        {/* Enlaces adicionales */}
        <div className="admin-login-footer">
          <p className="admin-login-text">
            ¿Eres cliente?{' '}
            <button 
              className="admin-login-link"
              onClick={onSwitchToLogin}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
