// Componente mejorado de gestión de clientes con integración de citas
import React, { useState, useEffect } from 'react';
import clienteService from '../../services/clienteService';
import GraficasClientes from './GraficasClientes';
import './GestionClientes.css';

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [historialCliente, setHistorialCliente] = useState([]);
  const [estadisticasCliente, setEstadisticasCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('lista'); // 'lista' o 'graficas'

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  // Cargar clientes unificados
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await clienteService.obtenerClientesUnificados();
      setClientes(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar clientes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes
  const buscarClientes = async (terminoBusqueda = busqueda, tipoFiltro = filtroTipo) => {
    try {
      console.log('🔍 Buscando clientes con:', { terminoBusqueda, tipoFiltro });
      setLoading(true);
      const response = await clienteService.buscarClientes(terminoBusqueda, tipoFiltro);
      console.log('✅ Respuesta de búsqueda:', response);
      setClientes(response.data);
      setError(null);
    } catch (err) {
      console.error('❌ Error buscando clientes:', err);
      setError('Error al buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  // Ver detalles de un cliente
  const verDetallesCliente = async (cliente) => {
    try {
      setClienteSeleccionado(cliente);
      setMostrarDetalles(true);
      
      // Cargar historial y estadísticas
      const [historialResponse, estadisticasResponse] = await Promise.all([
        clienteService.obtenerHistorialCliente(cliente.nombre, cliente.apellidos, cliente.telefono),
        clienteService.obtenerEstadisticasCliente(cliente.nombre, cliente.apellidos, cliente.telefono)
      ]);
      
      setHistorialCliente(historialResponse.data);
      setEstadisticasCliente(estadisticasResponse.data);
    } catch (err) {
      console.error('Error cargando detalles del cliente:', err);
      setError('Error al cargar detalles del cliente');
    }
  };

  // Cerrar detalles del cliente
  const cerrarDetalles = () => {
    setMostrarDetalles(false);
    setClienteSeleccionado(null);
    setHistorialCliente([]);
    setEstadisticasCliente(null);
  };

  // Manejar búsqueda
  const manejarBusqueda = (e) => {
    e.preventDefault();
    console.log('🔍 Formulario enviado:', { busqueda, filtroTipo });
    buscarClientes(busqueda, filtroTipo);
  };

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    console.log('🗑️ Limpiando búsqueda');
    setBusqueda('');
    setFiltroTipo('todos');
    // Usar setTimeout para asegurar que el estado se actualice antes de buscar
    setTimeout(() => {
      cargarClientes();
    }, 100);
  };

  if (loading && clientes.length === 0) {
    return (
      <div className="gestion-clientes-loading">
        <div className="spinner"></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="gestion-clientes">
      <div className="gestion-clientes-header">
        <h2>👥 Gestión de Clientes</h2>
        <p>Administra la información de tus clientes y su historial de citas</p>
      </div>

      {/* Pestañas de navegación */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${vistaActiva === 'lista' ? 'active' : ''}`}
            onClick={() => setVistaActiva('lista')}
          >
            📋 Lista de Clientes
          </button>
          <button 
            className={`tab ${vistaActiva === 'graficas' ? 'active' : ''}`}
            onClick={() => setVistaActiva('graficas')}
          >
            📊 Gráficas y Estadísticas
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {vistaActiva === 'graficas' ? (
        <GraficasClientes />
      ) : (
        <>
          {/* Barra de búsqueda */}
          <div className="busqueda-container">
            <form onSubmit={manejarBusqueda} className="busqueda-form">
              <div className="busqueda-inputs">
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o correo..."
                  value={busqueda}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setBusqueda(valor);
                    // Búsqueda automática después de escribir (con debounce)
                    clearTimeout(window.busquedaTimeout);
                    window.busquedaTimeout = setTimeout(() => {
                      if (valor.trim() === '') {
                        cargarClientes();
                      } else {
                        buscarClientes(valor, filtroTipo);
                      }
                    }, 500);
                  }}
                  className="busqueda-input"
                />
                <select
                  value={filtroTipo}
                  onChange={(e) => {
                    console.log('🔄 Cambiando filtro a:', e.target.value);
                    const nuevoFiltro = e.target.value;
                    setFiltroTipo(nuevoFiltro);
                    // Ejecutar búsqueda automáticamente al cambiar filtro
                    setTimeout(() => {
                      if (busqueda.trim() === '') {
                        cargarClientes();
                      } else {
                        buscarClientes(busqueda, nuevoFiltro);
                      }
                    }, 100);
                  }}
                  className="filtro-select"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="Nuevo">Clientes nuevos</option>
                  <option value="Frecuente">Clientes frecuentes</option>
                </select>
                <button type="submit" className="btn-buscar" disabled={loading}>
                  {loading ? '⏳ Buscando...' : '🔍 Buscar'}
                </button>
                <button type="button" onClick={limpiarBusqueda} className="btn-limpiar" disabled={loading}>
                  🗑️ Limpiar
                </button>
              </div>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
              <button onClick={cargarClientes} className="btn-reintentar">
                🔄 Reintentar
              </button>
            </div>
          )}

          {/* Lista de clientes */}
          <div className="clientes-grid">
            {clientes.length === 0 && !loading ? (
              <div className="sin-resultados">
                <div className="sin-resultados-icon">🔍</div>
                <h3>No se encontraron clientes</h3>
                <p>
                  {busqueda.trim() !== '' 
                    ? `No hay clientes que coincidan con "${busqueda}"`
                    : 'No hay clientes registrados'
                  }
                </p>
                {busqueda.trim() !== '' && (
                  <button onClick={limpiarBusqueda} className="btn-limpiar-busqueda">
                    🗑️ Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              clientes.map((cliente) => (
                <div key={cliente.id} className="cliente-card">
                  <div className="cliente-header">
                    <div className="cliente-foto">
                      {cliente.foto_cliente ? (
                        <img 
                          src={`http://localhost:4001${cliente.foto_cliente}`} 
                          alt={cliente.nombre_completo}
                          className="foto-cliente"
                        />
                      ) : (
                        <div className="foto-placeholder">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="cliente-info">
                      <h3>{cliente.nombre_completo}</h3>
                      <p className="cliente-telefono">📞 {cliente.telefono}</p>
                      {cliente.correo && (
                        <p className="cliente-correo">📧 {cliente.correo}</p>
                      )}
                      <div className="cliente-tipo">
                        <span className={`tipo-badge ${cliente.tipo_cliente?.toLowerCase()}`}>
                          {cliente.tipo_cliente === 'Frecuente' ? '⭐' : '🆕'} {cliente.tipo_cliente || 'Regular'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cliente-estadisticas">
                    <div className="estadistica">
                      <span className="estadistica-valor">{cliente.estadisticas?.total_citas || 0}</span>
                      <span className="estadistica-label">Citas</span>
                    </div>
                    <div className="estadistica">
                      <span className="estadistica-valor">
                        {cliente.estadisticas?.ultima_cita 
                          ? clienteService.calcularDiasDesdeUltimaCita(cliente.estadisticas.ultima_cita)
                          : 'N/A'
                        }
                      </span>
                      <span className="estadistica-label">Última visita</span>
                    </div>
                  </div>
                  
                  <div className="cliente-acciones">
                    <button 
                      onClick={() => verDetallesCliente(cliente)}
                      className="btn-ver-detalles"
                    >
                      📋 Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal de detalles del cliente */}
          {mostrarDetalles && clienteSeleccionado && (
            <div className="modal-overlay" onClick={cerrarDetalles}>
              <div className="modal-detalles" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>📋 Detalles de {clienteSeleccionado.nombre_completo}</h3>
                  <button onClick={cerrarDetalles} className="btn-cerrar">❌</button>
                </div>
                
                <div className="modal-body">
                  <div className="cliente-detalle-info">
                    <div className="cliente-detalle-foto">
                      {clienteSeleccionado.foto_cliente ? (
                        <img 
                          src={`http://localhost:4001${clienteSeleccionado.foto_cliente}`} 
                          alt={clienteSeleccionado.nombre_completo}
                          className="foto-cliente-detalle"
                        />
                      ) : (
                        <div className="foto-placeholder-detalle">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="cliente-detalle-datos">
                      <h4>📞 {clienteSeleccionado.telefono}</h4>
                      {clienteSeleccionado.correo && (
                        <h4>📧 {clienteSeleccionado.correo}</h4>
                      )}
                      {clienteSeleccionado.direccion && (
                        <h4>📍 {clienteSeleccionado.direccion}</h4>
                      )}
                    </div>
                  </div>

                  {/* Estadísticas del cliente */}
                  {estadisticasCliente && (
                    <div className="estadisticas-detalle">
                      <h4>📊 Estadísticas</h4>
                      <div className="estadisticas-grid">
                        <div className="estadistica-item">
                          <span className="estadistica-valor">{estadisticasCliente.total_citas}</span>
                          <span className="estadistica-label">Total Citas</span>
                        </div>
                        <div className="estadistica-item">
                          <span className="estadistica-valor">{estadisticasCliente.citas_completadas}</span>
                          <span className="estadistica-label">Completadas</span>
                        </div>
                        <div className="estadistica-item">
                          <span className="estadistica-valor">{estadisticasCliente.porcentaje_asistencia}%</span>
                          <span className="estadistica-label">Asistencia</span>
                        </div>
                        <div className="estadistica-item">
                          <span className="estadistica-valor">{estadisticasCliente.servicios_diferentes}</span>
                          <span className="estadistica-label">Servicios diferentes</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Historial de citas */}
                  <div className="historial-detalle">
                    <h4>📅 Historial de Citas</h4>
                    {historialCliente.length > 0 ? (
                      <div className="historial-lista">
                        {historialCliente.map((cita, index) => (
                          <div key={index} className="historial-item">
                            <div className="historial-fecha">
                              📅 {clienteService.formatearFechaHora(cita.fecha_cita, cita.hora_cita)}
                            </div>
                            <div className="historial-servicio">
                              💇‍♀️ {cita.servicio_nombre || 'Servicio no especificado'}
                            </div>
                            <div className={`historial-estado estado-${cita.estado?.toLowerCase()}`}>
                              {cita.estado || 'Pendiente'}
                            </div>
                            {cita.observaciones && (
                              <div className="historial-observaciones">
                                📝 {cita.observaciones}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="sin-historial">No hay historial de citas disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumen */}
          <div className="resumen-clientes">
            <p>📊 Total de clientes: <strong>{clientes.length}</strong></p>
            <p>🆕 Clientes nuevos: <strong>{clientes.filter(c => c.tipo_cliente === 'Nuevo').length}</strong></p>
            <p>⭐ Clientes frecuentes: <strong>{clientes.filter(c => c.tipo_cliente === 'Frecuente').length}</strong></p>
          </div>
        </>
      )}
    </div>
  );
};

export default GestionClientes;
