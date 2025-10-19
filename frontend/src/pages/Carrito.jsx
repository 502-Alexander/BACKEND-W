// Página del carrito de compras
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import ComprobanteCarrito from '../components/ComprobanteCarrito/ComprobanteCarrito'
import { WHATSAPP_CONFIG } from '../config/whatsapp'
import '../styles/Carrito.css'

function Carrito() {
  const { 
    items, 
    total, 
    cantidad, 
    loading, 
    error, 
    actualizarCantidad, 
    eliminarDelCarrito, 
    vaciarCarrito,
    procesarCheckout
  } = useCarrito()

  const [procesando, setProcesando] = useState(false)
  const [checkoutData, setCheckoutData] = useState({
    metodo_pago: 'Efectivo',
    observaciones: '',
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  })

  // Referencia para el componente de comprobante
  const comprobanteRef = useRef()

  // Función para manejar cambio de cantidad
  const manejarCambioCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await eliminarDelCarrito(productoId)
    } else {
      await actualizarCantidad(productoId, nuevaCantidad)
    }
  }

  // Función para manejar eliminación de producto
  const manejarEliminar = async (productoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      await eliminarDelCarrito(productoId)
    }
  }

  // Función para manejar vaciado del carrito
  const manejarVaciarCarrito = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      await vaciarCarrito()
    }
  }

  // Función para enviar pedido a WhatsApp
  const manejarCheckout = async () => {
    if (items.length === 0) {
      alert('El carrito está vacío')
      return
    }

    // Validar datos requeridos
    if (!checkoutData.nombre || !checkoutData.direccion || !checkoutData.telefono) {
      alert('Por favor completa todos los campos obligatorios: Nombre, Dirección y Teléfono')
      return
    }

    setProcesando(true)
    
    try {
      // Crear mensaje para WhatsApp
      const mensaje = crearMensajeWhatsApp()
      
      // Abrir WhatsApp con el mensaje
      const numeroWhatsApp = WHATSAPP_CONFIG.NUMERO
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
      
      // Abrir en nueva ventana
      window.open(urlWhatsApp, '_blank')
      
      // Generar y descargar PDF automáticamente (después de abrir WhatsApp)
      // Temporalmente deshabilitado para evitar problemas de carga
      /*
      try {
        if (comprobanteRef.current && 
            comprobanteRef.current.generarPDF && 
            typeof comprobanteRef.current.generarPDF === 'function') {
          await comprobanteRef.current.generarPDF()
        }
      } catch (pdfError) {
        console.error('Error generando PDF:', pdfError)
        // No mostrar error al usuario, solo continuar
      }
      */
      
      // Mostrar confirmación
      alert(`¡Pedido enviado exitosamente!
      
📱 Se abrió WhatsApp del salón (4043-9206) con tu pedido completo
📄 Envía el mensaje para confirmar tu compra y coordinar el pago
📄 Puedes descargar tu comprobante PDF usando el botón de descarga

¡Gracias por elegir nuestros productos de belleza!`)
      
      // Limpiar carrito después de enviar
      try {
        await vaciarCarrito()
        console.log('✅ Carrito limpiado después del envío')
      } catch (carritoError) {
        console.error('Error limpiando carrito:', carritoError)
        // No es crítico, el pedido ya se envió
      }
      
    } catch (error) {
      console.error('Error al enviar a WhatsApp:', error)
      alert(`Error al enviar el pedido: ${error.message}`)
    } finally {
      // Asegurar que siempre se resetee el estado procesando
      setProcesando(false)
      console.log('✅ Estado procesando reseteado')
    }
  }

  // Función para crear mensaje de WhatsApp
  const crearMensajeWhatsApp = () => {
    const fecha = new Date().toLocaleDateString('es-GT')
    const hora = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
    
    let mensaje = `💄 *PEDIDO SALÓN DE BELLEZA*\n`
    mensaje += `📅 Fecha: ${fecha} ${hora}\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    
    // Datos del cliente
    mensaje += `👤 *DATOS DEL CLIENTE*\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    mensaje += `• Nombre: ${checkoutData.nombre}\n`
    mensaje += `• Dirección: ${checkoutData.direccion}\n`
    mensaje += `• Teléfono: ${checkoutData.telefono}\n`
    mensaje += `• Correo: ${checkoutData.correo || 'No especificado'}\n\n`
    
    // Productos
    mensaje += `🛍️ *PRODUCTOS SOLICITADOS*\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    items.forEach((item, index) => {
      mensaje += `${index + 1}. *${item.nombre}*\n`
      mensaje += `   📦 Cantidad: ${item.cantidad}\n`
      mensaje += `   💰 Precio: Q${item.precio_unitario.toFixed(2)}\n`
      mensaje += `   📊 Subtotal: Q${(item.precio_unitario * item.cantidad).toFixed(2)}\n\n`
    })
    
    // Resumen
    mensaje += `💰 *RESUMEN DEL PEDIDO*\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    mensaje += `• Subtotal productos: Q${total.toFixed(2)}\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    mensaje += `💳 *TOTAL A PAGAR: Q${total.toFixed(2)}*\n\n`
    
    // Método de pago y observaciones
    mensaje += `💳 *MÉTODO DE PAGO*\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    mensaje += `• ${checkoutData.metodo_pago}\n\n`
    
    if (checkoutData.observaciones) {
      mensaje += `📝 *OBSERVACIONES*\n`
      mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      mensaje += `• ${checkoutData.observaciones}\n\n`
    }
    
    mensaje += `✅ *CONFIRMACIÓN*\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    mensaje += `Confirmo este pedido y procedo con el pago por ${checkoutData.metodo_pago}.\n\n`
    mensaje += `📞 *COMUNICACIÓN CON EL SALÓN*\n`
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    mensaje += `Por favor confirma este pedido y coordina el método de pago.\n\n`
    mensaje += WHATSAPP_CONFIG.MENSAJE_FINAL
    
    return mensaje
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="carrito-loading">
        <div className="spinner"></div>
        <p>Cargando carrito...</p>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="carrito-error">
        <h2>❌ Error al cargar el carrito</h2>
        <p>{error}</p>
        <Link to="/productos" className="btn btn-primary">
          Ver Productos
        </Link>
      </div>
    )
  }

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <div className="vacio-icono">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos para comenzar tu compra</p>
        <div className="vacio-acciones">
          <Link to="/productos" className="btn btn-primary">
            Ver Productos
          </Link>
          <Link to="/" className="btn btn-outline">
            Ir al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="carrito">
      <div className="container">
        {/* Header del carrito */}
        <div className="carrito-header">
          <h1 className="carrito-titulo">Mi Carrito</h1>
          <p className="carrito-subtitulo">
            {cantidad} producto{cantidad !== 1 ? 's' : ''} en tu carrito
          </p>
        </div>

        <div className="carrito-content">
          {/* Lista de productos */}
          <div className="carrito-productos">
            <div className="productos-header">
              <h2>Productos</h2>
              {items.length > 0 && (
                <button 
                  onClick={manejarVaciarCarrito}
                  className="btn btn-outline btn-sm"
                >
                  Vaciar carrito
                </button>
              )}
            </div>

            <div className="productos-lista">
              {items.map((item) => (
                <div key={item.producto_id || item.id} className="carrito-item">
                  {/* Imagen del producto */}
                  <div className="item-imagen">
                    <Link to={`/productos/${item.producto_id || item.id}`}>
                      <img 
                        src={item.imagen} 
                        alt={item.nombre}
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  {/* Información del producto */}
                  <div className="item-info">
                    <h3 className="item-nombre">
                      <Link to={`/productos/${item.producto_id || item.id}`}>
                        {item.nombre}
                      </Link>
                    </h3>
                    <p className="item-precio">Q{item.precio_unitario.toFixed(2)}</p>
                    {item.marca && <p className="item-marca">{item.marca}</p>}
                    <div className="item-stock">
                      Stock disponible: {item.stock_actual}
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="item-cantidad">
                      <label htmlFor={`cantidad-${item.producto_id || item.id}`}>Cantidad:</label>
                      <select
                        id={`cantidad-${item.producto_id || item.id}`}
                      value={item.cantidad}
                      onChange={(e) => manejarCambioCantidad(item.producto_id || item.id, parseInt(e.target.value))}
                      className="cantidad-select"
                    >
                      {Array.from({ length: Math.min(item.stock_actual, 10) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Precio total del item */}
                  <div className="item-total">
                    <span className="total-label">Total:</span>
                    <span className="total-precio">
                      Q{(item.precio_unitario * item.cantidad).toFixed(2)}
                    </span>
                  </div>

                  {/* Botón eliminar */}
                  <div className="item-acciones">
                    <button
                      onClick={() => manejarEliminar(item.producto_id || item.id)}
                      className="btn-eliminar"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario de checkout */}
            <div className="checkout-form">
              <h4>Datos para el Pedido</h4>
              <div className="checkout-info">
                <p>💄 <strong>Proceso de Compra:</strong> Al hacer clic en "Enviar Pedido a WhatsApp", se abrirá WhatsApp del salón (4043-9206) con tu pedido completo. Solo necesitas enviar el mensaje para confirmar tu compra y coordinar el pago.</p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    id="nombre"
                    type="text"
                    className="form-control"
                    value={checkoutData.nombre}
                    onChange={(e) => setCheckoutData({ ...checkoutData, nombre: e.target.value })}
                    placeholder="Nombre y Apellido"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    id="direccion"
                    type="text"
                    className="form-control"
                    value={checkoutData.direccion}
                    onChange={(e) => setCheckoutData({ ...checkoutData, direccion: e.target.value })}
                    placeholder="Calle, número, zona, ciudad"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    type="tel"
                    className="form-control"
                    value={checkoutData.telefono}
                    onChange={(e) => setCheckoutData({ ...checkoutData, telefono: e.target.value })}
                    placeholder="Ej. 5555-5555"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="correo">Correo</label>
                  <input
                    id="correo"
                    type="email"
                    className="form-control"
                    value={checkoutData.correo}
                    onChange={(e) => setCheckoutData({ ...checkoutData, correo: e.target.value })}
                    placeholder="micorreo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="metodo-pago">Método de Pago:</label>
                <select 
                  id="metodo-pago"
                  value={checkoutData.metodo_pago}
                  onChange={(e) => setCheckoutData({...checkoutData, metodo_pago: e.target.value})}
                  className="form-control"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="observaciones">Observaciones (opcional):</label>
                <textarea 
                  id="observaciones"
                  value={checkoutData.observaciones}
                  onChange={(e) => setCheckoutData({...checkoutData, observaciones: e.target.value})}
                  className="form-control"
                  rows="2"
                  placeholder="Instrucciones especiales para la entrega..."
                ></textarea>
              </div>
              
              {/* Botón de enviar pedido */}
              <button
                className={`checkout-submit-btn ${procesando ? 'loading' : ''}`}
                onClick={manejarCheckout}
                disabled={procesando}
              >
                {procesando ? (
                  <>
                    <span className="spinner-small"></span>
                    Enviando...
                  </>
                ) : (
                  'Enviar Pedido'
                )}
              </button>
            </div>
          </div>

          {/* Resumen del carrito */}
          <div className="carrito-resumen">
            <div className="resumen-card">
              <h3 className="resumen-titulo">Resumen del Pedido</h3>
              
              <div className="resumen-detalles">
                <div className="resumen-linea">
                  <span>Productos ({cantidad}):</span>
                  <span>Q{total.toFixed(2)}</span>
                </div>
                
                <div className="resumen-divider"></div>
                
                <div className="resumen-total">
                  <span>Total:</span>
                  <span>Q{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="resumen-acciones">
                <button
                    className={`btn btn-primary btn-lg ${procesando ? 'loading' : ''}`}
                  onClick={manejarCheckout}
                  disabled={procesando}
                >
                  {procesando ? (
                    <>
                      <span className="spinner-small"></span>
                      Procesando...
                    </>
                  ) : (
                    'Comunicar con el Salón'
                  )}
                </button>
                
                <Link to="/productos" className="btn btn-outline">
                  Continuar Comprando
                </Link>
              </div>

              {/* Información de seguridad */}
              <div className="resumen-seguridad">
                <p>🔒 Compra 100% segura</p>
                <p>📦 Envío en 24-48 horas</p>
                <p>↩️ Devolución en 30 días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comprobante PDF - Solo renderizar si hay productos */}
        {items.length > 0 && (
          <ComprobanteCarrito 
            ref={comprobanteRef}
            items={items}
            total={total}
            cantidad={cantidad}
            cliente={{
              nombre: checkoutData.nombre,
              direccion: checkoutData.direccion,
              telefono: checkoutData.telefono,
              correo: checkoutData.correo
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Carrito
