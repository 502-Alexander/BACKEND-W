import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getEstadisticasVentas, getTopProductos, getTopCategorias } from '../../services/ventasService';
import { getCitas, getEstadisticasCitas } from '../../services/citasService';
import './ReportesUnificados.css';

const ReportesUnificados = () => {
  const [moduloActivo, setModuloActivo] = useState('ventas');
  const [periodo, setPeriodo] = useState('semana');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para ventas
  const [estadisticasVentas, setEstadisticasVentas] = useState(null);
  const [topProductos, setTopProductos] = useState([]);
  const [topCategorias, setTopCategorias] = useState([]);

  // Estados para citas
  const [estadisticasCitas, setEstadisticasCitas] = useState(null);
  const [citas, setCitas] = useState([]);

  // Estados para productos
  const [estadisticasProductos, setEstadisticasProductos] = useState(null);

  // Datos de ejemplo para gráficas
  const datosSemanalVentas = [
    { dia: 'Lun', ventas: 1200, productos: 8 },
    { dia: 'Mar', ventas: 1800, productos: 12 },
    { dia: 'Mié', ventas: 2200, productos: 15 },
    { dia: 'Jue', ventas: 1600, productos: 10 },
    { dia: 'Vie', ventas: 2800, productos: 18 },
    { dia: 'Sáb', ventas: 3200, productos: 22 },
    { dia: 'Dom', ventas: 900, productos: 6 }
  ];

  const datosMensualVentas = [
    { mes: 'Ene', ventas: 45000, productos: 180 },
    { mes: 'Feb', ventas: 52000, productos: 210 },
    { mes: 'Mar', ventas: 38000, productos: 150 },
    { mes: 'Abr', ventas: 67000, productos: 280 },
    { mes: 'May', ventas: 73000, productos: 320 },
    { mes: 'Jun', ventas: 89000, productos: 380 }
  ];

  const datosSemanalCitas = [
    { dia: 'Lun', citas: 8 },
    { dia: 'Mar', citas: 12 },
    { dia: 'Mié', citas: 15 },
    { dia: 'Jue', citas: 10 },
    { dia: 'Vie', citas: 18 },
    { dia: 'Sáb', citas: 22 },
    { dia: 'Dom', citas: 6 }
  ];

  const datosMensualCitas = [
    { mes: 'Ene', citas: 45 },
    { mes: 'Feb', citas: 52 },
    { mes: 'Mar', citas: 38 },
    { mes: 'Abr', citas: 67 },
    { mes: 'May', citas: 73 },
    { mes: 'Jun', citas: 89 }
  ];

  const datosProductos = [
    { categoria: 'Shampoo', cantidad: 45, color: '#8884d8' },
    { categoria: 'Acondicionador', cantidad: 32, color: '#82ca9d' },
    { categoria: 'Tratamientos', cantidad: 28, color: '#ffc658' },
    { categoria: 'Tintes', cantidad: 15, color: '#ff7300' },
    { categoria: 'Accesorios', cantidad: 20, color: '#00ff00' }
  ];

  // Cargar datos según el módulo activo
  useEffect(() => {
    cargarDatos();
  }, [moduloActivo, periodo]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      switch (moduloActivo) {
        case 'ventas':
          await cargarDatosVentas();
          break;
        case 'citas':
          await cargarDatosCitas();
          break;
        case 'productos':
          await cargarDatosProductos();
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosVentas = async () => {
    try {
      // Cargar estadísticas de ventas
      const stats = await getEstadisticasVentas(periodo);
      setEstadisticasVentas(stats);

      // Cargar top productos
      const productos = await getTopProductos(periodo, 5);
      setTopProductos(productos);

      // Cargar top categorías
      const categorias = await getTopCategorias(periodo);
      setTopCategorias(categorias);
    } catch (err) {
      console.error('Error cargando datos de ventas:', err);
      // Usar datos de ejemplo si hay error
      setEstadisticasVentas({
        totalVentas: 12500,
        totalProductos: 91,
        promedioVenta: 137.36,
        crecimiento: 15.2
      });
    }
  };

  const cargarDatosCitas = async () => {
    try {
      const citasData = await getCitas();
      setCitas(citasData);

      const stats = await getEstadisticasCitas();
      setEstadisticasCitas(stats);
    } catch (err) {
      console.error('Error cargando datos de citas:', err);
      // Usar datos de ejemplo si hay error
      setEstadisticasCitas({
        totalCitas: 91,
        citasConfirmadas: 78,
        citasPendientes: 13,
        promedioDiario: 13
      });
    }
  };

  const cargarDatosProductos = async () => {
    try {
      // Simular datos de productos
      setEstadisticasProductos({
        totalProductos: 150,
        productosActivos: 142,
        productosInactivos: 8,
        categoriasActivas: 5,
        stockBajo: 12
      });
    } catch (err) {
      console.error('Error cargando datos de productos:', err);
    }
  };

  const renderizarContenidoVentas = () => {
    const datosGrafica = periodo === 'semana' ? datosSemanalVentas : datosMensualVentas;
    const ejeX = periodo === 'semana' ? 'dia' : 'mes';

    return (
      <div className="reportes-contenido">
        {/* Estadísticas Generales */}
        <div className="estadisticas-grid">
          <div className="estadistica-card">
            <h3>💰 Total Ventas</h3>
            <p className="estadistica-valor">
              ${estadisticasVentas?.totalVentas?.toLocaleString() || '12,500'}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>📦 Productos Vendidos</h3>
            <p className="estadistica-valor">
              {estadisticasVentas?.totalProductos || 91}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>📈 Promedio por Venta</h3>
            <p className="estadistica-valor">
              ${estadisticasVentas?.promedioVenta || 137.36}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>📊 Crecimiento</h3>
            <p className="estadistica-valor crecimiento">
              +{estadisticasVentas?.crecimiento || 15.2}%
            </p>
          </div>
        </div>

        {/* Gráfica de Ventas */}
        <div className="grafica-container">
          <h3>📈 Ventas por {periodo === 'semana' ? 'Día' : 'Mes'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGrafica}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={ejeX} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#d4a574" name="Ventas (Q)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Productos y Categorías */}
        <div className="graficas-grid">
          <div className="grafica-container">
            <h3>🏆 Top 5 Productos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProductos.length > 0 ? topProductos : [
                { nombre: 'Due Faccetta Shampoo', cantidad: 45 },
                { nombre: 'Perfect Blonder Tratamiento', cantidad: 32 },
                { nombre: 'W-One Tinte Rubio', cantidad: 28 },
                { nombre: 'Due Faccetta Acondicionador', cantidad: 25 },
                { nombre: 'W-One Tinte Castaño', cantidad: 20 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#b8865b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grafica-container">
            <h3>📊 Categorías Más Vendidas</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={datosProductos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, porcentaje }) => `${categoria} ${porcentaje}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {datosProductos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderizarContenidoCitas = () => {
    const datosGrafica = periodo === 'semana' ? datosSemanalCitas : datosMensualCitas;
    const ejeX = periodo === 'semana' ? 'dia' : 'mes';

    return (
      <div className="reportes-contenido">
        {/* Estadísticas Generales */}
        <div className="estadisticas-grid">
          <div className="estadistica-card">
            <h3>📋 Total Citas</h3>
            <p className="estadistica-valor">
              {estadisticasCitas?.totalCitas || 91}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>✅ Confirmadas</h3>
            <p className="estadistica-valor">
              {estadisticasCitas?.citasConfirmadas || 78}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>⏳ Pendientes</h3>
            <p className="estadistica-valor">
              {estadisticasCitas?.citasPendientes || 13}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>📊 Promedio Diario</h3>
            <p className="estadistica-valor">
              {estadisticasCitas?.promedioDiario || 13}
            </p>
          </div>
        </div>

        {/* Gráfica de Citas */}
        <div className="grafica-container">
          <h3>📈 Citas por {periodo === 'semana' ? 'Día' : 'Mes'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosGrafica}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={ejeX} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="citas" stroke="#d4a574" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de Citas Recientes */}
        <div className="tabla-container">
          <h3>📋 Citas Recientes</h3>
          <div className="tabla-responsive">
            <table className="tabla-citas">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {citas.slice(0, 10).map((cita, index) => (
                  <tr key={index}>
                    <td>{cita.nombre_cliente} {cita.apellidos_cliente}</td>
                    <td>{cita.fecha_cita}</td>
                    <td>{cita.hora_cita}</td>
                    <td>{cita.servicio_nombre || 'Servicio General'}</td>
                    <td>
                      <span className={`estado estado-${cita.estado?.toLowerCase()}`}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderizarContenidoProductos = () => {
    return (
      <div className="reportes-contenido">
        {/* Estadísticas Generales */}
        <div className="estadisticas-grid">
          <div className="estadistica-card">
            <h3>📦 Total Productos</h3>
            <p className="estadistica-valor">
              {estadisticasProductos?.totalProductos || 150}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>✅ Activos</h3>
            <p className="estadistica-valor">
              {estadisticasProductos?.productosActivos || 142}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>❌ Inactivos</h3>
            <p className="estadistica-valor">
              {estadisticasProductos?.productosInactivos || 8}
            </p>
          </div>
          <div className="estadistica-card">
            <h3>📊 Categorías</h3>
            <p className="estadistica-valor">
              {estadisticasProductos?.categoriasActivas || 5}
            </p>
          </div>
        </div>

        {/* Gráfica de Distribución por Categorías */}
        <div className="grafica-container">
          <h3>📊 Distribución por Categorías</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosProductos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ categoria, porcentaje }) => `${categoria} ${porcentaje}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {datosProductos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Alertas de Stock */}
        <div className="alertas-container">
          <h3>🚨 Alertas de Stock</h3>
          <div className="alertas-grid">
            <div className="alerta-card stock-bajo">
              <h4>Stock Bajo</h4>
              <p>{estadisticasProductos?.stockBajo || 12} productos</p>
            </div>
            <div className="alerta-card stock-critico">
              <h4>Stock Crítico</h4>
              <p>3 productos</p>
            </div>
            <div className="alerta-card stock-agotado">
              <h4>Agotados</h4>
              <p>1 producto</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderizarContenido = () => {
    switch (moduloActivo) {
      case 'ventas':
        return renderizarContenidoVentas();
      case 'citas':
        return renderizarContenidoCitas();
      case 'productos':
        return renderizarContenidoProductos();
      default:
        return renderizarContenidoVentas();
    }
  };

  return (
    <div className="reportes-unificados">
      {/* Header con navegación */}
      <div className="reportes-header">
        <h2>📊 Reportes del Salón</h2>
        
        {/* Navegación por módulos */}
        <div className="modulos-navegacion">
          <button
            className={`modulo-btn ${moduloActivo === 'ventas' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('ventas')}
          >
            💰 Ventas
          </button>
          <button
            className={`modulo-btn ${moduloActivo === 'citas' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('citas')}
          >
            📋 Citas
          </button>
          <button
            className={`modulo-btn ${moduloActivo === 'productos' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('productos')}
          >
            📦 Productos
          </button>
        </div>

        {/* Selector de período */}
        <div className="periodo-selector">
          <label>Período:</label>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="año">Año</option>
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="reportes-main">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>❌ Error: {error}</p>
            <button onClick={cargarDatos}>Reintentar</button>
          </div>
        )}

        {!loading && !error && renderizarContenido()}
      </div>
    </div>
  );
};

export default ReportesUnificados;
