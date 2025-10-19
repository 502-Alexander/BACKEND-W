// Página pública para que los clientes agenden citas - Completamente Responsive
import { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import FormularioCitas from '../components/FormularioCitas/FormularioCitas'
//import './styles/AgendarCita.css'
import '../styles/AgendarCita.css'  

function AgendarCita() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [citaCreada, setCitaCreada] = useState(null)
  const { isMobile, isTablet, getPadding } = useResponsive()

  // Debug: Log del estado
  console.log('AgendarCita - mostrarFormulario:', mostrarFormulario)

  // Manejar cita creada
  const manejarCitaCreada = (cita) => {
    setCitaCreada(cita)
    setMostrarFormulario(false)
  }

  // Reiniciar proceso
  const reiniciarProceso = () => {
    setCitaCreada(null)
    setMostrarFormulario(false)
  }

  if (citaCreada) {
    return (
      <div className="agendar-cita-success">
        <div className="success-container">
          <div className="success-icon"></div>
          <h1>¡Cita Agendada Exitosamente!</h1>
          <p>Tu cita ha sido registrada en nuestro sistema.</p>
          
          <div className="cita-details">
            <h3>Detalles de tu cita:</h3>
            <div className="detail-item">
              <span className="detail-label">Cliente:</span>
              <span className="detail-value">{citaCreada.nombre}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Servicio:</span>
              <span className="detail-value">{citaCreada.servicio}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fecha:</span>
              <span className="detail-value">
                {new Date(citaCreada.fecha).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hora:</span>
              <span className="detail-value">{citaCreada.hora}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estado:</span>
              <span className="detail-value estado-pendiente">⏳ Pendiente de confirmación</span>
            </div>
          </div>
          
          <div className="success-actions">
            <button 
              className="btn btn-primary"
              onClick={reiniciarProceso}
            >
              Agendar Otra Cita
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/'}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="agendar-cita">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Agenda tu Cita en el Salón</h1>
          <p>Reserva tu cita de manera fácil y rápida. Selecciona el servicio que necesitas y elige la fecha y hora que mejor te convenga.</p>
          
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Servicios profesionales</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🕐</span>
              <span>Horarios flexibles</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Atención personalizada</span>
            </div>
          </div>
          
          <button 
            className="btn btn-primary btn-large"
            onClick={() => {
              console.log('Botón clickeado - mostrando formulario')
              setMostrarFormulario(true)
            }}
          >
            Agendar Cita Ahora
          </button>
        </div>
      </div>

      {/* Información del salón */}
      <div className="salon-info">
        <div className="container">
          <h2>Información del Salón</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3>Horarios de Atención</h3>
              <div className="info-content">
                <p><strong>Lunes a Sábado:</strong></p>
                <p>7:00 AM - 7:00 PM</p>
                <p><strong>Domingos:</strong> Cerrado</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Contacto</h3>
              <div className="info-content">
                <p><strong>Teléfono:</strong></p>
                <p>+502 4043-9206</p>
                <p><strong>Email:</strong></p>
                <p>salon@nuevatienda.com</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Ubicación</h3>
              <div className="info-content">
                <p><strong>Dirección:</strong></p>
                <p>Guatemala, Guatemala</p>
                <p><strong>Zona:</strong> Centro</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📋</div>
              <h3>Políticas</h3>
              <div className="info-content">
                <p><strong>Reservas:</strong></p>
                <p>Máximo 3 citas por día</p>
                <p><strong>Confirmación:</strong> Requerida</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Servicios disponibles */}
      <div className="servicios-section">
        <div className="container">
          <h2>Nuestros Servicios</h2>
          <div className="servicios-grid">
            <div className="servicio-card">
              <span className="servicio-icon">💇‍♀️</span>
              <h3>Corte y Peinado</h3>
              <p>Cortes modernos y peinados para todas las ocasiones</p>
            </div>
            
            <div className="servicio-card">
              <span className="servicio-icon">🎨</span>
              <h3>Tinte y Tratamiento</h3>
              <p>Coloración profesional y tratamientos capilares</p>
            </div>
            
            <div className="servicio-card">
              <span className="servicio-icon">💅</span>
              <h3>Manicure y Pedicure</h3>
              <p>Cuidado completo de manos y pies</p>
            </div>
            
            <div className="servicio-card">
              <span className="servicio-icon">✨</span>
              <h3>Peinado para Eventos</h3>
              <p>Peinados especiales para bodas y eventos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de citas */}
      {mostrarFormulario && (
        <div className="formulario-modal">
          {console.log('Renderizando modal - mostrarFormulario es true')}
          <div className="modal-overlay" onClick={() => setMostrarFormulario(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <FormularioCitas 
                onCitaCreada={manejarCitaCreada}
                onClose={() => setMostrarFormulario(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgendarCita
