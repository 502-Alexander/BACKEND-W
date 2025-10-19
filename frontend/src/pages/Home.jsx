// Página principal de la tienda
import { Link } from 'react-router-dom'
import salonImage from '../assets/Salon Sandra.jpg'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="highlight">Salón Sandra Fajardo</span>
            </h1>
            <p className="hero-description">
              Belleza y elegancia en cada detalle. Descubre los mejores tratamientos capilares 
              con la mejor calidad y atención personalizada. Tu satisfacción es nuestra prioridad.
            </p>
            <div className="hero-actions">
              <Link to="/productos" className="btn btn-primary btn-lg">
                Ver Productos
              </Link>
              <Link to="/servicios" className="btn btn-outline btn-lg">
                Nuestros Servicios
              </Link>
              <Link to="/carrito" className="btn btn-outline btn-lg">
                Mi Carrito
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-container">
              <img 
                src={salonImage} 
                alt="Salón Sandra Fajardo - Servicios de Belleza" 
                className="hero-main-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="mision-section">
        <div className="container">
          <div className="mision-content">
            <div className="mision-icon">
              <span className="mision-emoji">✨</span>
            </div>
            <div className="mision-text">
              <h2 className="mision-title">Nuestra Misión</h2>
              <p className="mision-description">
                Brindar un servicio de belleza exclusivo y personalizado, llevando tratamientos capilares de alta calidad directamente a las clientas, asegurando resultados profesionales sin que ellas tengan que salir de casa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="vision-section">
        <div className="container">
          <div className="vision-content">
            <div className="vision-text">
              <h2 className="vision-title">Nuestra Visión</h2>
              <p className="vision-description">
                Convertirse en la marca líder en el servicio de belleza en Guatemala, combinando innovación y exclusividad brindando un portafolio de productos que permitan a cada clienta cuidar su imagen con los mejores tratamientos del mercado.
              </p>
            </div>
            <div className="vision-icon">
              <span className="vision-emoji">🎯</span>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="valores-section">
        <div className="container">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon">
                <span className="valor-emoji">✨</span>
              </div>
              <h3 className="valor-titulo">Exclusividad</h3>
              <p className="valor-descripcion">Servicios únicos y personalizados que nos distinguen en el mercado</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">
                <span className="valor-emoji">🎯</span>
              </div>
              <h3 className="valor-titulo">Personalización</h3>
              <p className="valor-descripcion">Cada tratamiento adaptado a las necesidades específicas de cada clienta</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">
                <span className="valor-emoji">💎</span>
              </div>
              <h3 className="valor-titulo">Calidad</h3>
              <p className="valor-descripcion">Productos y servicios de la más alta calidad para resultados excepcionales</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">
                <span className="valor-emoji">🤝</span>
              </div>
              <h3 className="valor-titulo">Confianza</h3>
              <p className="valor-descripcion">Relaciones sólidas basadas en la transparencia y honestidad</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">
                <span className="valor-emoji">❤️</span>
              </div>
              <h3 className="valor-titulo">Respeto</h3>
              <p className="valor-descripcion">Trato digno y profesional hacia cada una de nuestras clientas</p>
            </div>
          </div>
        </div>
      </section>


      {/* Características */}
      <section className="caracteristicas-section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="caracteristicas-grid">
            <div className="caracteristica-card">
              <div className="caracteristica-icon">🚚</div>
              <h3>Envío Rápido</h3>
              <p>Entrega en toda la ciudad</p>
            </div>
            <div className="caracteristica-card">
              <div className="caracteristica-icon">🔒</div>
              <h3>Compra Segura</h3>
              <p>Pagos 100% seguros y protegidos</p>
            </div>
            <div className="caracteristica-card">
              <div className="caracteristica-icon">💎</div>
              <h3>Calidad Garantizada</h3>
              <p>Productos de la más alta calidad</p>
            </div>
            <div className="caracteristica-card">
              <div className="caracteristica-icon">🎯</div>
              <h3>Atención 24/7</h3>
              <p>Soporte al cliente siempre disponible</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
