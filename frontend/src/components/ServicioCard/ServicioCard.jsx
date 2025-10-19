// Componente para mostrar tarjetas de servicios y combos
import { Link } from 'react-router-dom'
import './ServicioCard.css'

function ServicioCard({ servicio }) {
  const esCombo = servicio.tipo === 'combo'
  const tieneDescuento = servicio.precio_original && servicio.precio_original > (servicio.precio_base || servicio.precio)

  return (
    <div className={`servicio-card ${esCombo ? 'combo-card' : ''}`}>
      {/* Badge de descuento para combos */}
      {tieneDescuento && (
        <div className="descuento-badge">
          <span className="descuento-text">
            -{Math.round(((servicio.precio_original - (servicio.precio_base || servicio.precio)) / servicio.precio_original) * 100)}%
          </span>
        </div>
      )}

      {/* Contenido de la tarjeta */}
      <div className="servicio-content">
        {/* Header */}
        <div className="servicio-header">
          <div className="servicio-icon">
            {esCombo ? '🎁' : '💇‍♀️'}
          </div>
          <div className="servicio-tipo">
            {esCombo ? 'Combo' : 'Servicio'}
          </div>
        </div>

        {/* Información principal */}
        <div className="servicio-info">
          <h3 className="servicio-nombre">{servicio.nombre}</h3>
          <p className="servicio-descripcion">{servicio.descripcion}</p>
          
          {/* Servicios incluidos en combos */}
          {esCombo && servicio.servicios_incluidos && servicio.servicios_incluidos.length > 0 && (
            <div className="servicios-incluidos">
              <h4>Incluye:</h4>
              <ul>
                {servicio.servicios_incluidos.map((servicioIncluido, index) => (
                  <li key={index}>• {servicioIncluido}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Duración */}
          <div className="servicio-duracion">
            <span className="duracion-icon">⏱️</span>
            <span className="duracion-text">{servicio.duracion}</span>
          </div>
        </div>

        {/* Precio */}
        <div className="servicio-precio">
          {tieneDescuento ? (
            <div className="precio-con-descuento">
              <span className="precio-original">Q{servicio.precio_original?.toLocaleString()}</span>
              <span className="precio-actual">Q{(servicio.precio_base || servicio.precio).toLocaleString()}</span>
            </div>
          ) : (
            <span className="precio-normal">Q{(servicio.precio_base || servicio.precio).toLocaleString()}</span>
          )}
        </div>

        {/* Acciones */}
        <div className="servicio-acciones">
          <Link 
              to={`/agendar-cita?servicio=${servicio.id}`}
            className="btn btn-primary btn-full"
          >
            Agendar Cita
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServicioCard
