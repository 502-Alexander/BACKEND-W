// Componente de gestión de stock con alertas - Completamente Responsive
import { useState, useEffect } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import ResponsiveTable from '../ResponsiveTable/ResponsiveTable'
import ResponsiveChart from '../ResponsiveChart/ResponsiveChart'
import stockService from '../../services/stockService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './GestionStock.css'

function GestionStock() {
  const [stock, setStock] = useState([])
  const [alertas, setAlertas] = useState({})
  const [estadisticas, setEstadisticas] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [itemEditando, setItemEditando] = useState(null)
  const [mostrarMovimiento, setMostrarMovimiento] = useState(false)
  const [itemMovimiento, setItemMovimiento] = useState(null)
  const [filtro, setFiltro] = useState('todos') // todos, stockBajo, stockCritico, normal
  const [busqueda, setBusqueda] = useState('')
  
  const { isMobile, isTablet, getGridColumns, getPadding } = useResponsive()

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  // Cargar todos los datos necesarios
  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [stockData, alertasData, estadisticasData] = await Promise.all([
        stockService.getStock(),
        stockService.getStockAlerts(),
        stockService.getStockStatistics()
      ])
      
      setStock(stockData.data)
      setAlertas(alertasData.data)
      setEstadisticas(estadisticasData.data)
      setError(null)
    } catch (err) {
      setError('Error al cargar los datos de stock')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar stock según criterios
  const stockFiltrado = stock.filter(item => {
    const cumpleFiltro = filtro === 'todos' || 
      (filtro === 'stockBajo' && item.alertas.stockBajo && !item.alertas.stockCritico) ||
      (filtro === 'stockCritico' && item.alertas.stockCritico) ||
      (filtro === 'normal' && !item.alertas.stockBajo && !item.alertas.stockCritico)
    
    const cumpleBusqueda = busqueda === '' || 
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.proveedor.toLowerCase().includes(busqueda.toLowerCase())
    
    return cumpleFiltro && cumpleBusqueda
  })

  // Configuración de columnas para la tabla
  const columnas = [
    {
      key: 'nombre',
      header: 'Producto',
      render: (value, item) => (
        <div className="producto-info">
          <div className="producto-nombre">{value}</div>
          <div className="producto-categoria">{item.categoria}</div>
        </div>
      )
    },
    {
      key: 'stockActual',
      header: 'Stock Actual',
      render: (value, item) => (
        <div className={`stock-cantidad ${item.alertas.stockCritico ? 'critico' : item.alertas.stockBajo ? 'bajo' : 'normal'}`}>
          {value}
          <span className="stock-minimo">/ {item.stockMinimo}</span>
        </div>
      )
    },
    {
      key: 'proveedor',
      header: 'Proveedor',
      render: (value) => <span className="proveedor">{value || 'N/A'}</span>
    },
    {
      key: 'ubicacion',
      header: 'Ubicación',
      render: (value) => <span className="ubicacion">{value || 'N/A'}</span>
    },
    {
      key: 'precioVenta',
      header: 'Precio Venta',
      render: (value) => <span className="precio">Q{value?.toFixed(2) || '0.00'}</span>
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (value, item) => (
        <div className="estado-container">
          <span className={`estado ${value}`}>{value}</span>
          {item.alertas.stockCritico && <span className="alerta-critica">⚠️</span>}
          {item.alertas.stockBajo && !item.alertas.stockCritico && <span className="alerta-baja">⚠️</span>}
        </div>
      )
    }
  ]

  // Datos para gráficas
  const datosGraficaStock = [
    { nombre: 'Stock Normal', valor: estadisticas.stockNormal || 0, color: '#28a745' },
    { nombre: 'Stock Bajo', valor: estadisticas.stockBajo || 0, color: '#ffc107' },
    { nombre: 'Stock Crítico', valor: estadisticas.stockCritico || 0, color: '#dc3545' }
  ]

  const datosGraficaValor = [
    { nombre: 'Valor Total', valor: estadisticas.valorTotal || 0 },
    { nombre: 'Valor Venta', valor: estadisticas.valorVenta || 0 }
  ]

  // Manejar click en fila de tabla
  const manejarClickFila = (item) => {
    setItemEditando(item)
    setMostrarFormulario(true)
  }

  // Manejar movimiento de stock
  const manejarMovimiento = (item) => {
    setItemMovimiento(item)
    setMostrarMovimiento(true)
  }

  if (loading) {
    return (
      <div className="gestion-stock-loading">
        <div className="spinner"></div>
        <p>Cargando gestión de stock...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gestion-stock-error">
        <div className="error-icon">❌</div>
        <h3>Error al cargar el stock</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={cargarDatos}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="gestion-stock">
      {/* Header con estadísticas */}
      <div className="stock-header">
        <div className="header-info">
          <h2>📦 Gestión de Stock</h2>
          <p>Administra el inventario y recibe alertas automáticas</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setMostrarFormulario(true)}
          >
            ➕ Nuevo Item
          </button>
          <button 
            className="btn btn-secondary"
            onClick={cargarDatos}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Alertas de stock */}
      {alertas.total > 0 && (
        <div className="stock-alertas">
          <h3>🚨 Alertas de Stock</h3>
          <div className="alertas-grid">
            {alertas.stockCritico?.length > 0 && (
              <div className="alerta-critica">
                <div className="alerta-icon">⚠️</div>
                <div className="alerta-info">
                  <h4>Stock Crítico</h4>
                  <p>{alertas.stockCritico.length} productos</p>
                </div>
              </div>
            )}
            {alertas.stockBajo?.length > 0 && (
              <div className="alerta-baja">
                <div className="alerta-icon">⚠️</div>
                <div className="alerta-info">
                  <h4>Stock Bajo</h4>
                  <p>{alertas.stockBajo.length} productos</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estadísticas generales */}
      <div className="stock-estadisticas">
        <div className="estadisticas-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{estadisticas.totalItems || 0}</h3>
              <p>Total Items</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>{estadisticas.stockBajo || 0}</h3>
              <p>Stock Bajo</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <h3>{estadisticas.stockCritico || 0}</h3>
              <p>Stock Crítico</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Q{(estadisticas.valorTotal || 0).toLocaleString()}</h3>
              <p>Valor Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="stock-graficas">
        <ResponsiveChart
          title="Distribución de Stock"
          subtitle="Estado actual del inventario"
          height={isMobile ? 250 : isTablet ? 300 : 350}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosGraficaStock}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 80 : 100}
                dataKey="valor"
                label={({ nombre, valor }) => `${nombre}: ${valor}`}
              >
                {datosGraficaStock.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ResponsiveChart>

        <ResponsiveChart
          title="Valor del Inventario"
          subtitle="Valor total vs valor de venta"
          height={isMobile ? 250 : isTablet ? 300 : 350}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosGraficaValor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip formatter={(value) => `Q${value.toLocaleString()}`} />
              <Bar dataKey="valor" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChart>
      </div>

      {/* Filtros y búsqueda */}
      <div className="stock-filtros">
        <div className="filtros-container">
          <div className="filtro-select">
            <label>Filtrar por estado:</label>
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="normal">Stock Normal</option>
              <option value="stockBajo">Stock Bajo</option>
              <option value="stockCritico">Stock Crítico</option>
            </select>
          </div>
          <div className="filtro-busqueda">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Nombre, categoría o proveedor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla de stock */}
      <div className="stock-tabla">
        <ResponsiveTable
          data={stockFiltrado}
          columns={columnas}
          onRowClick={manejarClickFila}
          emptyMessage="No hay items de stock disponibles"
        />
      </div>

      {/* Formulario de edición (placeholder) */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{itemEditando ? 'Editar Item' : 'Nuevo Item'}</h3>
            <p>Formulario de edición de stock (implementar según necesidades)</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setMostrarFormulario(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de movimiento (placeholder) */}
      {mostrarMovimiento && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Movimiento de Stock</h3>
            <p>Formulario de entrada/salida de stock (implementar según necesidades)</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setMostrarMovimiento(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionStock
