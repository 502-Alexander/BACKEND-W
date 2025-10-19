// Página de listado de servicios para la tienda en línea
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ServicioCard from '../components/ServicioCard/ServicioCard'
import { servicioService } from '../services/servicioService'
import '../styles/Servicios.css'

function Servicios() {
  const [servicios, setServicios] = useState([])
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState('todos') // todos, servicios, combos
  const [busqueda, setBusqueda] = useState('')

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  // Función para cargar servicios y combos
  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      // Cargar datos del backend
      const [serviciosData, combosData] = await Promise.all([
        servicioService.obtenerServicios(),
        servicioService.obtenerCombos()
      ])
      
      // Agregar tipo a los datos y normalizar estructura
      const serviciosConTipo = serviciosData.map(servicio => ({
        ...servicio,
        tipo: 'servicio',
        duracion: servicio.duracion || '60 min', // Duración por defecto
        precio_base: servicio.precio || servicio.precio_base, // Normalizar precio
        servicios_incluidos: servicio.servicios_incluidos || []
      }))
      
      const combosConTipo = combosData.map(combo => ({
        ...combo,
        tipo: 'combo',
        duracion: combo.duracion || '120 min', // Duración por defecto
        precio_base: combo.precio || combo.precio_base, // Normalizar precio
        servicios_incluidos: combo.servicios_incluidos || []
      }))
      
      // Si no hay datos del backend, usar datos de ejemplo
      if (serviciosConTipo.length === 0 && combosConTipo.length === 0) {
        console.log('⚠️ No hay datos en el backend, usando datos de ejemplo')
        
        const serviciosEjemplo = [
          {
            id: 1,
            nombre: "Corte y Peinado",
            descripcion: "Corte profesional con lavado y peinado incluido",
            precio_base: 25000,
            duracion: "60 min",
            tipo: "servicio"
          },
          {
            id: 2,
            nombre: "Tintura Completa",
            descripcion: "Tintura profesional con productos de alta calidad",
            precio_base: 45000,
            duracion: "120 min",
            tipo: "servicio"
          },
          {
            id: 3,
            nombre: "Tratamiento Capilar",
            descripcion: "Tratamiento hidratante para cabello dañado",
            precio_base: 35000,
            duracion: "90 min",
            tipo: "servicio"
          }
        ]

        const combosEjemplo = [
          {
            id: 1,
            nombre: "Combo Belleza Completa",
            descripcion: "Corte + Tintura + Tratamiento",
            precio_base: 95000,
            precio_original: 105000,
            duracion: "240 min",
            tipo: "combo",
            servicios_incluidos: ["Corte y Peinado", "Tintura Completa", "Tratamiento Capilar"]
          }
        ]
        
        setServicios(serviciosEjemplo)
        setCombos(combosEjemplo)
      } else {
        setServicios(serviciosConTipo)
        setCombos(combosConTipo)
      }
    } catch (err) {
      console.error('Error cargando servicios:', err)
      
      // En caso de error, mostrar datos de ejemplo
      console.log('⚠️ Error en el backend, usando datos de ejemplo')
      
      const serviciosEjemplo = [
        {
          id: 1,
          nombre: "Corte y Peinado",
          descripcion: "Corte profesional con lavado y peinado incluido",
          precio_base: 25000,
          duracion: "60 min",
          tipo: "servicio"
        },
        {
          id: 2,
          nombre: "Tintura Completa",
          descripcion: "Tintura profesional con productos de alta calidad",
          precio_base: 45000,
          duracion: "120 min",
          tipo: "servicio"
        }
      ]

      const combosEjemplo = [
        {
          id: 1,
          nombre: "Combo Belleza Completa",
          descripcion: "Corte + Tintura + Tratamiento",
          precio_base: 95000,
          precio_original: 105000,
          duracion: "240 min",
          tipo: "combo",
          servicios_incluidos: ["Corte y Peinado", "Tintura Completa", "Tratamiento Capilar"]
        }
      ]
      
      setServicios(serviciosEjemplo)
      setCombos(combosEjemplo)
    } finally {
      setLoading(false)
    }
  }

  // Función para filtrar servicios y combos
  const serviciosFiltrados = servicios.filter(servicio => {
    const coincideTipo = filtroTipo === 'todos' || filtroTipo === 'servicios'
    const coincideBusqueda = !busqueda || 
      servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    
    return coincideTipo && coincideBusqueda
  })

  const combosFiltrados = combos.filter(combo => {
    const coincideTipo = filtroTipo === 'todos' || filtroTipo === 'combos'
    const coincideBusqueda = !busqueda || 
      combo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      combo.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    
    return coincideTipo && coincideBusqueda
  })

  // Mostrar loading
  if (loading) {
    return (
      <div className="servicios-loading">
        <div className="spinner"></div>
        <p>Cargando servicios...</p>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="servicios-error">
        <h2>❌ Error al cargar los servicios</h2>
        <p>{error}</p>
        <button onClick={cargarDatos} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="servicios-page">
      {/* Header */}
      <div className="servicios-header">
        <div className="container">
          <h1 className="servicios-title"> Nuestros Servicios</h1>
          <p className="servicios-subtitle">
            Descubre nuestros tratamientos profesionales de belleza capilar
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="servicios-filtros">
        <div className="container">
          <div className="filtros-content">
            {/* Búsqueda */}
            <div className="filtro-busqueda">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="busqueda-input"
              />
            </div>

            {/* Filtro por tipo */}
            <div className="filtro-tipo">
              <button
                className={`filtro-btn ${filtroTipo === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroTipo('todos')}
              >
                Todos
              </button>
              <button
                className={`filtro-btn ${filtroTipo === 'servicios' ? 'active' : ''}`}
                onClick={() => setFiltroTipo('servicios')}
              >
                Servicios
              </button>
              <button
                className={`filtro-btn ${filtroTipo === 'combos' ? 'active' : ''}`}
                onClick={() => setFiltroTipo('combos')}
              >
                Combos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Servicios */}
      {(filtroTipo === 'todos' || filtroTipo === 'servicios') && serviciosFiltrados.length > 0 && (
        <section className="servicios-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">✨ Servicios Individuales</h2>
            </div>
            <div className="servicios-grid">
              {serviciosFiltrados.map((servicio) => (
                <ServicioCard key={servicio.id} servicio={servicio} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Combos */}
      {(filtroTipo === 'todos' || filtroTipo === 'combos') && combosFiltrados.length > 0 && (
        <section className="combos-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🎁 Combos Especiales</h2>
            </div>
            <div className="servicios-grid">
              {combosFiltrados.map((combo) => (
                <ServicioCard key={combo.id} servicio={combo} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sin resultados */}
      {serviciosFiltrados.length === 0 && combosFiltrados.length === 0 && (
        <div className="sin-resultados">
          <div className="container">
            <div className="sin-resultados-content">
              <h3>🔍 No se encontraron servicios</h3>
              <p>Intenta con otros términos de búsqueda o filtros</p>
              <button 
                onClick={() => {
                  setBusqueda('')
                  setFiltroTipo('todos')
                }}
                className="btn btn-primary"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Lista para tu próxima cita?</h2>
            <p>Agenda tu servicio favorito y disfruta de una experiencia única</p>
            <div className="cta-actions">
              <Link to="/agendar-cita" className="btn btn-primary btn-lg">
                Agendar Cita
              </Link>
              <Link to="/productos" className="btn btn-outline btn-lg">
                Ver Productos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Servicios
