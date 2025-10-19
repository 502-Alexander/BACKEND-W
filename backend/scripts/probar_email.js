// Script para probar la configuración del email
// Este archivo verifica que la configuración de Gmail esté correcta

const emailService = require('../services/emailService');

// Función para probar la configuración del email
const probarConfiguracion = async () => {
  console.log(' Probando configuración del email...');
  console.log(' Host:', process.env.EMAIL_HOST);
  console.log(' Puerto:', process.env.EMAIL_PORT);
  console.log(' Usuario:', process.env.EMAIL_USER);
  console.log(' Contraseña:', process.env.EMAIL_PASS ? '***configurada***' : ' NO CONFIGURADA');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(' ERROR: Configuración de email incompleta');
    console.log(' Revisa el archivo .env y sigue las instrucciones en CONFIGURAR_EMAIL.md');
    return;
  }

  if (process.env.EMAIL_USER === 'tu-email@gmail.com' || process.env.EMAIL_PASS === 'tu-password-de-aplicacion') {
    console.log('ERROR: No has actualizado las credenciales de email');
    console.log('Edita el archivo .env con tus datos reales');
    return;
  }

  try {
    // Verificar conexión con Gmail
    const conexionOK = await emailService.verificarConexion();
    
    if (conexionOK) {
      console.log(' ¡Configuración de email correcta!');
      console.log(' El sistema está listo para enviar correos');
      
      // Probar envío de correo de prueba
      console.log(' Enviando correo de prueba...');
      const resultado = await emailService.enviarCorreoVerificacion(
        process.env.EMAIL_USER, // Enviar a ti mismo
        'Usuario de Prueba',
        'token-de-prueba-123'
      );
      
      if (resultado.success) {
        console.log('¡Correo de prueba enviado exitosamente!');
        console.log(' Revisa tu bandeja de entrada');
      } else {
        console.log(' Error al enviar correo de prueba:', resultado.error);
      }
    } else {
      console.log(' Error en la configuración del email');
      console.log(' Verifica tus credenciales en el archivo .env');
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.log(' Posibles soluciones:');
    console.log('   1. Verifica que la verificación en 2 pasos esté activada');
    console.log('   2. Usa la contraseña de aplicación (no tu contraseña normal)');
    console.log('   3. Verifica que el email esté correcto');
  }
};

// Ejecutar la prueba
probarConfiguracion();
