import React, { useState, useEffect } from 'react';
import ServicioReportesService from '../../services/servicioReportesService';
import './ReportesServicios.css';

const ReportesServicios = () => {
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [serviciosMasSolicitados, setServiciosMasSolicitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [generales, masSolicitados] = await Promise.all([
        ServicioReportesService.obtenerEstadisticasGenerales(),
        ServicioReportesService.obtenerServiciosMasSolicitados(10, 'todos')
      ]);

      setEstadisticasGenerales(generales.data);
      setServiciosMasSolicitados(masSolicitados.data);

    } catch (error) {
      console.error('Error cargando datos de reportes de servicios:', error);
      setError(`Error al cargar los datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reportes-servicios-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reportes-servicios-container">
      <div className="reportes-header">
        <h1>📊 Reportes de Servicios</h1>
      </div>

      {/* Estadísticas Generales */}
      <div className="estadisticas-section">
        <h2>📈 Estadísticas Generales</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💇‍♀️</div>
            <div className="stat-content">
              <h3>{estadisticasGenerales?.total_servicios_diferentes || 0}</h3>
              <p>Servicios Diferentes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{estadisticasGenerales?.total_citas_servicios || 0}</h3>
              <p>Total Citas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{estadisticasGenerales?.porcentaje_completados || 0}%</h3>
              <p>Completados</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Q{estadisticasGenerales?.precio_promedio_servicio || 0}</h3>
              <p>Precio Promedio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Servicios Más Solicitados */}
      <div className="servicios-section">
        <h2>🔥 Servicios Más Solicitados</h2>
        <div className="tabla-container">
          <table className="servicios-tabla">
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Servicio</th>
                <th>Solicitudes</th>
                <th>Precio</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {serviciosMasSolicitados.length > 0 ? (
                serviciosMasSolicitados.map((servicio, index) => (
                  <tr key={index}>
                    <td className="ranking-cell">#{index + 1}</td>
                    <td>{servicio.nombre}</td>
                    <td>{servicio.total_solicitudes}</td>
                    <td>Q{servicio.precio_promedio}</td>
                    <td>Q{servicio.ingresos_totales}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                    No hay datos de servicios disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportesServicios;
