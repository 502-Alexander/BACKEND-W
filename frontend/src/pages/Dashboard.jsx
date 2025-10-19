// Dashboard unificado para administradores
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar/Sidebar'
import ReportesUnificadosSimple from '../components/ReportesUnificados/ReportesUnificadosSimple'
import GestionCitas from '../components/GestionCitas/GestionCitas'
import GestionClientes from '../components/GestionClientes/GestionClientes'
import GestionProductos from '../components/GestionProductos/GestionProductos'
import GestionInventario from '../components/GestionInventario/GestionInventario'
import ReportesServicios from '../components/ReportesServicios/ReportesServicios'
import ResumenGeneral from '../components/ResumenGeneral/ResumenGeneral'
import ReportesAvanzados from '../components/ReportesAvanzados/ReportesAvanzados'
import '../styles/Dashboard.css'

function Dashboard() {
  const { usuario, isAdmin, logout } = useAuth()
  const [moduloActivo, setModuloActivo] = useState('dashboard')

  // Verificar que el usuario sea administrador
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/'
      return
    }
  }, [isAdmin])

  // Función para cambiar de módulo
  const cambiarModulo = (modulo) => {
    setModuloActivo(modulo)
  }

  // Función para renderizar el contenido según el módulo activo
  const renderizarContenido = () => {
    switch (moduloActivo) {
      case 'dashboard':
        return (
          <div className="dashboard-main-content">
            <ResumenGeneral onCambiarModulo={cambiarModulo} />
          </div>
        )
      case 'ventas':
      case 'productos':
        return <ReportesUnificadosSimple />
      case 'reportes-productos':
        return <ReportesAvanzados />
      case 'gestion-citas':
        return <GestionCitas />
      case 'gestion-clientes':
        return <GestionClientes />
      case 'gestion-productos':
        return <GestionProductos />
      case 'reportes-servicios':
        return <ReportesServicios />
      case 'gestion-stock':
        return <GestionInventario />
      default:
        return (
          <div className="dashboard-main-content">
            <ResumenGeneral onCambiarModulo={cambiarModulo} />
          </div>
        )
    }
  }

  // Mostrar loading si no es admin
  if (!isAdmin()) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Verificando permisos de administrador...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Sidebar de navegación */}
      <Sidebar 
        moduloActivo={moduloActivo}
        onCambiarModulo={cambiarModulo}
      />

      {/* Contenido principal */}
      <div className="dashboard-main">
        {renderizarContenido()}
      </div>
    </div>
  )
}

export default Dashboard
