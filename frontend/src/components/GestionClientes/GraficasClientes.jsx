import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import clienteService from '../../services/clienteService';
import './GraficasClientes.css';

const GraficasClientes = () => {
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [clientesNuevos, setClientesNuevos] = useState([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [periodoSeleccionado]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [generales, nuevos, frecuentes] = await Promise.all([
        clienteService.obtenerEstadisticasGenerales(),
        clienteService.obtenerClientesNuevos(periodoSeleccionado),
        clienteService.obtenerClientesFrecuentes(10)
      ]);

      setEstadisticasGenerales(generales.data);
      setClientesNuevos(nuevos.data);
      setClientesFrecuentes(frecuentes.data);

    } catch (error) {
      console.error('Error cargando datos de gráficas:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    if (periodoSeleccionado === 'año') {
      return date.toLocaleDateString('es-GT', { month: 'short' });
    }
    return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' });
  };

  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  if (loading) {
    return (
      <div className="graficas-clientes-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando gráficas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="graficas-clientes-container">
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={cargarDatos} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="graficas-clientes-container">
      <div className="graficas-header">
        <h2>📊 Estadísticas de Clientes</h2>
        <div className="periodo-selector">
          <label>Período:</label>
          <select 
            value={periodoSeleccionado} 
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            className="periodo-select"
          >
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="año">Último año</option>
          </select>
        </div>
      </div>

      {/* Estadísticas Generales */}
      {estadisticasGenerales && (
        <div className="estadisticas-generales">
          <h3>📈 Resumen General</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h4>{estadisticasGenerales.total_clientes}</h4>
                <p>Total Clientes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🆕</div>
              <div className="stat-content">
                <h4>{estadisticasGenerales.clientes_mes_actual}</h4>
                <p>Nuevos este mes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h4>{estadisticasGenerales.total_citas}</h4>
                <p>Total Citas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h4>{estadisticasGenerales.porcentaje_asistencia}%</h4>
                <p>Asistencia</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfica de Clientes Nuevos */}
      {clientesNuevos.length > 0 && (
        <div className="grafica-section">
          <h3>📈 Clientes Nuevos por {periodoSeleccionado === 'semana' ? 'Día' : periodoSeleccionado === 'mes' ? 'Día' : 'Mes'}</h3>
          <div className="grafica-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clientesNuevos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="periodo" 
                  tickFormatter={formatearFecha}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => formatearFecha(value)}
                  formatter={(value) => [value, 'Clientes Nuevos']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="clientes_nuevos" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Clientes Nuevos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Clientes Frecuentes */}
      {clientesFrecuentes.length > 0 && (
        <div className="grafica-section">
          <h3>⭐ Top Clientes Frecuentes</h3>
          <div className="grafica-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientesFrecuentes.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nombre_completo" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Total Citas']}
                />
                <Legend />
                <Bar dataKey="total_citas" fill="#82ca9d" name="Total Citas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Distribución de Estados de Citas */}
      {estadisticasGenerales && (
        <div className="grafica-section">
          <h3>📊 Distribución de Estados de Citas</h3>
          <div className="grafica-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completadas', value: estadisticasGenerales.citas_completadas, color: '#10b981' },
                    { name: 'Canceladas', value: estadisticasGenerales.citas_canceladas, color: '#ef4444' },
                    { name: 'Pendientes', value: estadisticasGenerales.citas_pendientes, color: '#f59e0b' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Completadas', value: estadisticasGenerales.citas_completadas, color: '#10b981' },
                    { name: 'Canceladas', value: estadisticasGenerales.citas_canceladas, color: '#ef4444' },
                    { name: 'Pendientes', value: estadisticasGenerales.citas_pendientes, color: '#f59e0b' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabla de Clientes Frecuentes */}
      {clientesFrecuentes.length > 0 && (
        <div className="tabla-frecuentes">
          <h3>🏆 Ranking de Clientes Frecuentes</h3>
          <div className="tabla-container">
            <table className="tabla-clientes-frecuentes">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Total Citas</th>
                  <th>Asistencia</th>
                  <th>Última Cita</th>
                </tr>
              </thead>
              <tbody>
                {clientesFrecuentes.map((cliente, index) => (
                  <tr key={`${cliente.telefono}-${index}`}>
                    <td className="ranking">{index + 1}</td>
                    <td className="nombre">{cliente.nombre_completo}</td>
                    <td className="telefono">{cliente.telefono}</td>
                    <td className="citas">
                      <span className="badge-citas">{cliente.total_citas}</span>
                    </td>
                    <td className="asistencia">
                      <span className={`badge-asistencia ${cliente.porcentaje_asistencia >= 80 ? 'alta' : cliente.porcentaje_asistencia >= 60 ? 'media' : 'baja'}`}>
                        {cliente.porcentaje_asistencia}%
                      </span>
                    </td>
                    <td className="fecha">
                      {cliente.ultima_cita ? new Date(cliente.ultima_cita).toLocaleDateString('es-GT') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraficasClientes;
