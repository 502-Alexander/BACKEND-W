import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload/ImageUpload';
//import "../styles/AdminProductos.css";
import "../styles/AdminProductos.css";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const response = await fetch('http://localhost:4000/api/productos');
      const result = await response.json();
      
      if (result.success) {
        setProductos(result.data);
      } else {
        console.error('Error cargando productos:', result.mensaje);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const manejarImagenesSubidas = (imagenes) => {
    console.log('Imágenes subidas:', imagenes);
    // Recargar productos para mostrar las nuevas imágenes
    cargarProductos();
  };

  if (cargando) {
    return (
      <div className="admin-productos-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-productos-container">
      <div className="admin-header">
        <h1>Administración de Productos</h1>
        <p>Gestiona las imágenes de los productos del salón</p>
      </div>

      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.producto_id} className="producto-admin-card">
            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              <p className="producto-precio">Q{producto.precio}</p>
              <p className="producto-stock">Stock: {producto.stock}</p>
              
              <div className="producto-imagenes">
                <div className="imagen-item">
                  <label>Imagen Principal:</label>
                  {producto.foto1 ? (
                    <img src={`http://localhost:4001${producto.foto1}`} alt="Principal" />
                  ) : (
                    <div className="sin-imagen">Sin imagen</div>
                  )}
                </div>
                
                <div className="imagen-item">
                  <label>Imagen Secundaria:</label>
                  {producto.foto2 ? (
                    <img src={`http://localhost:4001${producto.foto2}`} alt="Secundaria" />
                  ) : (
                    <div className="sin-imagen">Sin imagen</div>
                  )}
                </div>
              </div>
            </div>

            <div className="producto-acciones">
              <button
                className="btn btn-primary"
                onClick={() => setProductoSeleccionado(producto)}
              >
                Subir Imágenes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para subir imágenes */}
      {productoSeleccionado && (
        <div className="modal-overlay" onClick={() => setProductoSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Subir Imágenes - {productoSeleccionado.nombre}</h2>
              <button 
                className="close-button"
                onClick={() => setProductoSeleccionado(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <ImageUpload
                productId={productoSeleccionado.producto_id}
                onImagesUploaded={manejarImagenesSubidas}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;
