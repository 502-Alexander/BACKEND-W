// Servicio de email para envío de correos de verificación
// Este archivo maneja toda la configuración y envío de correos electrónicos

const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transporter de Nodemailer
// Este objeto se encarga de la conexión con el servidor de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Servidor SMTP de Gmail
  port: process.env.EMAIL_PORT || 587, // Puerto seguro para Gmail
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, // Tu email de Gmail
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación de Gmail
  }
});

// Función para verificar la conexión del servicio de email
// Esto nos permite saber si la configuración es correcta
const verificarConexion = async () => {
  try {
    await transporter.verify();
    console.log('✅ Servidor de email configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error en la configuración del email:', error.message);
    return false;
  }
};

// Función para enviar correo de verificación de cuenta
// Esta función se llama cuando un usuario se registra
const enviarCorreoVerificacion = async (email, nombre, token) => {
  try {
    // URL de verificación que se enviará al usuario
    const urlVerificacion = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;
    
    // Configuración del correo
    const mailOptions = {
      from: `"Salón Sandra Fajardo" <${process.env.EMAIL_USER}>`, // Remitente
      to: email, // Destinatario
      subject: 'Verifica tu cuenta - Salón Sandra Fajardo', // Asunto
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D6BB89 0%, #e8d4a8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .btn { display: inline-block; background: #a6522c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 24px; font-weight: bold; color: #2d5a3d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Salón Sandra Fajardo</div>
              <p style="margin: 10px 0 0 0; color: #2d5a3d;">Belleza y elegancia en cada detalle</p>
            </div>
            <div class="content">
              <h2>¡Hola ${nombre}!</h2>
              <p>Gracias por registrarte en nuestro salón. Para completar tu registro y acceder a todos nuestros servicios, necesitas verificar tu cuenta.</p>
              
              <p><strong>Haz clic en el siguiente botón para verificar tu cuenta:</strong></p>
              
              <div style="text-align: center;">
                <a href="${urlVerificacion}" class="btn">Verificar Mi Cuenta</a>
              </div>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${urlVerificacion}</p>
              
              <p><strong>Importante:</strong></p>
              <ul>
                <li>Este enlace expira en 24 horas</li>
                <li>Si no verificas tu cuenta, no podrás acceder a nuestros servicios</li>
                <li>Si no te registraste, puedes ignorar este correo</li>
              </ul>
            </div>
            <div class="footer">
              <p>Salón Sandra Fajardo - Belleza y elegancia en cada detalle</p>
              <p>Este es un correo automático, por favor no respondas</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo de verificación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error al enviar correo de verificación:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para enviar correo de bienvenida después de verificar
// Se llama cuando el usuario verifica su cuenta exitosamente
const enviarCorreoBienvenida = async (email, nombre) => {
  try {
    const mailOptions = {
      from: `"Salón Sandra Fajardo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Salón Sandra Fajardo!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D6BB89 0%, #e8d4a8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 24px; font-weight: bold; color: #2d5a3d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Salón Sandra Fajardo</div>
              <p style="margin: 10px 0 0 0; color: #2d5a3d;">Belleza y elegancia en cada detalle</p>
            </div>
            <div class="content">
              <h2>¡Bienvenido ${nombre}!</h2>
              <p>Tu cuenta ha sido verificada exitosamente. Ahora puedes disfrutar de todos nuestros servicios:</p>
              
              <ul>
                <li>📅 <strong>Agendar citas</strong> en línea</li>
                <li>🛍️ <strong>Comprar productos</strong> de belleza</li>
                <li>💄 <strong>Ver nuestros servicios</strong> disponibles</li>
                <li>📱 <strong>Acceder a tu perfil</strong> personal</li>
              </ul>
              
              <p>¡Esperamos brindarte la mejor experiencia de belleza!</p>
            </div>
            <div class="footer">
              <p>Salón Sandra Fajardo - Belleza y elegancia en cada detalle</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo de bienvenida enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error al enviar correo de bienvenida:', error.message);
    return { success: false, error: error.message };
  }
};

// Exportar las funciones para usar en otros archivos
module.exports = {
  verificarConexion,
  enviarCorreoVerificacion,
  enviarCorreoBienvenida
};
