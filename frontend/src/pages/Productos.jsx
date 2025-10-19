// Página de listado de productos con filtros
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productoService } from '../services/productoService'
import ProductoCard from '../components/ProductoCard/ProductoCard'
import '../styles/Productos.css'

function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Estados para filtros
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroOrden, setFiltroOrden] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  // Aplicar filtros desde URL
  useEffect(() => {
    const categoria = searchParams.get('categoria') || ''
    setFiltroCategoria(categoria)
  }, [searchParams])

  // Función para cargar productos y categorías
  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [productosData, categoriasData] = await Promise.all([
        productoService.obtenerProductos(),
        productoService.obtenerCategorias()
      ])
      
      setProductos(productosData)
      setCategorias(categoriasData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = !filtroCategoria || producto.categoria === filtroCategoria
    const coincideBusqueda = !busqueda || 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    
    return coincideCategoria && coincideBusqueda
  })

  // Función para ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (filtroOrden) {
      case 'precio-asc':
        return a.precio - b.precio
      case 'precio-desc':
        return b.precio - a.precio
      case 'nombre-asc':
        return a.nombre.localeCompare(b.nombre)
      case 'nombre-desc':
        return b.nombre.localeCompare(a.nombre)
      default:
        return 0
    }
  })

  // Función para manejar cambio de filtros
  const manejarCambioFiltro = (tipo, valor) => {
    switch (tipo) {
      case 'categoria':
        setFiltroCategoria(valor)
        setSearchParams(valor ? { categoria: valor } : {})
        break
      case 'orden':
        setFiltroOrden(valor)
        break
      case 'busqueda':
        setBusqueda(valor)
        break
    }
  }

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroCategoria('')
    setFiltroOrden('')
    setBusqueda('')
    setSearchParams({})
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="productos-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="productos-error">
        <h2>❌ Error al cargar los productos</h2>
        <p>{error}</p>
        <button onClick={cargarDatos} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="productos">
      <div className="container">
        {/* Header de la página */}
        <div className="productos-header">
          <h1 className="productos-titulo">Nuestros Productos</h1>
          <p className="productos-subtitulo">
            Descubre nuestra amplia selección de productos de calidad
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="productos-filtros">
          <div className="filtros-grid">
            {/* Búsqueda */}
            <div className="filtro-grupo">
              <label htmlFor="busqueda">Buscar productos:</label>
              <input
                id="busqueda"
                type="text"
                placeholder="Nombre o descripción..."
                value={busqueda}
                onChange={(e) => manejarCambioFiltro('busqueda', e.target.value)}
                className="filtro-input"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="filtro-grupo">
              <label htmlFor="categoria">Categoría:</label>
              <select
                id="categoria"
                value={filtroCategoria}
                onChange={(e) => manejarCambioFiltro('categoria', e.target.value)}
                className="filtro-select"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria.id || categoria} value={categoria.nombre || categoria}>
                    {categoria.nombre || categoria}
                  </option>
                ))}
              </select>
            </div>


            {/* Ordenar por */}
            <div className="filtro-grupo">
              <label htmlFor="orden">Ordenar por:</label>
              <select
                id="orden"
                value={filtroOrden}
                onChange={(e) => manejarCambioFiltro('orden', e.target.value)}
                className="filtro-select"
              >
                <option value="">Orden por defecto</option>
                <option value="nombre-asc">Nombre: A - Z</option>
                <option value="nombre-desc">Nombre: Z - A</option>
              </select>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(filtroCategoria || filtroOrden || busqueda) && (
            <div className="filtros-acciones">
              <button onClick={limpiarFiltros} className="btn btn-outline">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="productos-resultados">
          <div className="resultados-header">
            <p className="resultados-contador">
              {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''} encontrado{productosOrdenados.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Lista de productos */}
          {productosOrdenados.length > 0 ? (
            <div className="productos-grid">
              {productosOrdenados.map(producto => (
                <ProductoCard key={producto.producto_id ?? producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="productos-vacio">
              <div className="vacio-icono">🔍</div>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros o realizar una búsqueda diferente</p>
              <button onClick={limpiarFiltros} className="btn btn-primary">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Productos
