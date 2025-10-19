import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import LogsService from '../../services/logsService';
import DiagnosticoLogs from './DiagnosticoLogs';
import './AnalisisLogs.css';

const AnalisisLogs = () => {
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [logsAuth, setLogsAuth] = useState(null);
  const [logsErrores, setLogsErrores] = useState(null);
  const [logsRequests, setLogsRequests] = useState(null);
  const [logsResponses, setLogsResponses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabActivo, setTabActivo] = useState('general');
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(false);

  // Colores para las gráficas
  const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  const cargarTodosLosDatos = async () => {
    try {
      console.log('🔄 Cargando datos de análisis de logs...');
      setLoading(true);
      setError(null);

      const [
        generales,
        auth,
        errores,
        requests,
        responses
      ] = await Promise.allSettled([
        LogsService.obtenerEstadisticasGenerales(),
        LogsService.obtenerLogsAuth(),
        LogsService.obtenerLogsErrores(),
        LogsService.obtenerLogsRequests(),
        LogsService.obtenerLogsResponses()
      ]);

      // Procesar resultados con manejo de errores individuales
      if (generales.status === 'fulfilled') {
        setEstadisticasGenerales(generales.value.data);
        console.log('✅ Estadísticas generales cargadas:', generales.value.data);
      } else {
        console.error('❌ Error cargando estadísticas generales:', generales.reason);
      }

      if (auth.status === 'fulfilled') {
        setLogsAuth(auth.value.data);
        console.log('✅ Logs de auth cargados:', auth.value.data);
      } else {
        console.error('❌ Error cargando logs de auth:', auth.reason);
      }

      if (errores.status === 'fulfilled') {
        setLogsErrores(errores.value.data);
        console.log('✅ Logs de errores cargados:', errores.value.data);
      } else {
        console.error('❌ Error cargando logs de errores:', errores.reason);
      }

      if (requests.status === 'fulfilled') {
        setLogsRequests(requests.value.data);
        console.log('✅ Logs de requests cargados:', requests.value.data);
      } else {
        console.error('❌ Error cargando logs de requests:', requests.reason);
      }

      if (responses.status === 'fulfilled') {
        setLogsResponses(responses.value.data);
        console.log('✅ Logs de responses cargados:', responses.value.data);
      } else {
        console.error('❌ Error cargando logs de responses:', responses.reason);
      }

      console.log('✅ Datos de logs cargados exitosamente');

    } catch (error) {
      console.error('❌ Error cargando datos de logs:', error);
      setError('Error al cargar los datos de logs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderizarEstadisticasGenerales = () => {
    if (!estadisticasGenerales) {
      return (
        <div className="logs-section">
          <h3>📊 Resumen General de Logs</h3>
          <div className="no-data">
            <p>⚠️ No hay datos de estadísticas generales disponibles</p>
            <button onClick={cargarTodosLosDatos} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    const datosLogs = [
      { tipo: 'Auth', cantidad: estadisticasGenerales.auth_logs || 0, color: '#3498db' },
      { tipo: 'Errores', cantidad: estadisticasGenerales.error_logs || 0, color: '#e74c3c' },
      { tipo: 'Requests', cantidad: estadisticasGenerales.request_logs || 0, color: '#2ecc71' },
      { tipo: 'Responses', cantidad: estadisticasGenerales.response_logs || 0, color: '#f39c12' }
    ].filter(item => item.cantidad > 0);

    const datosAuth = [
      { tipo: 'Exitosos', cantidad: estadisticasGenerales.auth_success || 0, color: '#2ecc71' },
      { tipo: 'Fallidos', cantidad: estadisticasGenerales.auth_failed || 0, color: '#e74c3c' }
    ].filter(item => item.cantidad > 0);

    const datosErrores = [
      { tipo: '404', cantidad: estadisticasGenerales.errors_404 || 0, color: '#f39c12' },
      { tipo: '500', cantidad: estadisticasGenerales.errors_500 || 0, color: '#e74c3c' }
    ].filter(item => item.cantidad > 0);

    return (
      <div className="logs-section">
        <h3>📊 Resumen General de Logs</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h4>{estadisticasGenerales.total_logs}</h4>
              <p>Total Logs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-content">
              <h4>{estadisticasGenerales.auth_logs}</h4>
              <p>Logs Auth</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h4>{estadisticasGenerales.error_logs}</h4>
              <p>Logs Errores</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📥</div>
            <div className="stat-content">
              <h4>{estadisticasGenerales.request_logs}</h4>
              <p>Logs Requests</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h4>Distribución de Logs por Tipo</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosLogs}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {datosLogs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Estados de Autenticación</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosAuth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderizarLogsAuth = () => {
    if (!logsAuth) {
      return (
        <div className="logs-section">
          <h3>🔐 Análisis de Autenticación</h3>
          <div className="no-data">
            <p>⚠️ No hay datos de logs de autenticación disponibles</p>
            <button onClick={cargarTodosLosDatos} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="logs-section">
        <h3>🔐 Análisis de Autenticación</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔢</div>
            <div className="stat-content">
              <h4>{logsAuth.total_intentos || 0}</h4>
              <p>Total Intentos</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h4>Intentos por Día</h4>
            {logsAuth.logs_por_dia && logsAuth.logs_por_dia.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={logsAuth.logs_por_dia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3498db" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">
                <p>No hay datos de intentos por día</p>
              </div>
            )}
          </div>

          <div className="chart-container">
            <h4>Intentos por Hora</h4>
            {logsAuth.logs_por_hora && logsAuth.logs_por_hora.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={logsAuth.logs_por_hora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#e74c3c" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">
                <p>No hay datos de intentos por hora</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h4>Intentos por Usuario</h4>
          {logsAuth.intentos_por_usuario && logsAuth.intentos_por_usuario.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={logsAuth.intentos_por_usuario}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="usuario" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2ecc71" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>No hay datos de intentos por usuario</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderizarLogsErrores = () => {
    if (!logsErrores) return null;

    return (
      <div className="logs-section">
        <h3>❌ Análisis de Errores</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <h4>{logsErrores.total_errores}</h4>
              <p>Total Errores</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h4>Errores por Tipo</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={logsErrores.errores_por_tipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, count }) => `${tipo}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {logsErrores.errores_por_tipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Errores por Día</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={logsErrores.errores_por_dia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h4>Top Rutas con Errores</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={logsErrores.errores_por_ruta.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ruta" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f39c12" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderizarLogsRequests = () => {
    if (!logsRequests) return null;

    return (
      <div className="logs-section">
        <h3>📥 Análisis de Requests</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h4>{logsRequests.total_requests}</h4>
              <p>Total Requests</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h4>Requests por Método HTTP</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={logsRequests.requests_por_metodo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ metodo, count }) => `${metodo}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {logsRequests.requests_por_metodo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Requests por Día</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={logsRequests.requests_por_dia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2ecc71" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h4>Top Endpoints Más Solicitados</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={logsRequests.requests_por_endpoint.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="endpoint" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderizarLogsResponses = () => {
    if (!logsResponses) return null;

    return (
      <div className="logs-section">
        <h3>📤 Análisis de Responses</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h4>{logsResponses.total_responses}</h4>
              <p>Total Responses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h4>{logsResponses.estadisticas_tiempo.promedio}ms</h4>
              <p>Tiempo Promedio</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h4>{logsResponses.estadisticas_tiempo.minimo}ms</h4>
              <p>Tiempo Mínimo</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🐌</div>
            <div className="stat-content">
              <h4>{logsResponses.estadisticas_tiempo.maximo}ms</h4>
              <p>Tiempo Máximo</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h4>Responses por Código</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={logsResponses.responses_por_codigo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="codigo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2ecc71" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Responses por Día</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={logsResponses.responses_por_dia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3498db" fill="#3498db" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analisis-logs-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando análisis de logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analisis-logs-container">
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={cargarTodosLosDatos} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analisis-logs-container">
      <div className="logs-header">
        <h2>📊 Análisis de Logs del Sistema</h2>
        <p>Monitoreo y análisis de logs de autenticación, errores, requests y responses</p>
        <div className="filter-info">
          <span className="filter-badge">📅 Datos filtrados: Año 2024 en adelante</span>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setMostrarDiagnostico(true)}
            className="btn btn-secondary"
          >
            🔍 Diagnóstico
          </button>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${tabActivo === 'general' ? 'active' : ''}`}
            onClick={() => setTabActivo('general')}
          >
            📊 General
          </button>
          <button 
            className={`tab ${tabActivo === 'auth' ? 'active' : ''}`}
            onClick={() => setTabActivo('auth')}
          >
            🔐 Autenticación
          </button>
          <button 
            className={`tab ${tabActivo === 'errores' ? 'active' : ''}`}
            onClick={() => setTabActivo('errores')}
          >
            ❌ Errores
          </button>
          <button 
            className={`tab ${tabActivo === 'requests' ? 'active' : ''}`}
            onClick={() => setTabActivo('requests')}
          >
            📥 Requests
          </button>
          <button 
            className={`tab ${tabActivo === 'responses' ? 'active' : ''}`}
            onClick={() => setTabActivo('responses')}
          >
            📤 Responses
          </button>
        </div>
      </div>

      {/* Contenido de las tabs */}
      <div className="tab-content">
        {tabActivo === 'general' && renderizarEstadisticasGenerales()}
        {tabActivo === 'auth' && renderizarLogsAuth()}
        {tabActivo === 'errores' && renderizarLogsErrores()}
        {tabActivo === 'requests' && renderizarLogsRequests()}
        {tabActivo === 'responses' && renderizarLogsResponses()}
      </div>
      
      {/* Modal de diagnóstico */}
      {mostrarDiagnostico && (
        <DiagnosticoLogs onClose={() => setMostrarDiagnostico(false)} />
      )}
    </div>
  );
};

export default AnalisisLogs;

