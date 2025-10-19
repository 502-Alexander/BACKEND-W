// Componente wrapper para gráficas responsive
import { useResponsive } from '../../hooks/useResponsive'
import './ResponsiveChart.css'

function ResponsiveChart({ 
  children, 
  title, 
  subtitle, 
  className = '',
  height = 300 
}) {
  const { isMobile, isTablet, getFontSize } = useResponsive()

  // Calcular altura responsive
  const getResponsiveHeight = () => {
    if (isMobile) return Math.max(height * 0.7, 200)
    if (isTablet) return Math.max(height * 0.85, 250)
    return height
  }

  return (
    <div className={`responsive-chart ${className}`}>
      {/* Header de la gráfica */}
      {(title || subtitle) && (
        <div className="chart-header">
          {title && (
            <h3 
              className="chart-title"
              style={{ fontSize: getFontSize(1.25) }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p 
              className="chart-subtitle"
              style={{ fontSize: getFontSize(0.9) }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Contenedor de la gráfica */}
      <div 
        className="chart-content"
        style={{ height: getResponsiveHeight() }}
      >
        {children}
      </div>
    </div>
  )
}

export default ResponsiveChart
