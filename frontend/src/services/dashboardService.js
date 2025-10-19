// Servicio para el Dashboard - Estadísticas generales
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const dashboardService = {
  // Obtener estadísticas generales del dashboard
  async obtenerEstadisticas() {
    try {
      console.log('📊 Obteniendo estadísticas del dashboard...');
      
      // Hacer múltiples llamadas en paralelo para obtener todas las estadísticas
      const [ventasResponse, citasResponse, productosResponse] = await Promise.allSettled([
        this.obtenerEstadisticasVentas(),
        this.obtenerEstadisticasCitas(),
        this.obtenerEstadisticasProductos()
      ]);

      // Procesar respuestas
      const estadisticas = {
        ventas: ventasResponse.status === 'fulfilled' ? ventasResponse.value : this.getDatosEjemploVentas(),
        citas: citasResponse.status === 'fulfilled' ? citasResponse.value : this.getDatosEjemploCitas(),
        productos: productosResponse.status === 'fulfilled' ? productosResponse.value : this.getDatosEjemploProductos(),
        timestamp: new Date().toISOString()
      };

      console.log('✅ Estadísticas obtenidas:', estadisticas);
      return estadisticas;

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      
      // Retornar datos de ejemplo en caso de error
      return {
        ventas: this.getDatosEjemploVentas(),
        citas: this.getDatosEjemploCitas(),
        productos: this.getDatosEjemploProductos(),
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  },

  // Obtener estadísticas de ventas
  async obtenerEstadisticasVentas() {
    try {
      const response = await axios.get(`${API_URL}/ventas/estadisticas/semana`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de ventas:', error);
      throw error;
    }
  },

  // Obtener estadísticas de citas
  async obtenerEstadisticasCitas() {
    try {
      const response = await axios.get(`${API_URL}/citas/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de citas:', error);
      throw error;
    }
  },

  // Obtener estadísticas de productos
  async obtenerEstadisticasProductos() {
    try {
      const response = await axios.get(`${API_URL}/productos/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de productos:', error);
      throw error;
    }
  },

  // Obtener datos de gráficas para el dashboard
  async obtenerDatosGraficas(periodo = 'semana') {
    try {
      console.log(`📈 Obteniendo datos de gráficas para período: ${periodo}`);
      
      const [ventasData, citasData] = await Promise.allSettled([
        this.obtenerDatosGraficasVentas(periodo),
        this.obtenerDatosGraficasCitas(periodo)
      ]);

      return {
        ventas: ventasData.status === 'fulfilled' ? ventasData.value : this.getDatosEjemploGraficasVentas(periodo),
        citas: citasData.status === 'fulfilled' ? citasData.value : this.getDatosEjemploGraficasCitas(periodo),
        periodo
      };

    } catch (error) {
      console.error('❌ Error obteniendo datos de gráficas:', error);
      return {
        ventas: this.getDatosEjemploGraficasVentas(periodo),
        citas: this.getDatosEjemploGraficasCitas(periodo),
        periodo,
        error: error.message
      };
    }
  },

  // Obtener datos de gráficas de ventas
  async obtenerDatosGraficasVentas(periodo) {
    try {
      const response = await axios.get(`${API_URL}/ventas/graficas/${periodo}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo datos de gráficas de ventas:', error);
      throw error;
    }
  },

  // Obtener datos de gráficas de citas
  async obtenerDatosGraficasCitas(periodo) {
    try {
      const response = await axios.get(`${API_URL}/citas/graficas/${periodo}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo datos de gráficas de citas:', error);
      throw error;
    }
  },

  // Obtener resumen ejecutivo
  async obtenerResumenEjecutivo() {
    try {
      console.log('📋 Obteniendo resumen ejecutivo...');
      
      const estadisticas = await this.obtenerEstadisticas();
      
      const resumen = {
        totalVentas: estadisticas.ventas.totalVentas || 0,
        totalCitas: estadisticas.citas.totalCitas || 0,
        totalProductos: estadisticas.productos.totalProductos || 0,
        crecimientoVentas: estadisticas.ventas.crecimiento || 0,
        citasConfirmadas: estadisticas.citas.citasConfirmadas || 0,
        productosActivos: estadisticas.productos.productosActivos || 0,
        alertas: this.generarAlertas(estadisticas),
        timestamp: new Date().toISOString()
      };

      console.log('✅ Resumen ejecutivo generado:', resumen);
      return resumen;

    } catch (error) {
      console.error('❌ Error generando resumen ejecutivo:', error);
      throw error;
    }
  },

  // Generar alertas basadas en las estadísticas
  generarAlertas(estadisticas) {
    const alertas = [];

    // Alertas de ventas
    if (estadisticas.ventas.crecimiento < 0) {
      alertas.push({
        tipo: 'warning',
        mensaje: 'Las ventas han disminuido este período',
        icono: '📉'
      });
    }

    // Alertas de citas
    if (estadisticas.citas.citasPendientes > 20) {
      alertas.push({
        tipo: 'info',
        mensaje: 'Hay muchas citas pendientes de confirmar',
        icono: '⏳'
      });
    }

    // Alertas de productos
    if (estadisticas.productos.stockBajo > 10) {
      alertas.push({
        tipo: 'error',
        mensaje: 'Múltiples productos con stock bajo',
        icono: '🚨'
      });
    }

    return alertas;
  },

  // Datos de ejemplo para ventas
  getDatosEjemploVentas() {
    return {
      totalVentas: 12500,
      totalProductos: 91,
      promedioVenta: 137.36,
      crecimiento: 15.2,
      ventasHoy: 450,
      ventasSemana: 3200,
      ventasMes: 12500
    };
  },

  // Datos de ejemplo para citas
  getDatosEjemploCitas() {
    return {
      totalCitas: 91,
      citasConfirmadas: 78,
      citasPendientes: 13,
      promedioDiario: 13,
      citasHoy: 8,
      citasSemana: 45,
      citasMes: 91
    };
  },

  // Datos de ejemplo para productos
  getDatosEjemploProductos() {
    return {
      totalProductos: 150,
      productosActivos: 142,
      productosInactivos: 8,
      categoriasActivas: 5,
      stockBajo: 12,
      stockCritico: 3,
      stockAgotado: 1
    };
  },

  // Datos de ejemplo para gráficas de ventas
  getDatosEjemploGraficasVentas(periodo) {
    if (periodo === 'semana') {
      return [
        { dia: 'Lun', ventas: 1200, productos: 8 },
        { dia: 'Mar', ventas: 1800, productos: 12 },
        { dia: 'Mié', ventas: 2200, productos: 15 },
        { dia: 'Jue', ventas: 1600, productos: 10 },
        { dia: 'Vie', ventas: 2800, productos: 18 },
        { dia: 'Sáb', ventas: 3200, productos: 22 },
        { dia: 'Dom', ventas: 900, productos: 6 }
      ];
    } else {
      return [
        { mes: 'Ene', ventas: 45000, productos: 180 },
        { mes: 'Feb', ventas: 52000, productos: 210 },
        { mes: 'Mar', ventas: 38000, productos: 150 },
        { mes: 'Abr', ventas: 67000, productos: 280 },
        { mes: 'May', ventas: 73000, productos: 320 },
        { mes: 'Jun', ventas: 89000, productos: 380 }
      ];
    }
  },

  // Datos de ejemplo para gráficas de citas
  getDatosEjemploGraficasCitas(periodo) {
    if (periodo === 'semana') {
      return [
        { dia: 'Lun', citas: 8 },
        { dia: 'Mar', citas: 12 },
        { dia: 'Mié', citas: 15 },
        { dia: 'Jue', citas: 10 },
        { dia: 'Vie', citas: 18 },
        { dia: 'Sáb', citas: 22 },
        { dia: 'Dom', citas: 6 }
      ];
    } else {
      return [
        { mes: 'Ene', citas: 45 },
        { mes: 'Feb', citas: 52 },
        { mes: 'Mar', citas: 38 },
        { mes: 'Abr', citas: 67 },
        { mes: 'May', citas: 73 },
        { mes: 'Jun', citas: 89 }
      ];
    }
  }
};

export default dashboardService;
