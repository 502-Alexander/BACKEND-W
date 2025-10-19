// Componente de alertas de stock - Completamente Responsive
import { useState, useEffect } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import stockService from '../../services/stockService'
import './AlertasStock.css'

function AlertasStock() {
  const [alertas, setAlertas] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroAlerta, setFiltroAlerta] = useState('todas') // todas, critico, bajo, vencimiento
  
  const { isMobile, isTablet, getPadding } = useResponsive()

  // Cargar alertas al montar el componente
  useEffect(() => {
    cargarAlertas()
    
    // Actualizar alertas cada 30 segundos
    const interval = setInterval(cargarAlertas, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Cargar alertas desde el backend
  const cargarAlertas = async () => {
    try {
      setLoading(true)
      const response = await stockService.getStockAlerts()
      setAlertas(response.data)
      setError(null)
    } catch (err) {
      setError('Error al cargar las alertas')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar alertas según el tipo seleccionado
  const alertasFiltradas = () => {
    switch (filtroAlerta) {
      case 'critico':
        return alertas.stockCritico || []
      case 'bajo':
        return alertas.stockBajo || []
      case 'vencimiento':
        return alertas.proximoVencimiento || []
      default:
        return [
          ...(alertas.stockCritico || []),
          ...(alertas.stockBajo || []),
          ...(alertas.proximoVencimiento || [])
        ]
    }
  }

  // Obtener icono según el tipo de alerta
  const obtenerIcono = (tipo) => {
    switch (tipo) {
      case 'critico':
        return '🚨'
      case 'bajo':
        return '⚠️'
      case 'vencimiento':
        return '⏰'
      default:
        return '📦'
    }
  }

  // Obtener color según el tipo de alerta
  const obtenerColor = (tipo) => {
    switch (tipo) {
      case 'critico':
        return '#dc3545'
      case 'bajo':
        return '#ffc107'
      case 'vencimiento':
        return '#17a2b8'
      default:
        return '#6c757d'
    }
  }

  // Obtener tipo de alerta para un item
  const obtenerTipoAlerta = (item) => {
    if (item.alertas.stockCritico) return 'critico'
    if (item.alertas.stockBajo) return 'bajo'
    if (item.alertas.proximoVencimiento) return 'vencimiento'
    return 'normal'
  }

  // Obtener mensaje de alerta
  const obtenerMensaje = (item, tipo) => {
    switch (tipo) {
      case 'critico':
        return `Stock crítico: ${item.stockActual} unidades (mínimo: ${item.stockMinimo})`
      case 'bajo':
        return `Stock bajo: ${item.stockActual} unidades (mínimo: ${item.stockMinimo})`
      case 'vencimiento':
        return `Producto próximo a vencer`
      default:
        return 'Sin alertas'
    }
  }

  // Obtener prioridad de la alerta
  const obtenerPrioridad = (tipo) => {
    switch (tipo) {
      case 'critico':
        return 1
      case 'bajo':
        return 2
      case 'vencimiento':
        return 3
      default:
        return 4
    }
  }

  if (loading) {
    return (
      <div className="alertas-stock-loading">
        <div className="spinner"></div>
        <p>Cargando alertas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alertas-stock-error">
        <div className="error-icon">❌</div>
        <h3>Error al cargar alertas</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={cargarAlertas}>
          Reintentar
        </button>
      </div>
    )
  }

  const alertasFiltradasData = alertasFiltradas()
  const totalAlertas = alertas.total || 0

  return (
    <div className="alertas-stock">
      {/* Header */}
      <div className="alertas-header">
        <div className="header-info">
          <h2>🚨 Alertas de Stock</h2>
          <p>Monitoreo en tiempo real del inventario</p>
        </div>
        <div className="header-stats">
          <div className="stat-total">
            <span className="stat-number">{totalAlertas}</span>
            <span className="stat-label">Alertas Activas</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="alertas-filtros">
        <div className="filtro-container">
          <label>Filtrar por tipo:</label>
          <select 
            value={filtroAlerta} 
            onChange={(e) => setFiltroAlerta(e.target.value)}
          >
            <option value="todas">Todas las alertas</option>
            <option value="critico">Stock Crítico</option>
            <option value="bajo">Stock Bajo</option>
            <option value="vencimiento">Próximo Vencimiento</option>
          </select>
        </div>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={cargarAlertas}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Resumen de alertas */}
      {totalAlertas > 0 && (
        <div className="alertas-resumen">
          <div className="resumen-grid">
            {alertas.stockCritico?.length > 0 && (
              <div className="resumen-item critico">
                <div className="resumen-icon">🚨</div>
                <div className="resumen-info">
                  <h4>Stock Crítico</h4>
                  <p>{alertas.stockCritico.length} productos</p>
                </div>
              </div>
            )}
            {alertas.stockBajo?.length > 0 && (
              <div className="resumen-item bajo">
                <div className="resumen-icon">⚠️</div>
                <div className="resumen-info">
                  <h4>Stock Bajo</h4>
                  <p>{alertas.stockBajo.length} productos</p>
                </div>
              </div>
            )}
            {alertas.proximoVencimiento?.length > 0 && (
              <div className="resumen-item vencimiento">
                <div className="resumen-icon">⏰</div>
                <div className="resumen-info">
                  <h4>Próximo Vencimiento</h4>
                  <p>{alertas.proximoVencimiento.length} productos</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de alertas */}
      <div className="alertas-lista">
        {alertasFiltradasData.length === 0 ? (
          <div className="alertas-vacias">
            <div className="vacio-icon">✅</div>
            <h3>¡Excelente!</h3>
            <p>No hay alertas activas en este momento</p>
          </div>
        ) : (
          <div className="alertas-grid">
            {alertasFiltradasData
              .sort((a, b) => obtenerPrioridad(obtenerTipoAlerta(a)) - obtenerPrioridad(obtenerTipoAlerta(b)))
              .map((item) => {
                const tipo = obtenerTipoAlerta(item)
                const color = obtenerColor(tipo)
                const icono = obtenerIcono(tipo)
                const mensaje = obtenerMensaje(item, tipo)
                
                return (
                  <div 
                    key={item.id} 
                    className={`alerta-item ${tipo}`}
                    style={{ borderLeftColor: color }}
                  >
                    <div className="alerta-icon" style={{ color }}>
                      {icono}
                    </div>
                    <div className="alerta-content">
                      <div className="alerta-header">
                        <h4 className="alerta-titulo">{item.nombre}</h4>
                        <span className="alerta-tipo" style={{ color }}>
                          {tipo.toUpperCase()}
                        </span>
                      </div>
                      <p className="alerta-mensaje">{mensaje}</p>
                      <div className="alerta-details">
                        <span className="alerta-categoria">{item.categoria}</span>
                        <span className="alerta-proveedor">{item.proveedor}</span>
                        <span className="alerta-ubicacion">{item.ubicacion}</span>
                      </div>
                    </div>
                    <div className="alerta-actions">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => console.log('Reabastecer:', item.id)}
                      >
                        📦 Reabastecer
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Acciones rápidas */}
      {totalAlertas > 0 && (
        <div className="alertas-acciones">
          <h3>Acciones Rápidas</h3>
          <div className="acciones-grid">
            <button 
              className="btn btn-primary"
              onClick={() => console.log('Generar reporte de alertas')}
            >
              📊 Generar Reporte
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => console.log('Enviar alertas por email')}
            >
              📧 Enviar por Email
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => console.log('Crear orden de compra')}
            >
              🛒 Crear Orden
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertasStock
