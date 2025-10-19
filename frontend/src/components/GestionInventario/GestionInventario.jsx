import React, { useState, useEffect } from 'react';
import InventarioService from '../../services/inventarioService';
import './GestionInventario.css';

const GestionInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModalMovimiento, setMostrarModalMovimiento] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formularioMovimiento, setFormularioMovimiento] = useState({
    tipo_movimiento: 'entrada',
    cantidad: '',
    motivo: ''
  });
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      console.log('🔄 Cargando datos del inventario...');
      setLoading(true);
      setError(null);

      const [inventarioData, estadisticasData] = await Promise.all([
        InventarioService.obtenerInventarioCompleto(),
        InventarioService.obtenerEstadisticasInventario()
      ]);

      console.log('✅ Datos recibidos:', {
        inventario: inventarioData.data?.length || 0,
        estadisticas: estadisticasData.data
      });

      setInventario(inventarioData.data);
      setEstadisticas(estadisticasData.data);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('Error al cargar los datos del inventario');
    } finally {
      setLoading(false);
      console.log('✅ Carga de datos completada');
    }
  };

  const cargarMovimientos = async (productoId) => {
    try {
      const movimientosData = await InventarioService.obtenerMovimientosProducto(productoId);
      setMovimientos(movimientosData.data);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
    }
  };

  const handleAgregarMovimiento = (producto) => {
    setProductoSeleccionado(producto);
    setFormularioMovimiento({
      tipo_movimiento: 'entrada',
      cantidad: '',
      motivo: ''
    });
    setMostrarModalMovimiento(true);
  };

  const handleEditarStockMinimo = (producto) => {
    setProductoSeleccionado(producto);
    setFormularioEditar({
      stock_minimo: producto.stock_minimo
    });
    setMostrarModalEditar(true);
  };

  const handleEliminarProducto = async (producto) => {
    if (window.confirm(`¿Estás seguro de eliminar "${producto.producto_nombre}" del inventario?`)) {
      try {
        await InventarioService.eliminarProductoInventario(producto.producto_id);
        await cargarDatos();
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleSubmitMovimiento = async (e) => {
    e.preventDefault();
    try {
      console.log('🔄 Registrando movimiento...', {
        producto_id: productoSeleccionado.producto_id,
        tipo_movimiento: formularioMovimiento.tipo_movimiento,
        cantidad: parseInt(formularioMovimiento.cantidad),
        motivo: formularioMovimiento.motivo,
        usuario_id: 1
      });

      const resultado = await InventarioService.registrarMovimiento({
        producto_id: productoSeleccionado.producto_id,
        tipo_movimiento: formularioMovimiento.tipo_movimiento,
        cantidad: parseInt(formularioMovimiento.cantidad),
        motivo: formularioMovimiento.motivo,
        usuario_id: 1 // TODO: Obtener del contexto de usuario
      });

      console.log('✅ Movimiento registrado:', resultado);

      setMostrarModalMovimiento(false);
      
      // Limpiar formulario
      setFormularioMovimiento({
        tipo_movimiento: 'entrada',
        cantidad: '',
        motivo: ''
      });

      // Recargar datos
      console.log('🔄 Recargando datos...');
      setActualizando(true);
      await cargarDatos();
      setActualizando(false);
      console.log('✅ Datos recargados');
      
      alert('Movimiento registrado exitosamente');
    } catch (error) {
      console.error('❌ Error registrando movimiento:', error);
      alert(`Error al registrar el movimiento: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();
    try {
      await InventarioService.actualizarStockMinimo(
        productoSeleccionado.inventario_id,
        parseInt(formularioEditar.stock_minimo)
      );

      setMostrarModalEditar(false);
      await cargarDatos();
      alert('Stock mínimo actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando stock mínimo:', error);
      alert('Error al actualizar el stock mínimo');
    }
  };

  const getEstadoStockClass = (estado) => {
    switch (estado) {
      case 'bajo': return 'stock-bajo';
      case 'medio': return 'stock-medio';
      case 'normal': return 'stock-normal';
      default: return 'stock-normal';
    }
  };

  const getEstadoStockText = (estado) => {
    switch (estado) {
      case 'bajo': return 'Stock Bajo';
      case 'medio': return 'Stock Medio';
      case 'normal': return 'Stock Normal';
      default: return 'Stock Normal';
    }
  };

  if (loading) {
    return (
      <div className="gestion-inventario-loading">
        <div className="spinner"></div>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gestion-inventario-error">
        <h3>Error al cargar el inventario</h3>
        <p>{error}</p>
        <button onClick={cargarDatos}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="gestion-inventario">
      <div className="header-inventario">
        <h2>📦 Gestión de Inventario</h2>
        <div className="header-actions">
          <button className="btn-agregar-producto" onClick={() => window.location.href = '/admin-productos'}>
            ➕ Agregar Producto
          </button>
          <button 
            className="btn-actualizar" 
            onClick={cargarDatos}
            disabled={loading || actualizando}
          >
            {actualizando ? '🔄 Actualizando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-inventario">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Productos</h3>
            <p className="stat-number">{estadisticas?.total_productos || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Stock Total</h3>
            <p className="stat-number">{estadisticas?.stock_total || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Valor Inventario</h3>
            <p className="stat-number">Q{estadisticas?.valor_total_inventario?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Stock Bajo</h3>
            <p className="stat-number">{estadisticas?.productos_stock_bajo || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="tabla-inventario">
        <h3>Inventario de Productos</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map(item => (
                <tr key={item.inventario_id}>
                  <td>
                    <div className="producto-info">
                      <strong>{item.producto_nombre}</strong>
                    </div>
                  </td>
                  <td>{item.marca}</td>
                  <td>{item.categoria_nombre}</td>
                  <td>
                    <span className={`stock-actual ${getEstadoStockClass(item.estado_stock)}`}>
                      {item.stock_actual}
                    </span>
                  </td>
                  <td>{item.stock_minimo}</td>
                  <td>Q{item.costo_producto.toFixed(2)}</td>
                  <td>
                    <span className={`estado-stock ${getEstadoStockClass(item.estado_stock)}`}>
                      {getEstadoStockText(item.estado_stock)}
                    </span>
                  </td>
                  <td>{new Date(item.fecha_actualizacion).toLocaleDateString()}</td>
                  <td>
                    <div className="acciones">
                      <button 
                        className="btn-movimiento"
                        onClick={() => handleAgregarMovimiento(item)}
                        title="Agregar Movimiento"
                      >
                        📝
                      </button>
                      <button 
                        className="btn-editar"
                        onClick={() => handleEditarStockMinimo(item)}
                        title="Editar Stock Mínimo"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-eliminar"
                        onClick={() => handleEliminarProducto(item)}
                        title="Eliminar Producto"
                      >
                        🗑️
                      </button>
                      <button 
                        className="btn-movimientos"
                        onClick={() => cargarMovimientos(item.producto_id)}
                        title="Ver Movimientos"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movimientos Recientes */}
      {movimientos.length > 0 && (
        <div className="movimientos-recientes">
          <h3>Movimientos Recientes</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map(movimiento => (
                  <tr key={movimiento.movimiento_id}>
                    <td>
                      <span className={`tipo-movimiento ${movimiento.tipo_movimiento}`}>
                        {movimiento.tipo_movimiento === 'entrada' ? '📥' : '📤'} 
                        {movimiento.tipo_movimiento.toUpperCase()}
                      </span>
                    </td>
                    <td>{movimiento.cantidad}</td>
                    <td>{movimiento.motivo}</td>
                    <td>{movimiento.usuario_nombre}</td>
                    <td>{new Date(movimiento.fecha_movimiento).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Agregar Movimiento */}
      {mostrarModalMovimiento && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Agregar Movimiento - {productoSeleccionado?.producto_nombre}</h3>
              <button onClick={() => setMostrarModalMovimiento(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitMovimiento}>
              <div className="form-group">
                <label>Tipo de Movimiento:</label>
                <select 
                  value={formularioMovimiento.tipo_movimiento}
                  onChange={(e) => setFormularioMovimiento({...formularioMovimiento, tipo_movimiento: e.target.value})}
                  required
                >
                  <option value="entrada">📥 Entrada</option>
                  <option value="salida">📤 Salida</option>
                  <option value="ajuste">🔧 Ajuste</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cantidad:</label>
                <input 
                  type="number" 
                  value={formularioMovimiento.cantidad}
                  onChange={(e) => setFormularioMovimiento({...formularioMovimiento, cantidad: e.target.value})}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Motivo:</label>
                <textarea 
                  value={formularioMovimiento.motivo}
                  onChange={(e) => setFormularioMovimiento({...formularioMovimiento, motivo: e.target.value})}
                  required
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setMostrarModalMovimiento(false)}>
                  Cancelar
                </button>
                <button type="submit">Registrar Movimiento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Stock Mínimo */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Editar Stock Mínimo - {productoSeleccionado?.producto_nombre}</h3>
              <button onClick={() => setMostrarModalEditar(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitEditar}>
              <div className="form-group">
                <label>Stock Mínimo:</label>
                <input 
                  type="number" 
                  value={formularioEditar.stock_minimo}
                  onChange={(e) => setFormularioEditar({...formularioEditar, stock_minimo: e.target.value})}
                  required
                  min="0"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setMostrarModalEditar(false)}>
                  Cancelar
                </button>
                <button type="submit">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionInventario;
