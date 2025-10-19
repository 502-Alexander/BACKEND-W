import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ComprobanteCarrito.css';

const ComprobanteCarrito = forwardRef(({ items, total, cantidad, cliente = {} }, ref) => {
  const comprobanteRef = useRef();

  // Calcular subtotal y totales
  const subtotal = total;
  const envio = total >= 500 ? 0 : 50;
  const impuestos = total * 0.16;
  const totalFinal = subtotal + envio + impuestos;

  // Función para generar y descargar PDF
  const generarPDF = async () => {
    try {
      const canvas = await html2canvas(comprobanteRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generar nombre del archivo con fecha
      const fecha = new Date().toLocaleDateString('es-GT');
      const hora = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
      const nombreArchivo = `Comprobante_${fecha.replace(/\//g, '-')}_${hora.replace(/:/g, '-')}.pdf`;

      pdf.save(nombreArchivo);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  // Exponer la función generarPDF al componente padre
  useImperativeHandle(ref, () => ({
    generarPDF
  }));

  return (
    <div className="comprobante-container">
      {/* Botón para descargar */}
      <div className="comprobante-acciones">
        <button onClick={generarPDF} className="btn-descargar-pdf">
          📄 Descargar Comprobante PDF
        </button>
      </div>

      {/* Comprobante (oculto visualmente pero visible para PDF) */}
      <div ref={comprobanteRef} className="comprobante-pdf">
        {/* Header del comprobante */}
        <div className="comprobante-header">
          <h1>Salón Sandra Fajardo</h1>
          <h2>COMPROBANTE DE COMPRA</h2>
          <div className="comprobante-info">
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-GT')}</p>
            <p><strong>Hora:</strong> {new Date().toLocaleTimeString('es-GT')}</p>
            <p><strong>Número de productos:</strong> {cantidad}</p>
          </div>
          <div className="comprobante-info" style={{ marginTop: 8 }}>
            {cliente?.nombre && <p><strong>Nombre:</strong> {cliente.nombre}</p>}
            {cliente?.direccion && <p><strong>Dirección:</strong> {cliente.direccion}</p>}
            {cliente?.telefono && <p><strong>Teléfono:</strong> {cliente.telefono}</p>}
            {cliente?.correo && <p><strong>Correo:</strong> {cliente.correo}</p>}
          </div>
        </div>

        {/* Lista de productos */}
        <div className="comprobante-productos">
          <h3>PRODUCTOS A PAGAR</h3>
          <div className="productos-tabla">
            <div className="tabla-header">
              <div>Producto</div>
              <div>Cantidad</div>
              <div>Precio Unit.</div>
              <div>Subtotal</div>
            </div>
            
            {items.map((item, index) => (
              <div key={item.producto_id || item.id} className="tabla-fila">
                <div className="producto-nombre">
                  <strong>{item.nombre}</strong>
                  {item.marca && <span className="marca"> - {item.marca}</span>}
                </div>
                <div className="cantidad">{item.cantidad}</div>
                <div className="precio-unit">Q{item.precio_unitario.toFixed(2)}</div>
                <div className="subtotal">Q{(item.precio_unitario * item.cantidad).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de totales */}
        <div className="comprobante-totales">
          <h3>RESUMEN DE TOTALES</h3>
          <div className="totales-detalle">
            <div className="total-linea">
              <span>Subtotal de productos:</span>
              <span>Q{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="total-linea">
              <span>Envío:</span>
              <span>{envio === 0 ? 'Gratis' : `Q${envio.toFixed(2)}`}</span>
            </div>
            
            <div className="total-linea">
              <span>Impuestos (16%):</span>
              <span>Q{impuestos.toFixed(2)}</span>
            </div>
            
            <div className="total-divider"></div>
            
            <div className="total-final">
              <span><strong>TOTAL A PAGAR:</strong></span>
              <span><strong>Q{totalFinal.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="comprobante-footer">
          <p>¡Gracias por tu compra!</p>
          <p>Este comprobante es válido para el proceso de pago</p>
          <div className="footer-info">
            <p>📦 Envío en 24-48 horas</p>
            <p>🔒 Compra 100% segura</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComprobanteCarrito;

