// Componente para mostrar actividades recientes del sistema
import React, { useState, useEffect } from 'react';
import './ActividadesRecientes.css';

const ActividadesRecientes = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarActividadesRecientes();
  }, []);

  const cargarActividadesRecientes = async () => {
    try {
      setLoading(true);
      
      // Simular carga de actividades (en un caso real, esto vendría de una API)
      const actividadesSimuladas = [
        {
          id: 1,
          tipo: 'venta',
          descripcion: 'Nueva venta registrada',
          detalles: 'Producto: Shampoo Kerastase - Q150.00',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
          icono: '💰',
          color: '#27ae60'
        },
        {
          id: 2,
          tipo: 'cita',
          descripcion: 'Cita confirmada',
          detalles: 'Cliente: María González - Corte y peinado',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
          icono: '📋',
          color: '#3498db'
        },
        {
          id: 3,
          tipo: 'producto',
          descripcion: 'Stock bajo detectado',
          detalles: 'Producto: Mascarilla Hidratante - Solo 3 unidades',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
          icono: '⚠️',
          color: '#f39c12'
        },
        {
          id: 4,
          tipo: 'cliente',
          descripcion: 'Nuevo cliente registrado',
          detalles: 'Cliente: Ana Rodríguez - Tel: 5555-1234',
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
          icono: '👤',
          color: '#9b59b6'
        },
        {
          id: 5,
          tipo: 'venta',
          descripcion: 'Venta completada',
          detalles: 'Producto: Tratamiento Capilar - Q200.00',
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
          icono: '💰',
          color: '#27ae60'
        },
        {
          id: 6,
          tipo: 'cita',
          descripcion: 'Cita cancelada',
          detalles: 'Cliente: Carlos López - Coloración',
          timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 horas atrás
          icono: '❌',
          color: '#e74c3c'
        }
      ];

      // Simular delay de carga
      setTimeout(() => {
        setActividades(actividadesSimuladas);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error cargando actividades recientes:', error);
      setLoading(false);
    }
  };

  const formatearTiempo = (timestamp) => {
    const ahora = new Date();
    const diferencia = ahora - timestamp;
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));

    if (minutos < 1) {
      return 'Hace un momento';
    } else if (minutos < 60) {
      return `Hace ${minutos} min`;
    } else if (horas < 24) {
      return `Hace ${horas}h`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const obtenerColorTipo = (tipo) => {
    const colores = {
      venta: '#27ae60',
      cita: '#3498db',
      producto: '#f39c12',
      cliente: '#9b59b6',
      sistema: '#34495e'
    };
    return colores[tipo] || '#7f8c8d';
  };

  if (loading) {
    return (
      <div className="actividades-recientes">
        <h2>🕒 Actividades Recientes</h2>
        <div className="actividades-loading">
          <div className="spinner"></div>
          <p>Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="actividades-recientes">
      <h2>🕒 Actividades Recientes</h2>
      
      <div className="actividades-lista">
        {actividades.length === 0 ? (
          <div className="sin-actividades">
            <p>📭 No hay actividades recientes</p>
          </div>
        ) : (
          actividades.map((actividad) => (
            <div key={actividad.id} className="actividad-item">
              <div className="actividad-icono" style={{ backgroundColor: actividad.color }}>
                {actividad.icono}
              </div>
              
              <div className="actividad-contenido">
                <div className="actividad-header">
                  <h4>{actividad.descripcion}</h4>
                  <span className="actividad-tiempo">{formatearTiempo(actividad.timestamp)}</span>
                </div>
                
                <p className="actividad-detalles">{actividad.detalles}</p>
                
                <div className="actividad-tipo">
                  <span 
                    className="tipo-badge" 
                    style={{ backgroundColor: obtenerColorTipo(actividad.tipo) }}
                  >
                    {actividad.tipo.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="actividades-footer">
        <button className="ver-todas-btn">
          Ver todas las actividades
        </button>
      </div>
    </div>
  );
};

export default ActividadesRecientes;
