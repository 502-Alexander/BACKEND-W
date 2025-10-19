// Componente para mostrar una tarjeta de producto
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import './ProductoCard.css'

function ProductoCard({ producto }) {
  const [cantidad, setCantidad] = useState(1)
  const [agregando, setAgregando] = useState(false)
  const { agregarAlCarrito, estaEnCarrito, obtenerCantidad } = useCarrito()

  // Verificar si el producto está en el carrito
  const productoId = producto.producto_id ?? producto.id
  const enCarrito = estaEnCarrito(productoId)
  const cantidadEnCarrito = obtenerCantidad(productoId)

  // Función para manejar el agregado al carrito
  const manejarAgregarAlCarrito = async () => {
    if (agregando) return

    try {
      setAgregando(true)
      await agregarAlCarrito(producto, cantidad)
      
      // Mostrar feedback visual
        const boton = document.querySelector(`[data-producto-id="${productoId}"]`)
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
    if (nuevaCantidad > 0 && nuevaCantidad <= (producto.stock_actual || producto.stock || 0)) {
      setCantidad(nuevaCantidad)
    }
  }

  return (
    <div className="producto-card">
      {/* Imagen del producto */}
      <div className="producto-imagen">
        <Link to={`/productos/${productoId}`}>
          <img 
            src={producto.foto1 || producto.imagen || '/images/producto-default.svg'} 
            alt={producto.nombre}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/producto-default.svg';
            }}
          />
        </Link>
        {/* Badge de categoría */}
        <span className="producto-categoria">{producto.categoria_nombre || producto.categoria}</span>
        {/* Badge de stock */}
        {producto.stock < 10 && (
          <span className="producto-stock-badge">
            ¡Solo {producto.stock} disponibles!
          </span>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="producto-contenido">
        {/* Nombre del producto */}
        <h3 className="producto-nombre">
          <Link to={`/productos/${productoId}`}>
            {producto.nombre}
          </Link>
        </h3>

        {/* Marca */}
        {producto.marca && (
          <p className="producto-marca">{producto.marca}</p>
        )}

        {/* Categoría */}
        {(producto.categoria_nombre || producto.categoria) && (
          <p className="producto-categoria">{producto.categoria_nombre || producto.categoria}</p>
        )}

        {/* Descripción */}
        <p className="producto-descripcion">
          {producto.descripcion}
        </p>

        {/* Precio */}
        <div className="producto-precio">
          <span className="precio-actual">Q{producto.precio.toFixed(2)}</span>
          {producto.precio > 1000 && (
            <span className="precio-descuento">
              Q{(producto.precio * 0.9).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock disponible */}
        <div className="producto-stock">
            <span className={`stock-indicator ${(producto.stock_actual || producto.stock || 0) > 10 ? 'disponible' : 'limitado'}`}>
              {(producto.stock_actual || producto.stock || 0) > 10 ? 'En stock' : `${producto.stock_actual || producto.stock || 0} disponibles`}
          </span>
        </div>

        {/* Controles de cantidad y agregar al carrito */}
        <div className="producto-controles">
          {/* Selector de cantidad */}
          <div className="cantidad-selector">
              <label htmlFor={`cantidad-${productoId}`}>Cantidad:</label>
              <select
                id={`cantidad-${productoId}`}
              value={cantidad}
              onChange={manejarCambioCantidad}
              disabled={agregando}
            >
              {Array.from({ length: Math.min(producto.stock_actual || producto.stock || 0, 10) }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de agregar al carrito */}
          <button
              className={`btn btn-primary producto-btn ${agregando ? 'loading' : ''} ${enCarrito ? 'en-carrito' : ''}`}
            onClick={manejarAgregarAlCarrito}
            disabled={agregando || (producto.stock_actual || producto.stock) === 0}
            data-producto-id={productoId}
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
            ) : (producto.stock_actual || producto.stock) === 0 ? (
              'Sin stock'
            ) : (
              'Agregar al carrito'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoCard
