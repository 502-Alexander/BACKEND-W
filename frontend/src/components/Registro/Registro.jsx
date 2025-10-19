// Componente de registro para nuevos usuarios
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
//import './styles/Registro.css'
import './Registro.css'

function Registro({ onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { registro, error, clearError } = useAuth()

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error específico del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Limpiar error general
    if (error) {
      clearError()
    }
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      const result = await registro(formData.nombre, formData.email, formData.password)
      
      if (result.success) {
        if (result.necesitaVerificacion) {
          // Mostrar mensaje de verificación
          alert(result.mensaje)
          // Cerrar modal después de mostrar el mensaje
          setTimeout(() => {
            onClose()
          }, 2000)
        } else {
          // Registro exitoso, cerrar modal
          onClose()
        }
      }
    } catch (error) {
      console.error('Error en registro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="registro-overlay">
      <div className="registro-modal">
        {/* Header del modal */}
        <div className="registro-header">
          <h2 className="registro-title">Crear Cuenta</h2>
          <button 
            className="registro-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
          
          </button>
        </div>

        {/* Formulario de registro */}
        <form className="registro-form" onSubmit={handleSubmit}>
          {/* Campo de nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              placeholder="Tu nombre completo"
              required
              disabled={loading}
            />
            {errors.nombre && (
              <span className="field-error">{errors.nombre}</span>
            )}
          </div>

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
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
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
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Mensaje de error general */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className={`btn btn-primary registro-submit ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Footer del modal */}
        <div className="registro-footer">
          <p className="registro-text">
            ¿Ya tienes cuenta?{' '}
            <button 
              className="registro-link"
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

export default Registro
