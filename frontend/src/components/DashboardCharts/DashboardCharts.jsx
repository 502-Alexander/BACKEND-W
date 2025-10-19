// Componente de gráficas para el dashboard
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import './DashboardCharts.css';

const DashboardCharts = ({ datosGraficas, estadisticas }) => {
  console.log('📊 DashboardCharts montado con datos:', { datosGraficas, estadisticas });

  // Colores para las gráficas
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Función para formatear el tooltip de ventas
  const formatearTooltipVentas = (value, name) => {
    if (name === 'ventas') {
      return [`Q${value.toLocaleString()}`, 'Ventas'];
    }
    if (name === 'productos') {
      return [value, 'Productos Vendidos'];
    }
    return [value, name];
  };

  // Función para formatear el tooltip de citas
  const formatearTooltipCitas = (value, name) => {
    return [value, 'Citas'];
  };

  // Renderizar gráfica de ventas
  const renderizarGraficaVentas = () => {
    if (!datosGraficas?.ventas || datosGraficas.ventas.length === 0) {
      return (
        <div className="chart-placeholder">
          <p>📈 No hay datos de ventas disponibles</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={datosGraficas.ventas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip formatter={formatearTooltipVentas} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="ventas" 
            stroke="#0088FE" 
            fill="#0088FE" 
            fillOpacity={0.3}
            name="Ventas"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // Renderizar gráfica de citas
  const renderizarGraficaCitas = () => {
    if (!datosGraficas?.citas || datosGraficas.citas.length === 0) {
      return (
        <div className="chart-placeholder">
          <p>📋 No hay datos de citas disponibles</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosGraficas.citas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip formatter={formatearTooltipCitas} />
          <Legend />
          <Bar dataKey="citas" fill="#00C49F" name="Citas" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Renderizar gráfica de distribución de productos
  const renderizarGraficaProductos = () => {
    if (!estadisticas?.productos) {
      return (
        <div className="chart-placeholder">
          <p>📦 No hay datos de productos disponibles</p>
        </div>
      );
    }

    const datosProductos = [
      { name: 'Activos', value: estadisticas.productos.productosActivos || 0, color: '#00C49F' },
      { name: 'Inactivos', value: estadisticas.productos.productosInactivos || 0, color: '#FFBB28' },
      { name: 'Stock Bajo', value: estadisticas.productos.stockBajo || 0, color: '#FF8042' },
      { name: 'Stock Crítico', value: estadisticas.productos.stockCritico || 0, color: '#e74c3c' }
    ].filter(item => item.value > 0);

    if (datosProductos.length === 0) {
      return (
        <div className="chart-placeholder">
          <p>📦 No hay datos de productos disponibles</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datosProductos}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {datosProductos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Renderizar gráfica de tendencia de ventas
  const renderizarGraficaTendencia = () => {
    if (!datosGraficas?.ventas || datosGraficas.ventas.length === 0) {
      return (
        <div className="chart-placeholder">
          <p>📈 No hay datos de tendencia disponibles</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosGraficas.ventas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip formatter={formatearTooltipVentas} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ventas" 
            stroke="#8884d8" 
            strokeWidth={3}
            name="Ventas"
          />
          <Line 
            type="monotone" 
            dataKey="productos" 
            stroke="#82ca9d" 
            strokeWidth={2}
            name="Productos"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="dashboard-charts">
      <h2>📊 Análisis Visual</h2>
      
      <div className="charts-grid">
        {/* Gráfica de ventas */}
        <div className="chart-container">
          <h3>💰 Ventas por Día</h3>
          {renderizarGraficaVentas()}
        </div>

        {/* Gráfica de citas */}
        <div className="chart-container">
          <h3>📋 Citas por Día</h3>
          {renderizarGraficaCitas()}
        </div>

        {/* Gráfica de productos */}
        <div className="chart-container">
          <h3>📦 Distribución de Productos</h3>
          {renderizarGraficaProductos()}
        </div>

        {/* Gráfica de tendencia */}
        <div className="chart-container chart-full-width">
          <h3>📈 Tendencia de Ventas vs Productos</h3>
          {renderizarGraficaTendencia()}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
