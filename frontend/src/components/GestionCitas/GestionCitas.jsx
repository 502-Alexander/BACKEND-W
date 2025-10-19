import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getCitas, getEstadisticasCitas, deleteCita } from '../../services/citasService';
import './GestionCitas.css';

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroFecha, setFiltroFecha] = useState('todas');
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accion, setAccion] = useState('');
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalNueva, setMostrarModalNueva] = useState(false);
  const [formularioEditar, setFormularioEditar] = useState({});

  // Datos de ejemplo para las gráficas
  const datosSemanal = [
    { dia: 'Lun', citas: 8 },
    { dia: 'Mar', citas: 12 },
    { dia: 'Mié', citas: 15 },
    { dia: 'Jue', citas: 10 },
    { dia: 'Vie', citas: 18 },
    { dia: 'Sáb', citas: 22 },
    { dia: 'Dom', citas: 6 }
  ];

  const datosMensual = [
    { mes: 'Ene', citas: 45 },
    { mes: 'Feb', citas: 52 },
    { mes: 'Mar', citas: 38 },
    { mes: 'Abr', citas: 67 },
    { mes: 'May', citas: 73 },
    { mes: 'Jun', citas: 89 }
  ];

  const datosAnual = [
    { año: '2021', citas: 450 },
    { año: '2022', citas: 520 },
    { año: '2023', citas: 680 },
    { año: '2024', citas: 720 }
  ];

  const datosServicios = [
    { nombre: 'Corte', cantidad: 45, color: '#8884d8' },
    { nombre: 'Tinte', cantidad: 32, color: '#82ca9d' },
    { nombre: 'Tratamiento', cantidad: 28, color: '#ffc658' },
    { nombre: 'Combo', cantidad: 15, color: '#ff7300' }
  ];

  // Datos de ejemplo para las citas
  const citasEjemplo = [
    {
      id_cita: 1,
      nombre_cliente: 'María',
      apellidos_cliente: 'González',
      telefono: '+502 1234-5678',
      correo: 'maria@email.com',
      fecha_cita: '2024-01-15',
      hora_cita: '10:00:00',
      servicio_nombre: 'Corte + Tinte',
      tipo_cliente: 'Frecuente',
      estado: 'Confirmada',
      foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      observaciones: 'Cliente regular, prefiere cortes cortos'
    },
    {
      id_cita: 2,
      nombre_cliente: 'Ana',
      apellidos_cliente: 'Rodríguez',
      telefono: '+502 2345-6789',
      correo: 'ana@email.com',
      fecha_cita: '2024-01-15',
      hora_cita: '14:30:00',
      servicio_nombre: 'Tratamiento Capilar',
      tipo_cliente: 'Nuevo',
      estado: 'Pendiente',
      foto: null,
      observaciones: 'Primera vez en el salón'
    },
    {
      id_cita: 3,
      nombre_cliente: 'Carmen',
      apellidos_cliente: 'López',
      telefono: '+502 3456-7890',
      correo: 'carmen@email.com',
      fecha_cita: '2024-01-16',
      hora_cita: '09:00:00',
      servicio_nombre: 'Combo Premium',
      tipo_cliente: 'Frecuente',
      estado: 'Confirmada',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      observaciones: 'Cliente VIP, siempre puntual'
    },
    {
      id_cita: 4,
      nombre_cliente: 'Sofia',
      apellidos_cliente: 'Martínez',
      telefono: '+502 4567-8901',
      correo: 'sofia@email.com',
      fecha_cita: '2024-01-16',
      hora_cita: '16:00:00',
      servicio_nombre: 'Corte',
      tipo_cliente: 'Nuevo',
      estado: 'Confirmada',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      observaciones: 'Celebración especial'
    }
  ];

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCitas();
      if (response.success) {
        setCitas(response.data);
      } else {
        setError('Error al cargar las citas');
        setCitas([]);
      }
    } catch (error) {
      console.error('Error cargando citas:', error);
      setError('Error al cargar las citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccion = (cita, accion) => {
    setCitaSeleccionada(cita);
    setAccion(accion);
    
    if (accion === 'editar') {
      setFormularioEditar({
        nombre_cliente: cita.nombre_cliente,
        apellidos_cliente: cita.apellidos_cliente,
        telefono: cita.telefono,
        correo: cita.correo,
        direccion: cita.direccion,
        fecha_cita: cita.fecha_cita,
        hora_cita: cita.hora_cita,
        servicio_nombre: cita.servicio_nombre,
        tipo_tratamiento: cita.tipo_tratamiento,
        largo_pelo: cita.largo_pelo,
        tipo_cliente: cita.tipo_cliente,
        estado: cita.estado,
        observaciones: cita.observaciones
      });
      setMostrarModalEditar(true);
    } else {
      setMostrarModal(true);
    }
  };

  const handleCambioEstado = async (citaId, nuevoEstado) => {
    try {
      // Aquí se haría la llamada a la API para actualizar el estado
      console.log('Cambiando estado de cita', citaId, 'a', nuevoEstado);
      
      // Actualizar localmente
      setCitas(citas.map(cita => 
        cita.id_cita === citaId 
          ? { ...cita, estado: nuevoEstado }
          : cita
      ));
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  const handleNuevaCita = () => {
    setMostrarModalNueva(true);
  };

  const guardarEdicion = async () => {
    try {
      // Aquí se haría la llamada a la API para actualizar la cita
      console.log('Guardando edición:', formularioEditar);
      
      // Actualizar localmente
      setCitas(citas.map(cita => 
        cita.id_cita === citaSeleccionada.id_cita 
          ? { ...cita, ...formularioEditar }
          : cita
      ));
      
      setMostrarModalEditar(false);
    } catch (error) {
      console.error('Error guardando edición:', error);
    }
  };

  const confirmarAccion = async () => {
    if (accion === 'eliminar') {
      try {
        const response = await deleteCita(citaSeleccionada.id_cita);
        if (response.success) {
          // Actualizar la lista local
          setCitas(citas.map(cita => 
            cita.id_cita === citaSeleccionada.id_cita 
              ? { ...cita, estado: 'Eliminada' }
              : cita
          ));
        }
      } catch (error) {
        console.error('Error eliminando cita:', error);
        setError('Error al eliminar la cita');
      }
    } else if (accion === 'editar') {
      console.log('Editando cita:', citaSeleccionada);
      // Aquí se implementaría la edición
    }
    setMostrarModal(false);
    setCitaSeleccionada(null);
    setAccion('');
  };

  const cancelarAccion = () => {
    setMostrarModal(false);
    setCitaSeleccionada(null);
    setAccion('');
  };

  const citasFiltradas = citas.filter(cita => {
    if (filtroFecha === 'todas') return cita.estado !== 'Eliminada';
    if (filtroFecha === 'hoy') return cita.fecha_cita === new Date().toISOString().split('T')[0];
    if (filtroFecha === 'semana') {
      const hoy = new Date();
      const semanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
      return new Date(cita.fecha_cita) >= semanaAtras && cita.estado !== 'Eliminada';
    }
    return cita.estado !== 'Eliminada';
  });

  if (loading) {
    return (
      <div className="gestion-citas-loading">
        <div className="spinner"></div>
        <p>Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className="gestion-citas">
      <div className="gestion-citas-header">
        <h2>Gestión de Citas</h2>
        <div className="filtros">
          <select 
            value={filtroFecha} 
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="filtro-select"
          >
            <option value="todas">Todas las citas</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
          </select>
          <button className="btn-nueva-cita" onClick={handleNuevaCita}>
            ➕ Nueva Cita
          </button>
        </div>
      </div>

      <div className="estadisticas-rapidas">
        <div className="stat-card">
          <h3>Total Citas</h3>
          <p className="stat-number">{citasFiltradas.length}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmadas</h3>
          <p className="stat-number">{citasFiltradas.filter(c => c.estado === 'Confirmada').length}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p className="stat-number">{citasFiltradas.filter(c => c.estado === 'Pendiente').length}</p>
        </div>
        <div className="stat-card">
          <h3>Clientes Frecuentes</h3>
          <p className="stat-number">{citasFiltradas.filter(c => c.tipo_cliente === 'Frecuente').length}</p>
        </div>
      </div>

      <div className="graficas-section">
        <h3>Estadísticas de Citas</h3>
        
        <div className="graficas-grid">
          <div className="grafica-container">
            <h4>Citas por Día (Semana)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosSemanal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="citas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grafica-container">
            <h4>Citas por Mes</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosMensual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="citas" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grafica-container">
            <h4>Servicios Más Solicitados</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosServicios}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {datosServicios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grafica-container">
            <h4>Tendencia Anual</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosAnual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="año" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="citas" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="tabla-citas">
        <h3>Citas Programadas</h3>
        <div className="tabla-container">
          <table className="citas-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Tipo Cliente</th>
                <th>Estado</th>
                <th>Foto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map(cita => (
                <tr key={cita.id_cita} className={cita.estado === 'Eliminada' ? 'eliminada' : ''}>
                  <td>{cita.nombre_cliente} {cita.apellidos_cliente}</td>
                  <td>{cita.telefono}</td>
                  <td>{cita.correo}</td>
                  <td>{new Date(cita.fecha_cita).toLocaleDateString()}</td>
                  <td>{cita.hora_cita}</td>
                  <td>{cita.servicio_nombre || cita.combo_nombre || 'Servicio no especificado'}</td>
                  <td>
                    <span className={`tipo-cliente ${cita.tipo_cliente.toLowerCase()}`}>
                      {cita.tipo_cliente}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={cita.estado} 
                      onChange={(e) => handleCambioEstado(cita.id_cita, e.target.value)}
                      className={`estado-select ${cita.estado.toLowerCase()}`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Cancelada">Cancelada</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </td>
                  <td>
                    <div className="foto-container">
                      {cita.foto ? (
                        <img 
                          src={cita.foto} 
                          alt="Foto del cliente" 
                          className="foto-cliente"
                          title="Ver foto completa"
                        />
                      ) : (
                        <span className="sin-foto">📷 Sin foto</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="acciones">
                      <button 
                        className="btn-editar"
                        onClick={() => handleAccion(cita, 'editar')}
                        title="Editar cita"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-eliminar"
                        onClick={() => handleAccion(cita, 'eliminar')}
                        title="Eliminar cita"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar Acción</h3>
            <p>
              ¿Estás seguro de que quieres eliminar la cita de{' '}
              <strong>{citaSeleccionada?.nombre_cliente} {citaSeleccionada?.apellidos_cliente}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={cancelarAccion}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarAccion}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal modal-editar">
            <h3>Editar Cita</h3>
            <div className="formulario-editar">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input 
                    type="text" 
                    value={formularioEditar.nombre_cliente || ''}
                    onChange={(e) => setFormularioEditar({...formularioEditar, nombre_cliente: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Apellidos:</label>
                  <input 
                    type="text" 
                    value={formularioEditar.apellidos_cliente || ''}
                    onChange={(e) => setFormularioEditar({...formularioEditar, apellidos_cliente: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono:</label>
                  <input 
                    type="text" 
                    value={formularioEditar.telefono || ''}
                    onChange={(e) => setFormularioEditar({...formularioEditar, telefono: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Correo:</label>
                  <input 
                    type="email" 
                    value={formularioEditar.correo || ''}
                    onChange={(e) => setFormularioEditar({...formularioEditar, correo: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha:</label>
                  <input 
                    type="date" 
                    value={formularioEditar.fecha_cita || ''}
                    onChange={(e) => setFormularioEditar({...formularioEditar, fecha_cita: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Hora:</label>
                  <input 
                    type="time" 
                    value={formularioEditar.hora_cita || ''}
                    onChange={(e) => setFormularioEditar({...formularioEditar, hora_cita: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Servicio:</label>
                <input 
                  type="text" 
                  value={formularioEditar.servicio_nombre || ''}
                  onChange={(e) => setFormularioEditar({...formularioEditar, servicio_nombre: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Observaciones:</label>
                <textarea 
                  value={formularioEditar.observaciones || ''}
                  onChange={(e) => setFormularioEditar({...formularioEditar, observaciones: e.target.value})}
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setMostrarModalEditar(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={guardarEdicion}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nueva cita */}
      {mostrarModalNueva && (
        <div className="modal-overlay">
          <div className="modal modal-nueva">
            <h3>Nueva Cita</h3>
            <p>Para crear una nueva cita, por favor utiliza el formulario público de la tienda en línea.</p>
            <p>Los clientes pueden agendar sus citas directamente desde la página principal.</p>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setMostrarModalNueva(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCitas;
