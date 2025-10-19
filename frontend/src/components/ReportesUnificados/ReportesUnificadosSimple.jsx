import React, { useState } from 'react';
import './ReportesUnificados.css';

const ReportesUnificados = () => {
  const [moduloActivo, setModuloActivo] = useState('ventas');
  const [periodo, setPeriodo] = useState('semana');

  // Datos de ejemplo
  const datosVentas = {
    totalVentas: 12500,
    totalProductos: 91,
    promedioVenta: 137.36,
    crecimiento: 15.2
  };

  const datosCitas = {
    totalCitas: 91,
    citasConfirmadas: 78,
    citasPendientes: 13,
    promedioDiario: 13
  };

  const datosProductos = {
    totalProductos: 150,
    productosActivos: 142,
    productosInactivos: 8,
    categoriasActivas: 5,
    stockBajo: 12
  };

  const renderizarContenidoVentas = () => (
    <div className="reportes-contenido">
      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <h3>💰 Total Ventas</h3>
          <p className="estadistica-valor">Q{datosVentas.totalVentas.toLocaleString()}</p>
        </div>
        <div className="estadistica-card">
          <h3>📦 Productos Vendidos</h3>
          <p className="estadistica-valor">{datosVentas.totalProductos}</p>
        </div>
        <div className="estadistica-card">
          <h3>📈 Promedio por Venta</h3>
          <p className="estadistica-valor">Q{datosVentas.promedioVenta}</p>
        </div>
        <div className="estadistica-card">
          <h3>📊 Crecimiento</h3>
          <p className="estadistica-valor crecimiento">+{datosVentas.crecimiento}%</p>
        </div>
      </div>
      <div className="grafica-container">
        <h3>📈 Ventas por {periodo === 'semana' ? 'Día' : 'Mes'}</h3>
        <div className="grafica-placeholder">
          <p>Gráfica de ventas se cargará aquí</p>
        </div>
      </div>
    </div>
  );

  const renderizarContenidoCitas = () => (
    <div className="reportes-contenido">
      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <h3>📋 Total Citas</h3>
          <p className="estadistica-valor">{datosCitas.totalCitas}</p>
        </div>
        <div className="estadistica-card">
          <h3>✅ Confirmadas</h3>
          <p className="estadistica-valor">{datosCitas.citasConfirmadas}</p>
        </div>
        <div className="estadistica-card">
          <h3>⏳ Pendientes</h3>
          <p className="estadistica-valor">{datosCitas.citasPendientes}</p>
        </div>
        <div className="estadistica-card">
          <h3>📊 Promedio Diario</h3>
          <p className="estadistica-valor">{datosCitas.promedioDiario}</p>
        </div>
      </div>
      <div className="grafica-container">
        <h3>📈 Citas por {periodo === 'semana' ? 'Día' : 'Mes'}</h3>
        <div className="grafica-placeholder">
          <p>Gráfica de citas se cargará aquí</p>
        </div>
      </div>
    </div>
  );

  const renderizarContenidoProductos = () => (
    <div className="reportes-contenido">
      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <h3>📦 Total Productos</h3>
          <p className="estadistica-valor">{datosProductos.totalProductos}</p>
        </div>
        <div className="estadistica-card">
          <h3>✅ Activos</h3>
          <p className="estadistica-valor">{datosProductos.productosActivos}</p>
        </div>
        <div className="estadistica-card">
          <h3>❌ Inactivos</h3>
          <p className="estadistica-valor">{datosProductos.productosInactivos}</p>
        </div>
        <div className="estadistica-card">
          <h3>📊 Categorías</h3>
          <p className="estadistica-valor">{datosProductos.categoriasActivas}</p>
        </div>
      </div>
      <div className="grafica-container">
        <h3>📊 Distribución por Categorías</h3>
        <div className="grafica-placeholder">
          <p>Gráfica de productos se cargará aquí</p>
        </div>
      </div>
    </div>
  );

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
      <div className="reportes-header">
        <h2>📊 Reportes del Salón</h2>
        
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

        <div className="periodo-selector">
          <label>Período:</label>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="año">Año</option>
          </select>
        </div>
      </div>

      <div className="reportes-main">
        {renderizarContenido()}
      </div>
    </div>
  );
};

export default ReportesUnificados;
