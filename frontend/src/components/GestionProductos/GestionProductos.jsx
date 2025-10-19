import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GestionProductos.css';

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalImagenes, setMostrarModalImagenes] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    marca: '',
    categoria_id: '',
    descripcion: '',
    precio: '',
    stock_minimo: '',
    activo: 1
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Recargando datos de productos...');

      const [productosResponse, categoriasResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/productos'),
        axios.get('http://localhost:4000/api/categorias')
      ]);

      console.log('📦 Productos cargados:', productosResponse.data.data);
      
      // Log detallado de cada producto para verificar las imágenes
      productosResponse.data.data.forEach((producto, index) => {
        console.log(`📦 Producto ${index + 1}:`, {
          nombre: producto.nombre,
          imagen: producto.imagen,
          producto_id: producto.producto_id
        });
      });
      
      setProductos(productosResponse.data.data);
      setCategorias(categoriasResponse.data.data);

    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoProducto = () => {
    setFormulario({
      nombre: '',
      marca: '',
      categoria_id: '',
      descripcion: '',
      precio: '',
      stock_minimo: '',
      activo: 1
    });
    setMostrarModalNuevo(true);
  };

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setFormulario({
      nombre: producto.nombre,
      marca: producto.marca,
      categoria_id: producto.categoria_id,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock_minimo: producto.stock_minimo || '',
      activo: producto.activo
    });
    setMostrarModalEditar(true);
  };

  const handleGestionarImagenes = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModalImagenes(true);
  };

  const handleEliminarProducto = async (producto) => {
    if (window.confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
      try {
        await axios.delete(`http://localhost:4000/api/productos/${producto.producto_id}`);
        await cargarDatos();
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleSubmitNuevo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/productos', formulario);
      setMostrarModalNuevo(false);
      await cargarDatos();
      alert('Producto creado exitosamente');
    } catch (error) {
      console.error('Error creando producto:', error);
      alert('Error al crear el producto');
    }
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/productos/${productoSeleccionado.producto_id}`, formulario);
      setMostrarModalEditar(false);
      await cargarDatos();
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando producto:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleCambiarEstado = async (producto, nuevoEstado) => {
    try {
      console.log('🔄 Cambiando estado del producto:', producto.nombre);
      console.log('📊 Estado actual:', producto.activo, 'Stock actual:', producto.stock);
      console.log('🎯 Nuevo estado:', nuevoEstado);

      let datosActualizacion = {
        nombre: producto.nombre,
        marca: producto.marca,
        categoria_id: producto.categoria_id,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock_actual: producto.stock,
        stock_minimo: producto.stock_minimo,
        activo: nuevoEstado === 2 ? 0 : (nuevoEstado === 1 ? 1 : 0) // 1=activo, 0=inactivo, 2=agotado
      };
      
      if (nuevoEstado === 2) { // Agotado
        datosActualizacion.stock_actual = 0; // Establecer stock en 0
        datosActualizacion.activo = 0; // También marcar como inactivo
        console.log('⚠️ Marcando como agotado - stock = 0, activo = 0');
      }

      console.log('📤 Enviando datos:', datosActualizacion);
      console.log('🔗 URL:', `http://localhost:4000/api/productos/${producto.producto_id}`);

      const response = await axios.put(`http://localhost:4000/api/productos/${producto.producto_id}`, datosActualizacion);
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      // Pequeño delay para asegurar que la BD se haya actualizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await cargarDatos();
      alert('Estado actualizado exitosamente');
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      console.error('📋 Error completo:', error.response?.data);
      console.error('🔍 Status:', error.response?.status);
      console.error('📝 Mensaje:', error.response?.data?.mensaje);
      
      alert(`Error al actualizar el estado: ${error.response?.data?.mensaje || error.message}`);
    }
  };

  const getEstadoTexto = (activo, stock) => {
    if (stock <= 0) return 'agotado';
    return activo === 1 ? 'activo' : 'inactivo';
  };

  const getEstadoValor = (activo, stock) => {
    console.log('🔍 Calculando estado valor - activo:', activo, 'stock:', stock);
    if (stock <= 0) return 2; // agotado
    return activo === 1 ? 1 : 0; // activo o inactivo
  };

  const handleSubirImagen = async (e, tipoImagen) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📸 Iniciando subida de imagen:', file.name);
    console.log('📦 Producto seleccionado:', productoSeleccionado);

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      console.log('🔄 Enviando imagen al servidor...');
      const response = await axios.post(
        `http://localhost:4000/api/productos/${productoSeleccionado.producto_id}/imagen`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: { tipo: tipoImagen }
        }
      );

      console.log('📥 Respuesta del servidor:', response.data);

      if (response.data.success) {
        console.log('✅ Imagen subida exitosamente, recargando datos...');
        await cargarDatos();
        alert('Imagen subida exitosamente');
        setMostrarModalImagenes(false); // Cerrar modal después de subir
      } else {
        console.log('❌ Error en la respuesta:', response.data.mensaje);
        alert('Error al subir la imagen: ' + response.data.mensaje);
      }
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      console.error('📋 Detalles del error:', error.response?.data);
      alert('Error al subir la imagen: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  if (loading) {
    return (
      <div className="gestion-productos-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gestion-productos-error">
        <h3>Error al cargar los productos</h3>
        <p>{error}</p>
        <button onClick={cargarDatos}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="gestion-productos">
      <div className="header-productos">
        <h2>📦 Gestión de Productos</h2>
        <button className="btn-nuevo-producto" onClick={handleNuevoProducto}>
          ➕ Nuevo Producto
        </button>
      </div>

      <div className="productos-table">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.producto_id}>
                <td>
                  <div className="imagen-container">
                    <img 
                      src={producto.imagen ? `http://localhost:4001${producto.imagen}` : '/images/producto-default.svg'} 
                      alt={producto.nombre}
                      className="imagen-producto"
                      onError={(e) => {
                        console.log('❌ Error cargando imagen:', producto.imagen);
                        e.target.src = '/images/producto-default.svg';
                      }}
                      onLoad={() => {
                        console.log('✅ Imagen cargada exitosamente:', producto.imagen);
                      }}
                    />
                    <div className="imagen-info">
                      <small>{producto.imagen ? 'Con imagen' : 'Sin imagen'}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="producto-info">
                    <strong>{producto.nombre}</strong>
                    <p className="descripcion-corta">{producto.descripcion?.substring(0, 50)}...</p>
                  </div>
                </td>
                <td>{producto.marca}</td>
                <td>{producto.categoria_nombre}</td>
                <td>Q{producto.precio.toFixed(2)}</td>
                <td>
                  <span className={`stock ${producto.stock <= 0 ? 'agotado' : producto.stock <= producto.stock_minimo ? 'bajo' : 'normal'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>
                  <select 
                    className={`estado-select ${getEstadoTexto(producto.activo, producto.stock)}`}
                    value={getEstadoValor(producto.activo, producto.stock)}
                    onChange={(e) => handleCambiarEstado(producto, parseInt(e.target.value))}
                    title="Cambiar estado del producto"
                  >
                    <option value={1}>✅ Activo</option>
                    <option value={0}>❌ Inactivo</option>
                    <option value={2}>⚠️ Agotado</option>
                  </select>
                </td>
                <td>
                  <div className="acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditarProducto(producto)}
                      title="Editar Producto"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-imagenes"
                      onClick={() => handleGestionarImagenes(producto)}
                      title="Subir Imagen"
                    >
                      📸
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminarProducto(producto)}
                      title="Eliminar Producto"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Producto */}
      {mostrarModalNuevo && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Nuevo Producto</h3>
              <button onClick={() => setMostrarModalNuevo(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitNuevo}>
              <div className="form-group">
                <label>Nombre:</label>
                <input 
                  type="text" 
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Marca:</label>
                <input 
                  type="text" 
                  value={formulario.marca}
                  onChange={(e) => setFormulario({...formulario, marca: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Categoría:</label>
                <select 
                  value={formulario.categoria_id}
                  onChange={(e) => setFormulario({...formulario, categoria_id: e.target.value})}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea 
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Precio:</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formulario.precio}
                  onChange={(e) => setFormulario({...formulario, precio: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Mínimo:</label>
                <input 
                  type="number" 
                  value={formulario.stock_minimo}
                  onChange={(e) => setFormulario({...formulario, stock_minimo: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setMostrarModalNuevo(false)}>
                  Cancelar
                </button>
                <button type="submit">Crear Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Producto */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Editar Producto</h3>
              <button onClick={() => setMostrarModalEditar(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitEditar}>
              <div className="form-group">
                <label>Nombre:</label>
                <input 
                  type="text" 
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Marca:</label>
                <input 
                  type="text" 
                  value={formulario.marca}
                  onChange={(e) => setFormulario({...formulario, marca: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Categoría:</label>
                <select 
                  value={formulario.categoria_id}
                  onChange={(e) => setFormulario({...formulario, categoria_id: e.target.value})}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea 
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Precio:</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formulario.precio}
                  onChange={(e) => setFormulario({...formulario, precio: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Mínimo:</label>
                <input 
                  type="number" 
                  value={formulario.stock_minimo}
                  onChange={(e) => setFormulario({...formulario, stock_minimo: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Estado:</label>
                <select 
                  value={formulario.activo}
                  onChange={(e) => setFormulario({...formulario, activo: parseInt(e.target.value)})}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setMostrarModalEditar(false)}>
                  Cancelar
                </button>
                <button type="submit">Actualizar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gestionar Imágenes */}
      {mostrarModalImagenes && (
        <div className="modal-overlay">
          <div className="modal modal-imagenes">
            <div className="modal-header">
              <h3>Subir Imagen - {productoSeleccionado?.nombre}</h3>
              <button onClick={() => setMostrarModalImagenes(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="imagenes-container">
                <div className="imagen-item">
                  <h4>Imagen del Producto</h4>
                  <div className="imagen-preview">
                    {productoSeleccionado?.imagen ? (
                      <div>
                        <img 
                          src={`http://localhost:4001${productoSeleccionado.imagen}`} 
                          alt="Producto" 
                          onError={(e) => {
                            console.log('❌ Error cargando imagen en modal:', productoSeleccionado.imagen);
                            e.target.src = '/images/producto-default.svg';
                          }}
                        />
                        <p><small>URL: {productoSeleccionado.imagen}</small></p>
                      </div>
                    ) : (
                      <div className="sin-imagen">Sin imagen</div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSubirImagen(e, 'principal')}
                    style={{ display: 'none' }}
                    id="imagen-producto"
                  />
                  <label htmlFor="imagen-producto" className="btn-subir-imagen">
                    📸 Subir Imagen del Producto
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;
