// Contexto para manejar el estado global del carrito de compras
import { createContext, useContext, useReducer, useEffect } from 'react'
// import { carritoService } from '../services/carritoService' // Temporalmente deshabilitado
// import { useAuth } from './AuthContext' // Removido para evitar dependencias circulares

// Estado inicial del carrito
const initialState = {
  items: [],
  total: 0,
  cantidad: 0,
  loading: false,
  error: null
}

// Tipos de acciones para el reducer
const CARRITO_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CARRITO: 'SET_CARRITO',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CARRITO: 'CLEAR_CARRITO'
}

// Reducer para manejar el estado del carrito
function carritoReducer(state, action) {
  switch (action.type) {
    case CARRITO_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case CARRITO_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case CARRITO_ACTIONS.SET_CARRITO:
      const items = action.payload || [];
      return {
        ...state,
        items: items,
        total: items.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0),
        cantidad: items.reduce((sum, item) => sum + item.cantidad, 0),
        loading: false,
        error: null
      }
    
    case CARRITO_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.producto_id === action.payload.producto_id)
      let newItems
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.producto_id === action.payload.producto_id
            ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0),
        cantidad: newItems.reduce((sum, item) => sum + item.cantidad, 0)
      }
    
    case CARRITO_ACTIONS.UPDATE_ITEM:
      const updatedItems = state.items.map(item =>
        item.producto_id === action.payload.producto_id
          ? { ...item, cantidad: action.payload.cantidad }
          : item
      ).filter(item => item.cantidad > 0)
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0),
        cantidad: updatedItems.reduce((sum, item) => sum + item.cantidad, 0)
      }
    
    case CARRITO_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(item => item.producto_id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0),
        cantidad: filteredItems.reduce((sum, item) => sum + item.cantidad, 0)
      }
    
    case CARRITO_ACTIONS.CLEAR_CARRITO:
      return {
        ...state,
        items: [],
        total: 0,
        cantidad: 0
      }
    
    default:
      return state
  }
}

// Crear el contexto
const CarritoContext = createContext()

// Hook personalizado para usar el contexto del carrito
export function useCarrito() {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider')
  }
  return context
}

// Provider del contexto del carrito - ULTRA SIMPLIFICADO
export function CarritoProvider({ children }) {
  const [state, dispatch] = useReducer(carritoReducer, initialState)

  // Helper para localStorage
  const guardarCarritoInvitado = (items) => {
    try {
      localStorage.setItem('carrito_invitado', JSON.stringify(items))
    } catch (error) {
      console.log('Error guardando en localStorage:', error)
    }
  }

  // Cargar carrito al inicializar - ULTRA SIMPLIFICADO
  useEffect(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito_invitado')
      if (carritoGuardado) {
        const items = JSON.parse(carritoGuardado)
        dispatch({ type: CARRITO_ACTIONS.SET_CARRITO, payload: items })
      }
    } catch (error) {
      console.log('Error cargando carrito:', error)
      dispatch({ type: CARRITO_ACTIONS.SET_CARRITO, payload: [] })
    }
  }, [])

  // Función para agregar producto al carrito - ULTRA SIMPLIFICADA
  const agregarAlCarrito = (producto, cantidad = 1) => {
    try {
      const itemCarrito = {
        producto_id: producto.producto_id || producto.id,
        nombre: producto.nombre,
        marca: producto.marca || '',
        precio_unitario: parseFloat(producto.precio || producto.precio_unitario || 0),
        imagen: producto.imagen || producto.foto1 || '/images/producto-default.svg',
        cantidad: parseInt(cantidad),
        stock_actual: parseInt(producto.stock_actual || producto.stock || 0),
        stock_minimo: parseInt(producto.stock_minimo || 0),
        activo: Boolean(producto.activo !== false),
        subtotal: parseFloat(producto.precio || producto.precio_unitario || 0) * parseInt(cantidad)
      }
      
      const existente = state.items.find(i => i.producto_id === itemCarrito.producto_id)
      const nuevos = existente
        ? state.items.map(i => i.producto_id === itemCarrito.producto_id ? { ...i, cantidad: i.cantidad + itemCarrito.cantidad } : i)
        : [...state.items, itemCarrito]
      
      guardarCarritoInvitado(nuevos)
      dispatch({ type: CARRITO_ACTIONS.ADD_ITEM, payload: itemCarrito })
    } catch (error) {
      console.error('Error agregando al carrito:', error)
    }
  }

  // Función para actualizar cantidad de un item - ULTRA SIMPLIFICADA
  const actualizarCantidad = (productoId, cantidad) => {
    try {
      const nuevos = state.items
        .map(i => i.producto_id === productoId ? { ...i, cantidad } : i)
        .filter(i => i.cantidad > 0)
      guardarCarritoInvitado(nuevos)
      dispatch({ type: CARRITO_ACTIONS.UPDATE_ITEM, payload: { producto_id: productoId, cantidad } })
    } catch (error) {
      console.error('Error actualizando cantidad:', error)
    }
  }

  // Función para eliminar producto del carrito - ULTRA SIMPLIFICADA
  const eliminarDelCarrito = (productoId) => {
    try {
      const nuevos = state.items.filter(i => i.producto_id !== productoId)
      guardarCarritoInvitado(nuevos)
      dispatch({ type: CARRITO_ACTIONS.REMOVE_ITEM, payload: productoId })
    } catch (error) {
      console.error('Error eliminando del carrito:', error)
    }
  }

  // Función para vaciar el carrito - ULTRA SIMPLIFICADA
  const vaciarCarrito = () => {
    try {
      dispatch({ type: CARRITO_ACTIONS.CLEAR_CARRITO })
      localStorage.removeItem('carrito_invitado')
    } catch (error) {
      console.error('Error vaciando carrito:', error)
      dispatch({ type: CARRITO_ACTIONS.CLEAR_CARRITO })
    }
  }

  // Función para verificar si un producto está en el carrito
  const estaEnCarrito = (productoId) => {
    return state.items.some(item => item.producto_id === productoId)
  }

  // Función para obtener la cantidad de un producto en el carrito
  const obtenerCantidad = (productoId) => {
    const item = state.items.find(item => item.producto_id === productoId)
    return item ? item.cantidad : 0
  }

  // Función para procesar checkout - ULTRA SIMPLIFICADA
  const procesarCheckout = (datosCheckout = {}) => {
    try {
      // Simplificado: solo retornar éxito
      return { success: true, message: 'Checkout procesado localmente' }
    } catch (error) {
      console.error('Error procesando checkout:', error)
      return { success: false, message: 'Error procesando checkout' }
    }
  }

  const value = {
    // Estado
    items: state.items,
    total: state.total,
    cantidad: state.cantidad,
    loading: state.loading,
    error: state.error,
    
    // Acciones
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    estaEnCarrito,
    obtenerCantidad,
    procesarCheckout
  }

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  )
}
