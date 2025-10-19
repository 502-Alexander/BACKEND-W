// Componente principal de la aplicación
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Carrito from './pages/Carrito'
import ProductoDetalle from './pages/ProductoDetalle'
import Dashboard from './pages/Dashboard'
import AgendarCita from './pages/AgendarCita'
import Servicios from './pages/Servicios'
import VerificarEmail from './pages/VerificarEmail'
import AdminProductos from './pages/AdminProductos'
import Login from './components/Login/Login'
import Registro from './components/Registro/Registro'
import AdminLogin from './components/AdminLogin/AdminLogin'
import { CarritoProvider } from './context/CarritoContext'
import { AuthProvider } from './context/AuthContext'  
import Layout from './Layout/Layout'
import './styles/globalHF.css'
import './styles/App.css'

function App() {
  // Estados para controlar los modales de autenticación
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [mostrarAdminLogin, setMostrarAdminLogin] = useState(false)

  // Función para mostrar login
  const mostrarModalLogin = () => {
    setMostrarLogin(true)
    setMostrarRegistro(false)
    setMostrarAdminLogin(false)
  }

  // Función para mostrar registro
  const mostrarModalRegistro = () => {
    setMostrarRegistro(true)
    setMostrarLogin(false)
    setMostrarAdminLogin(false)
  }

  // Función para mostrar login de admin
  const mostrarModalAdminLogin = () => {
    setMostrarAdminLogin(true)
    setMostrarLogin(false)
    setMostrarRegistro(false)
  }

  // Función para cerrar todos los modales
  const cerrarModales = () => {
    setMostrarLogin(false)
    setMostrarRegistro(false)
    setMostrarAdminLogin(false)
  }

  return (
    <AuthProvider>
      <CarritoProvider>
        <div className="app">
          {/* Layout con Header y Footer integrados */}
          <Layout onMostrarLogin={mostrarModalLogin}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/agendar-cita" element={<AgendarCita />} />
              <Route path="/citas" element={<AgendarCita />} />
              <Route path="/verificar-email" element={<VerificarEmail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-productos" element={<AdminProductos />} />
            </Routes>
          </Layout>
          
          {/* Modales de autenticación */}
          {mostrarLogin && (
            <Login 
              onClose={cerrarModales}
              onSwitchToRegistro={mostrarModalRegistro}
              onSwitchToAdmin={mostrarModalAdminLogin}
            />
          )}

          {mostrarRegistro && (
            <Registro 
              onClose={cerrarModales}
              onSwitchToLogin={mostrarModalLogin}
            />
          )}

          {mostrarAdminLogin && (
            <AdminLogin 
              onClose={cerrarModales}
              onSwitchToLogin={mostrarModalLogin}
            />
          )}
        </div>
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App
