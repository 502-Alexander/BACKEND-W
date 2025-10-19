// Hook personalizado para manejar responsive design
import { useState, useEffect } from 'react'

// Hook para detectar el tamaño de pantalla
export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    // Función para actualizar el tamaño de pantalla
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize)

    // Limpiar listener al desmontar
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Definir breakpoints
  const breakpoints = {
    xs: 480,   // Móviles pequeños
    sm: 768,   // Móviles grandes / tablets pequeñas
    md: 1024,  // Tablets / laptops pequeñas
    lg: 1200,  // Laptops / desktops pequeños
    xl: 1440   // Desktops grandes
  }

  // Funciones para verificar tamaños
  const isMobile = screenSize.width < breakpoints.sm
  const isTablet = screenSize.width >= breakpoints.sm && screenSize.width < breakpoints.md
  const isDesktop = screenSize.width >= breakpoints.md
  const isLargeDesktop = screenSize.width >= breakpoints.lg

  // Función para obtener el tipo de dispositivo
  const getDeviceType = () => {
    if (isMobile) return 'mobile'
    if (isTablet) return 'tablet'
    if (isDesktop) return 'desktop'
    return 'large-desktop'
  }

  // Función para obtener el número de columnas según el dispositivo
  const getGridColumns = (mobile = 1, tablet = 2, desktop = 3, largeDesktop = 4) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    if (isLargeDesktop) return largeDesktop
    return desktop
  }

  // Función para obtener el tamaño de fuente según el dispositivo
  const getFontSize = (baseSize) => {
    if (isMobile) return baseSize * 0.9
    if (isTablet) return baseSize * 0.95
    return baseSize
  }

  // Función para obtener el padding según el dispositivo
  const getPadding = (mobile = '1rem', tablet = '1.5rem', desktop = '2rem') => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  return {
    screenSize,
    breakpoints,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    getDeviceType,
    getGridColumns,
    getFontSize,
    getPadding
  }
}

// Hook para detectar orientación
export function useOrientation() {
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  )

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    window.addEventListener('resize', handleOrientationChange)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return orientation
}
