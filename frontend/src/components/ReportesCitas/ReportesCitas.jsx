// Componente de reportes de citas del salón
import { useState, useEffect } from 'react'
import dashboardService from '../../services/dashboardService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './ReportesCitas.css'

function ReportesCitas() {
  const [reporte, setReporte] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    try {
      setLoading(true)
      const data = await dashboardService.obtenerReportesCitas()
      setReporte(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="reportes-loading">
        <div className="spinner"></div>
        <p>Cargando reportes de citas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="reportes-error">
        <h3>❌ Error al cargar los reportes</h3>
        <p>{error}</p>
        <button onClick={cargarReportes} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="reportes-citas">
      <div className="reportes-header">
        <h2 className="reportes-title">📅 Reportes de Citas del Salón</h2>
        <p className="reportes-subtitle">Análisis de citas y servicios</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{reporte?.totalCitas || 0}</h3>
            <p>Total Citas</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{reporte?.citasHoy || 0}</h3>
            <p>Citas Hoy</p>
          </div>
        </div>
      </div>

      <div className="reportes-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Citas por Mes</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reporte?.citasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="citas" fill="#f093fb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Servicios Más Solicitados</h3>
          </div>
          <div className="chart-content">
            <div className="servicios-table">
              <table>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Citas</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte?.serviciosMasSolicitados?.map((servicio, index) => (
                    <tr key={index}>
                      <td>{servicio.servicio}</td>
                      <td>{servicio.citas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesCitas
