// Script para probar el envío de correos de confirmación de inicio de sesión
// Ejecutar con: node scripts/probar_email_login.js

const emailService = require('../services/emailService');

async function probarEmailLogin() {
  console.log('🧪 Probando envío de correo de confirmación de inicio de sesión...');
  console.log('📸 Usando logo del salón: http://localhost:4000/uploads/logo.jpg\n');
  
  // Datos de prueba
  const email = 'test@salonsandra.com';
  const nombre = 'Usuario de Prueba';
  const fechaHora = new Date().toLocaleString('es-GT', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  try {
    // Verificar conexión del servicio de email
    console.log('1. Verificando conexión del servicio de email...');
    const conexionOk = await emailService.verificarConexion();
    
    if (!conexionOk) {
      console.error('❌ Error: No se pudo conectar al servicio de email');
      console.log('\n📋 Verifica tu configuración en el archivo .env:');
      console.log('EMAIL_HOST=smtp.gmail.com');
      console.log('EMAIL_PORT=587');
      console.log('EMAIL_USER=tu_email@gmail.com');
      console.log('EMAIL_PASS=tu_contraseña_de_aplicacion');
      return;
    }
    
    console.log('✅ Conexión al servicio de email exitosa\n');
    
    // Enviar correo de prueba
    console.log('2. Enviando correo de confirmación de inicio de sesión...');
    const resultado = await emailService.enviarCorreoInicioSesion(
      email,
      nombre,
      fechaHora
    );
    
    if (resultado.success) {
      console.log('✅ Correo de confirmación enviado exitosamente');
      console.log(`📧 Message ID: ${resultado.messageId}`);
      console.log(`📬 Enviado a: ${email}`);
      console.log(`⏰ Fecha/Hora: ${fechaHora}`);
    } else {
      console.error('❌ Error al enviar correo:', resultado.error);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
probarEmailLogin().then(() => {
  console.log('\n🏁 Prueba completada');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
