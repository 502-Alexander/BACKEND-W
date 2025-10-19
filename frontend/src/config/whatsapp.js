// Configuración de WhatsApp - Salón de Belleza
export const WHATSAPP_CONFIG = {
  // Número de WhatsApp del Salón de Belleza
  // Formato: código_país + número (sin - ni espacios)
  // Guatemala: 502 + 40439206
  NUMERO: '50240439206', // WhatsApp del Salón: 4043-9206
  
  // Mensaje personalizado del salón
  MENSAJE_FINAL: '¡Gracias por elegir nuestro salón! 💄✨\n\nTe contactaremos pronto para confirmar tu pedido y coordinar la entrega.'
}

// Función para validar el número de WhatsApp
export const validarNumeroWhatsApp = (numero) => {
  // Debe tener entre 10 y 15 dígitos
  const regex = /^\d{10,15}$/
  return regex.test(numero)
}

// Función para formatear el número
export const formatearNumeroWhatsApp = (numero) => {
  return numero.replace(/\D/g, '') // Solo números
}
