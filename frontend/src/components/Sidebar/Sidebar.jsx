// Componente Sidebar para navegación del dashboard
import './Sidebar.css'

function Sidebar({ moduloActivo, onCambiarModulo }) {
  // Definir los módulos disponibles del dashboard
  const modulos = [
    {
      id: 'dashboard',
      nombre: 'Dashboard',
      icono: '📊',
      descripcion: 'Vista general y estadísticas'
    },
    {
      id: 'ventas',
      nombre: 'Reportes de Ventas',
      icono: '💰',
      descripcion: 'Análisis de ventas y ingresos'
    },
    {
      id: 'reportes-servicios',
      nombre: 'Reportes de Servicios',
      icono: '💇‍♀️',
      descripcion: 'Análisis de servicios más solicitados'
    },
    {
      id: 'gestion-citas',
      nombre: 'Gestión de Citas',
      icono: '📋',
      descripcion: 'Administrar citas programadas'
    },
    {
      id: 'gestion-productos',
      nombre: 'Gestión de Productos',
      icono: '📦',
      descripcion: 'CRUD completo de productos'
    },
    {
      id: 'gestion-stock',
      nombre: 'Gestión de Stock',
      icono: '📋',
      descripcion: 'Control de inventario y stock'
    },
    {
      id: 'gestion-clientes',
      nombre: 'Gestión de Clientes',
      icono: '👤',
      descripcion: 'Administrar clientes'
    },
    {
      id: 'reportes-productos',
      nombre: 'Reportes Avanzados',
      icono: '📊',
      descripcion: 'Análisis detallado de productos'
    }
  ]

  return (
    <aside className="sidebar">
      {/* Header del sidebar */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🛍️</span>
          <div className="logo-text">
            <h3>Nueva Tienda</h3>
            <p>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navegación de módulos */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {modulos.map((modulo) => (
            <li key={modulo.id} className="nav-item">
              <button
                className={`nav-link ${moduloActivo === modulo.id ? 'active' : ''}`}
                onClick={() => onCambiarModulo(modulo.id)}
                title={modulo.descripcion}
              >
                <span className="nav-icon">{modulo.icono}</span>
                <span className="nav-text">{modulo.nombre}</span>
                {moduloActivo === modulo.id && (
                  <span className="nav-indicator"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="footer-text">Panel de Administración</p>
          <p className="footer-version">v1.0.0</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
