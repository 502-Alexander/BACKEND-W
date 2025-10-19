// Tests para el componente Header
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CarritoProvider } from '../context/CarritoContext'
import Header from '../components/Header/Header'

// Wrapper para incluir providers necesarios
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CarritoProvider>
        {children}
      </CarritoProvider>
    </AuthProvider>
  </BrowserRouter>
)

describe('Header Component', () => {
  it('debería renderizar el logo', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )
    
    expect(screen.getByText('Nueva Tienda')).toBeInTheDocument()
  })

  it('debería renderizar el carrito', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )
    
    expect(screen.getByText('🛒')).toBeInTheDocument()
  })

  it('debería renderizar botones de autenticación', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    expect(screen.getByText('Registrarse')).toBeInTheDocument()
  })

  it('debería renderizar enlace a agendar cita', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )
    
    expect(screen.getByText('Agendar Cita')).toBeInTheDocument()
  })
})
