// =============================================================
// Se usa "children" para renderizar el contenido dinámico
// entre el header y el footer.
// =============================================================

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Importar contextos
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

// Importar estilos
import "../styles/globalHF.css";

function Layout({ children, onMostrarLogin }) {
  // ================================
  // Estados para el Header
  // ================================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cantidad, total } = useCarrito();
  const { usuario, isAuthenticated, logout } = useAuth(); // <-- Corregido aquí
  const { getPadding } = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";
  const isHomePage = location.pathname === "/";

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================================
  // Funciones de navegación
  // ================================
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const irAlCarrito = () => {
    navigate("/carrito");
    setIsMenuOpen(false);
  };
  const irAlDashboard = () => {
    navigate("/dashboard");
    setIsMenuOpen(false);
  };
  const manejarLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      {isDashboard ? (
        <header className="admin-header">
          <div className="container">
            <div className="admin-header-content">
              <div className="admin-welcome">
                <h1 className="admin-title">
                  <span className="admin-icon">👑</span>
                  ¡Hola Administrador, Bienvenido!
                </h1>
                <p className="admin-subtitle">Panel de Control - Salón Sandra Fajardo</p>
              </div>
              <div className="admin-actions">
                <button className="btn btn-outline btn-sm" onClick={() => navigate("/")}>
                  Volver al Sitio
                </button>
                <button className="btn btn-outline btn-sm" onClick={manejarLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <header className={`header ${isScrolled ? "scrolled" : ""}`}>
          <div className="container">
            <div className="header-content">
              <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
                <span className="logo-icon">🛍️</span>
                <span className="logo-text"> Salón Sandra Fajardo </span>
              </Link>

              <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
                <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                <Link to="/productos" className="nav-link" onClick={() => setIsMenuOpen(false)}>Productos</Link>
                <Link to="/citas" className="nav-link" onClick={() => setIsMenuOpen(false)}>Citas</Link>
                <Link to="/servicios" className="nav-link" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
                <Link to="/carrito" className="nav-link" onClick={() => setIsMenuOpen(false)}>Carrito</Link>

                {/* Solo Admin */}
                {isAuthenticated && usuario?.rol === "admin" && (
                  <button className="nav-link admin-link" onClick={irAlDashboard}>
                    Dashboard Administrativo
                  </button>
                )}
              </nav>

              <div className="header-actions">
                {/* Login/Logout */}
                {!isAuthenticated || usuario?.rol === 'invitado' ? (
                  <div className="auth-buttons">
                    <button className="btn btn-outline btn-sm" onClick={onMostrarLogin}>
                      Iniciar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="user-menu">
                    <span className="user-greeting">¡Hola, {usuario?.nombre || "Usuario"}!</span>
                    <button className="btn btn-outline btn-sm" onClick={manejarLogout}>
                      Cerrar Sesión
                    </button>
                  </div>
                )}

                {/* Carrito */}
                <button className="cart-button" onClick={irAlCarrito} title="Ver carrito">
                  <span className="cart-icon">🛒</span>
                  {cantidad > 0 && <span className="cart-badge">{cantidad}</span>}
                  {total > 0 && <span className="cart-total">${total.toFixed(2)}</span>}
                </button>

                {/* Menú móvil */}
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                  <span className={`hamburger ${isMenuOpen ? "active" : ""}`}>
                    <span></span><span></span><span></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* CONTENIDO */}
      <main className="flex-grow">{children}</main>

      {/* FOOTER */}
      {!isDashboard && (
        <footer className="footer">
          <div className="container">
            {/* Solo mostrar WhatsApp en la página de inicio */}
            {isHomePage && (
              <div className="footer-content">
                <div className="footer-section">
                  <div className="footer-title">
                    <span className="footer-icon">💬</span>
                    Contáctanos
                  </div>
                  <div className="footer-description">
                    ¿Tienes alguna pregunta? ¡Escríbenos por WhatsApp!
                  </div>
                  <a 
                    href="https://wa.me/50240439206" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                  >
                    <span className="whatsapp-icon">📲</span>
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
            <div className="footer-bottom">
              <div className="footer-divider"></div>
              <div className="footer-copyright">
                <p>&copy; 2024 Salón Sandra Fajardo. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Layout;
