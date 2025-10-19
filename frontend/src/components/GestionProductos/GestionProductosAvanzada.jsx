import React, { useState, useEffect } from 'react';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
//   LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
// } from 'recharts';
import ProductoReportesService from '../../services/productoReportesService';
import './GestionProductosAvanzada.css';

const GestionProductosAvanzada = () => {
  console.log('🚀 Componente GestionProductosAvanzada montado');
  
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [distribucionCategorias, setDistribucionCategorias] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [analisisPrecios, setAnalisisPrecios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabActivo, setTabActivo] = useState('dashboard');

  // Colores para las gráficas
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  const cargarTodosLosDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Iniciando carga de datos...');

      const [
        estadisticas,
        masVendidos,
        distribucion,
        stockBajo,
        precios
      ] = await Promise.all([
        ProductoReportesService.obtenerEstadisticasGenerales(),
        ProductoReportesService.obtenerProductosMasVendidos(),
        ProductoReportesService.obtenerDistribucionCategorias(),
        ProductoReportesService.obtenerProductosStockBajo(),
        ProductoReportesService.obtenerAnalisisPrecios()
      ]);

      console.log('✅ Datos cargados:', {
        estadisticas: estadisticas.data,
        masVendidos: masVendidos.data,
        distribucion: distribucion.data,
        stockBajo: stockBajo.data,
        precios: precios.data
      });

      setEstadisticasGenerales(estadisticas.data);
      setProductosMasVendidos(masVendidos.data);
      setDistribucionCategorias(distribucion.data);
      setProductosStockBajo(stockBajo.data);
      setAnalisisPrecios(precios.data);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('Error al cargar los datos de reportes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderizarDashboard = () => (
    <div className="dashboard-productos">
      <div className="estadisticas-principales">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Productos</h3>
            <p className="stat-number">{estadisticasGenerales?.total_productos || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Productos Activos</h3>
            <p className="stat-number">{estadisticasGenerales?.productos_activos || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Stock Bajo</h3>
            <p className="stat-number">{estadisticasGenerales?.productos_stock_bajo || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Valor Inventario</h3>
            <p className="stat-number">${estadisticasGenerales?.valor_total_inventario?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      <div className="graficas-principales">
        <div className="grafica-container">
          <h3>Distribución por Categorías</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
            <p>📊 Gráfica de categorías (temporalmente deshabilitada)</p>
          </div>
        </div>

        <div className="grafica-container">
          <h3>Valor por Categoría</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
            <p>📈 Gráfica de valores (temporalmente deshabilitada)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderizarMasVendidos = () => (
    <div className="mas-vendidos">
      <h3>Productos Más Vendidos</h3>
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
        <p>📊 Lista de productos más vendidos (temporalmente simplificada)</p>
        <p>Total productos: {productosMasVendidos.length}</p>
      </div>
    </div>
  );

  const renderizarStockBajo = () => (
    <div className="stock-bajo">
      <h3>Productos con Stock Bajo</h3>
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
        <p>⚠️ Alertas de stock bajo (temporalmente simplificada)</p>
        <p>Total productos con stock bajo: {productosStockBajo.length}</p>
      </div>
    </div>
  );

  const renderizarAnalisisPrecios = () => (
    <div className="analisis-precios">
      <h3>Análisis de Precios</h3>
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
        <p>💰 Análisis de precios (temporalmente simplificada)</p>
        <p>Precio promedio: ${analisisPrecios?.precio_promedio?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );

  if (loading) {
    console.log('🔄 Componente en estado de loading...');
    return (
      <div className="gestion-productos-loading">
        <div className="spinner"></div>
        <p>Cargando reportes de productos...</p>
      </div>
    );
  }

  if (error) {
    console.log('❌ Componente en estado de error:', error);
    return (
      <div className="gestion-productos-error">
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button onClick={cargarTodosLosDatos}>Reintentar</button>
      </div>
    );
  }

  console.log('✅ Renderizando componente con datos:', {
    estadisticasGenerales,
    productosMasVendidos: productosMasVendidos.length,
    distribucionCategorias: distribucionCategorias.length,
    productosStockBajo: productosStockBajo.length,
    analisisPrecios
  });

  return (
    <div className="gestion-productos-avanzada">
      <div className="header-reportes">
        <h2>📊 Reportes y Estadísticas de Productos</h2>
        <div className="tabs">
          <button 
            className={tabActivo === 'dashboard' ? 'active' : ''}
            onClick={() => setTabActivo('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={tabActivo === 'mas-vendidos' ? 'active' : ''}
            onClick={() => setTabActivo('mas-vendidos')}
          >
            Más Vendidos
          </button>
          <button 
            className={tabActivo === 'stock-bajo' ? 'active' : ''}
            onClick={() => setTabActivo('stock-bajo')}
          >
            Stock Bajo
          </button>
          <button 
            className={tabActivo === 'precios' ? 'active' : ''}
            onClick={() => setTabActivo('precios')}
          >
            Análisis Precios
          </button>
        </div>
      </div>

      <div className="contenido-reportes">
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '10px', margin: '20px 0' }}>
          <h3>🧪 DEBUG INFO</h3>
          <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'Ninguno'}</p>
          <p><strong>Tab Activo:</strong> {tabActivo}</p>
          <p><strong>Estadísticas:</strong> {estadisticasGenerales ? 'Cargadas' : 'No cargadas'}</p>
          <p><strong>Productos Más Vendidos:</strong> {productosMasVendidos.length}</p>
          <p><strong>Distribución Categorías:</strong> {distribucionCategorias.length}</p>
          <p><strong>Productos Stock Bajo:</strong> {productosStockBajo.length}</p>
          <p><strong>Análisis Precios:</strong> {analisisPrecios ? 'Cargado' : 'No cargado'}</p>
        </div>
        
        {tabActivo === 'dashboard' && renderizarDashboard()}
        {tabActivo === 'mas-vendidos' && renderizarMasVendidos()}
        {tabActivo === 'stock-bajo' && renderizarStockBajo()}
        {tabActivo === 'precios' && renderizarAnalisisPrecios()}
      </div>
    </div>
  );
};

export default GestionProductosAvanzada;
