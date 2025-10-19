// Tests para el componente ProductoCard
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CarritoProvider } from '../context/CarritoContext'
import ProductoCard from '../components/ProductoCard/ProductoCard'

const productoMock = {
  id: 1,
  nombre: 'Laptop Gaming Pro',
  precio: 1299.99,
  descripcion: 'Laptop de alto rendimiento para gaming',
  imagen: 'https://example.com/laptop.jpg',
  categoria: 'Electrónicos',
  stock: 15
}

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <CarritoProvider>
      {children}
    </CarritoProvider>
  </BrowserRouter>
)

describe('ProductoCard Component', () => {
  it('debería renderizar información del producto', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={productoMock} />
      </TestWrapper>
    )
    
    expect(screen.getByText('Laptop Gaming Pro')).toBeInTheDocument()
    expect(screen.getByText('$1,299.99')).toBeInTheDocument()
    expect(screen.getByText('Electrónicos')).toBeInTheDocument()
  })

  it('debería renderizar botón de agregar al carrito', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={productoMock} />
      </TestWrapper>
    )
    
    expect(screen.getByText('Agregar al Carrito')).toBeInTheDocument()
  })

  it('debería renderizar imagen del producto', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={productoMock} />
      </TestWrapper>
    )
    
    const imagen = screen.getByAltText('Laptop Gaming Pro')
    expect(imagen).toBeInTheDocument()
    expect(imagen).toHaveAttribute('src', 'https://example.com/laptop.jpg')
  })
})
