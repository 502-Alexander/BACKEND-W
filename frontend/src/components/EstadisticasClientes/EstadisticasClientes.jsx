// Componente de estadísticas de clientes - Completamente Responsive
import { useState, useEffect } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import ResponsiveChart from '../ResponsiveChart/ResponsiveChart'
import citasService from '../../services/citasService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import './EstadisticasClientes.css'

function EstadisticasClientes() {
  const [estadisticas, setEstadisticas] = useState({})
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroTiempo, setFiltroTiempo] = useState('mes') // mes, trimestre, año
  
  const { isMobile, isTablet, getGridColumns } = useResponsive()

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [filtroTiempo])

  // Cargar todos los datos necesarios
  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [citasData, estadisticasData] = await Promise.all([
        citasService.getCitas(),
        citasService.getEstadisticasCitas()
      ])
      
      setCitas(citasData.data)
      setEstadisticas(estadisticasData.data)
      setError(null)
    } catch (err) {
      setError('Error al cargar las estadísticas de clientes')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calcular estadísticas de clientes
  const calcularEstadisticasClientes = () => {
    const clientesUnicos = new Set(citas.map(cita => cita.email))
    const clientesFrecuentes = citas.filter(cita => cita.tipoCliente === 'frecuente')
    const clientesNuevos = citas.filter(cita => cita.tipoCliente === 'nuevo')
    
    // Clientes por servicio
    const clientesPorServicio = {}
    citas.forEach(cita => {
      if (!clientesPorServicio[cita.servicio]) {
        clientesPorServicio[cita.servicio] = new Set()
      }
      clientesPorServicio[cita.servicio].add(cita.email)
    })
    
    const serviciosStats = Object.entries(clientesPorServicio).map(([servicio, clientes]) => ({
      servicio,
      cantidadClientes: clientes.size,
      cantidadCitas: citas.filter(c => c.servicio === servicio).length
    }))

    // Clientes por mes
    const clientesPorMes = {}
    citas.forEach(cita => {
      const fecha = new Date(cita.fecha)
      const mes = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
      
      if (!clientesPorMes[mes]) {
        clientesPorMes[mes] = new Set()
      }
      clientesPorMes[mes].add(cita.email)
    })

    const clientesMensuales = Object.entries(clientesPorMes).map(([mes, clientes]) => ({
      mes,
      clientes: clientes.size,
      citas: citas.filter(c => {
        const fecha = new Date(c.fecha)
        const mesCita = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
        return mesCita === mes
      }).length
    }))

    // Top clientes (más citas)
    const citasPorCliente = {}
    citas.forEach(cita => {
      if (!citasPorCliente[cita.email]) {
        citasPorCliente[cita.email] = {
          nombre: cita.nombre,
          email: cita.email,
          citas: 0,
          tipoCliente: cita.tipoCliente,
          ultimaCita: cita.fecha
        }
      }
      citasPorCliente[cita.email].citas++
    })

    const topClientes = Object.values(citasPorCliente)
      .sort((a, b) => b.citas - a.citas)
      .slice(0, 10)

    return {
      totalClientes: clientesUnicos.size,
      clientesFrecuentes: clientesFrecuentes.length,
      clientesNuevos: clientesNuevos.length,
      promedioCitasPorCliente: citas.length / clientesUnicos.size || 0,
      serviciosStats,
      clientesMensuales,
      topClientes
    }
  }

  const statsClientes = calcularEstadisticasClientes()

  // Datos para gráficas
  const datosTipoCliente = [
    { nombre: 'Frecuentes', valor: statsClientes.clientesFrecuentes, color: '#6f42c1' },
    { nombre: 'Nuevos', valor: statsClientes.clientesNuevos, color: '#fd7e14' }
  ]

  const datosServicios = statsClientes.serviciosStats.map(item => ({
    ...item,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }))

  if (loading) {
    return (
      <div className="estadisticas-clientes-loading">
        <div className="spinner"></div>
        <p>Cargando estadísticas de clientes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="estadisticas-clientes-error">
        <div className="error-icon">❌</div>
        <h3>Error al cargar las estadísticas</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={cargarDatos}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="estadisticas-clientes">
      {/* Header */}
      <div className="clientes-header">
        <div className="header-info">
          <h2>👥 Estadísticas de Clientes</h2>
          <p>Análisis detallado del comportamiento y preferencias de tus clientes</p>
        </div>
        <div className="header-actions">
          <select 
            value={filtroTiempo} 
            onChange={(e) => setFiltroTiempo(e.target.value)}
            className="filtro-tiempo"
          >
            <option value="mes">Último mes</option>
            <option value="trimestre">Último trimestre</option>
            <option value="año">Último año</option>
          </select>
          <button 
            className="btn btn-secondary"
            onClick={cargarDatos}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="clientes-estadisticas">
        <div className="estadisticas-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{statsClientes.totalClientes}</h3>
              <p>Total Clientes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>{statsClientes.clientesFrecuentes}</h3>
              <p>Clientes Frecuentes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <h3>{statsClientes.clientesNuevos}</h3>
              <p>Clientes Nuevos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{statsClientes.promedioCitasPorCliente.toFixed(1)}</h3>
              <p>Promedio Citas/Cliente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div 
        className="clientes-graficas"
        style={{
          gridTemplateColumns: `repeat(${getGridColumns(1, 1, 2, 2)}, 1fr)`,
          gap: isMobile ? '1rem' : '2rem'
        }}
      >
        {/* Gráfica de tipos de clientes */}
        <ResponsiveChart
          title="Distribución de Tipos de Clientes"
          subtitle="Clientes frecuentes vs nuevos"
          height={isMobile ? 250 : 300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosTipoCliente}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : 80}
                dataKey="valor"
                label={({ nombre, valor }) => `${nombre}: ${valor}`}
              >
                {datosTipoCliente.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ResponsiveChart>

        {/* Gráfica de clientes por servicio */}
        <ResponsiveChart
          title="Clientes por Servicio"
          subtitle="Cantidad de clientes únicos por servicio"
          height={isMobile ? 250 : 300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosServicios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="servicio" 
                fontSize={isMobile ? 10 : 12}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 80 : 60}
              />
              <YAxis fontSize={isMobile ? 10 : 12} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'cantidadClientes' ? value : value,
                  name === 'cantidadClientes' ? 'Clientes' : 'Citas'
                ]}
              />
              <Bar dataKey="cantidadClientes" fill="#667eea" name="Clientes" />
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChart>

        {/* Gráfica de evolución mensual */}
        <ResponsiveChart
          title="Evolución de Clientes por Mes"
          subtitle="Nuevos clientes y citas mensuales"
          height={isMobile ? 250 : 300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statsClientes.clientesMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                fontSize={isMobile ? 10 : 12}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 80 : 60}
              />
              <YAxis fontSize={isMobile ? 10 : 12} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="clientes" 
                stroke="#667eea" 
                strokeWidth={2}
                name="Clientes"
              />
              <Line 
                type="monotone" 
                dataKey="citas" 
                stroke="#28a745" 
                strokeWidth={2}
                name="Citas"
              />
            </LineChart>
          </ResponsiveContainer>
        </ResponsiveChart>
      </div>

      {/* Top clientes */}
      <div className="top-clientes">
        <h3> Top 10 Clientes Más Activos</h3>
        <div className="clientes-lista">
          {statsClientes.topClientes.map((cliente, index) => (
            <div key={cliente.email} className="cliente-item">
              <div className="cliente-ranking">
                <span className="ranking-numero">{index + 1}</span>
              </div>
              <div className="cliente-info">
                <div className="cliente-nombre">{cliente.nombre}</div>
                <div className="cliente-email">{cliente.email}</div>
                <div className="cliente-tipo">
                  <span className={`tipo-badge ${cliente.tipoCliente}`}>
                    {cliente.tipoCliente === 'frecuente' ? '🔄 Frecuente' : '🆕 Nuevo'}
                  </span>
                </div>
              </div>
              <div className="cliente-stats">
                <div className="stat-citas">
                  <span className="stat-numero">{cliente.citas}</span>
                  <span className="stat-label">citas</span>
                </div>
                <div className="stat-ultima">
                  <span className="stat-label">Última:</span>
                  <span className="stat-fecha">
                    {new Date(cliente.ultimaCita).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EstadisticasClientes
