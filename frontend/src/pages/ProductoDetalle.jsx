// Página de detalle de un producto específico
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productoService } from '../services/productoService'
import { useCarrito } from '../context/CarritoContext'
//import './styles/ProductoDetalle.css'
import '../styles/ProductoDetalle.css'

function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [agregando, setAgregando] = useState(false)
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0)

  const { agregarAlCarrito, estaEnCarrito, obtenerCantidad } = useCarrito()

  // Cargar producto al montar el componente
  useEffect(() => {
    if (id) {
      cargarProducto()
    }
  }, [id])

  // Función para cargar el producto
  const cargarProducto = async () => {
    try {
      setLoading(true)
      const productoData = await productoService.obtenerProducto(id)
      setProducto(productoData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para manejar agregado al carrito
  const manejarAgregarAlCarrito = async () => {
    if (agregando || !producto) return

    try {
      setAgregando(true)
      await agregarAlCarrito(producto, cantidad)
      
      // Mostrar feedback visual
      const boton = document.querySelector('.agregar-carrito-btn')
      if (boton) {
        boton.classList.add('success')
        setTimeout(() => {
          boton.classList.remove('success')
        }, 2000)
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error)
      alert('Error al agregar el producto al carrito')
    } finally {
      setAgregando(false)
    }
  }

  // Función para manejar cambio de cantidad
  const manejarCambioCantidad = (e) => {
    const nuevaCantidad = parseInt(e.target.value)
    if (nuevaCantidad > 0 && nuevaCantidad <= producto.stock) {
      setCantidad(nuevaCantidad)
    }
  }

  // Función para ir al carrito
  const irAlCarrito = () => {
    navigate('/carrito')
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="producto-detalle-loading">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    )
  }

  // Mostrar error
  if (error || !producto) {
    return (
      <div className="producto-detalle-error">
        <h2>❌ Producto no encontrado</h2>
        <p>{error || 'El producto que buscas no existe'}</p>
        <div className="error-acciones">
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            Volver
          </button>
          <Link to="/productos" className="btn btn-primary">
            Ver Productos
          </Link>
        </div>
      </div>
    )
  }

  // Verificar si está en el carrito
  const productoId = producto?.producto_id ?? producto?.id
  const enCarrito = estaEnCarrito(productoId)
  const cantidadEnCarrito = obtenerCantidad(productoId)

  return (
    <div className="producto-detalle">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>›</span>
          <Link to="/productos">Productos</Link>
          <span>›</span>
          <span>{producto.nombre}</span>
        </nav>

        {/* Contenido principal */}
        <div className="producto-detalle-content">
          {/* Galería de imágenes */}
          <div className="producto-imagenes">
            <div className="imagen-principal">
              <img 
                src={producto.imagen} 
                alt={producto.nombre}
                className="imagen-actual"
              />
              {producto.stock < 10 && (
                <div className="stock-badge">
                  ¡Solo {producto.stock} disponibles!
                </div>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="producto-info">
            {/* Categoría */}
            <div className="producto-categoria">
              <span className="categoria-badge">{producto.categoria}</span>
            </div>

            {/* Nombre */}
            <h1 className="producto-nombre">{producto.nombre}</h1>

            {/* Precio */}
            <div className="producto-precio">
              <span className="precio-actual">Q{producto.precio.toFixed(2)}</span>
              {producto.precio > 1000 && (
                <span className="precio-descuento">
                  Q{(producto.precio * 0.9).toFixed(2)}
                </span>
              )}
            </div>

            {/* Descripción */}
            <div className="producto-descripcion">
              <h3>Descripción</h3>
              <p>{producto.descripcion}</p>
            </div>

            {/* Stock */}
            <div className="producto-stock">
              <span className={`stock-indicator ${producto.stock > 10 ? 'disponible' : 'limitado'}`}>
                {producto.stock > 10 ? 'En stock' : `${producto.stock} disponibles`}
              </span>
            </div>

            {/* Controles de compra */}
            <div className="producto-controles">
              {/* Selector de cantidad */}
              <div className="cantidad-selector">
                <label htmlFor="cantidad">Cantidad:</label>
                <select
                  id="cantidad"
                  value={cantidad}
                  onChange={manejarCambioCantidad}
                  disabled={agregando}
                  className="cantidad-select"
                >
                  {Array.from({ length: Math.min(producto.stock, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones de acción */}
              <div className="producto-acciones">
                <button
                  className={`btn btn-primary agregar-carrito-btn ${agregando ? 'loading' : ''} ${enCarrito ? 'en-carrito' : ''}`}
                  onClick={manejarAgregarAlCarrito}
                  disabled={agregando || producto.stock === 0}
                >
                  {agregando ? (
                    <>
                      <span className="spinner-small"></span>
                      Agregando...
                    </>
                  ) : enCarrito ? (
                    <>
                      ✓ En carrito ({cantidadEnCarrito})
                    </>
                  ) : producto.stock === 0 ? (
                    'Sin stock'
                  ) : (
                    'Agregar al carrito'
                  )}
                </button>

                {enCarrito && (
                  <button
                    className="btn btn-outline"
                    onClick={irAlCarrito}
                  >
                    Ver carrito
                  </button>
                )}
              </div>
            </div>

            {/* Características adicionales */}
            <div className="producto-caracteristicas">
              <h3>Características</h3>
              <ul className="caracteristicas-lista">
                <li>✅ Garantía de 1 año</li>
                <li>✅ Envío gratis en compras mayores a $500</li>
                <li>✅ Devolución en 30 días</li>
                <li>✅ Soporte técnico 24/7</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <div className="productos-relacionados">
          <h2>Productos Relacionados</h2>
          <p>Otros productos que podrían interesarte</p>
          <div className="relacionados-acciones">
            <Link to="/productos" className="btn btn-outline">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetalle
