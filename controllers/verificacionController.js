// Controlador para manejar la verificación de email
// Este archivo contiene todas las funciones relacionadas con la verificación de cuentas

const Usuario = require('../models/usuarioModel');
const Token = require('../models/tokenModel');
const emailService = require('../services/emailService');
const crypto = require('crypto'); // Para generar tokens seguros
const bcrypt = require('bcryptjs'); // Para hashear contraseñas

// Función para registrar un nuevo usuario y enviar correo de verificación
// Esta función reemplaza el registro simple anterior
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el email ya está registrado
    Usuario.buscarPorEmail(email, async (err, usuarioExistente) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({
          success: false,
          mensaje: 'Error interno del servidor'
        });
      }

      if (usuarioExistente.length > 0) {
        return res.status(400).json({
          success: false,
          mensaje: 'Este email ya está registrado'
        });
      }

      try {
        // Hashear la contraseña para seguridad
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const nuevoUsuario = {
          nombre,
          email,
          contrasena: hashedPassword,
          verificado: false, // Inicialmente no verificado
          rol: 'cliente', // Rol por defecto
          fecha_registro: new Date()
        };

        // Guardar usuario en la base de datos
        Usuario.create(nuevoUsuario, async (err, result) => {
          if (err) {
            console.error('Error al crear usuario:', err);
            return res.status(500).json({
              success: false,
              mensaje: 'Error al crear usuario'
            });
          }

          const usuarioId = result.insertId;

          // Generar token único para verificación
          const token = crypto.randomBytes(32).toString('hex');
          const fechaExpiracion = new Date();
          fechaExpiracion.setHours(fechaExpiracion.getHours() + 24); // Expira en 24 horas

          // Guardar token en la base de datos
          const tokenData = {
            usuario_id: usuarioId,
            token: token,
            tipo: 'verificacion',
            expira_en: fechaExpiracion
          };

          Token.crear(tokenData, async (err, tokenResult) => {
            if (err) {
              console.error('Error al crear token:', err);
              return res.status(500).json({
                success: false,
                mensaje: 'Error al crear token de verificación'
              });
            }

            // Enviar correo de verificación
            const emailResult = await emailService.enviarCorreoVerificacion(email, nombre, token);

            if (emailResult.success) {
              res.status(201).json({
                success: true,
                mensaje: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
                data: {
                  usuario_id: usuarioId,
                  email: email,
                  verificado: false
                }
              });
            } else {
              // Si falla el envío del correo, eliminar el usuario creado
              console.error('Error al enviar correo:', emailResult.error);
              res.status(500).json({
                success: false,
                mensaje: 'Usuario creado pero error al enviar correo de verificación'
              });
            }
          });
        });
      } catch (error) {
        console.error('Error en el proceso de registro:', error);
        res.status(500).json({
          success: false,
          mensaje: 'Error interno del servidor'
        });
      }
    });
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Función para verificar el email del usuario
// Se llama cuando el usuario hace clic en el enlace del correo
const verificarEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        mensaje: 'Token de verificación requerido'
      });
    }

    // Buscar el token en la base de datos
    Token.buscarPorToken(token, (err, tokens) => {
      if (err) {
        console.error('Error al buscar token:', err);
        return res.status(500).json({
          success: false,
          mensaje: 'Error interno del servidor'
        });
      }

      if (tokens.length === 0) {
        return res.status(400).json({
          success: false,
          mensaje: 'Token inválido o expirado'
        });
      }

      const tokenData = tokens[0];
      const usuarioId = tokenData.usuario_id;

      // Marcar el token como usado
      Token.marcarComoUsado(token, (err) => {
        if (err) {
          console.error('Error al marcar token como usado:', err);
          return res.status(500).json({
            success: false,
            mensaje: 'Error interno del servidor'
          });
        }

        // Marcar el usuario como verificado
        Usuario.marcarComoVerificado(usuarioId, async (err) => {
          if (err) {
            console.error('Error al marcar usuario como verificado:', err);
            return res.status(500).json({
              success: false,
              mensaje: 'Error interno del servidor'
            });
          }

          // Obtener datos del usuario para enviar correo de bienvenida
          Usuario.buscarPorId(usuarioId, async (err, usuarios) => {
            if (err || usuarios.length === 0) {
              console.error('Error al obtener datos del usuario:', err);
              return res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
              });
            }

            const usuario = usuarios[0];

            // Enviar correo de bienvenida
            await emailService.enviarCorreoBienvenida(usuario.email, usuario.nombre);

            res.json({
              success: true,
              mensaje: 'Email verificado exitosamente. ¡Bienvenido!',
              data: {
                usuario_id: usuarioId,
                nombre: usuario.nombre,
                email: usuario.email,
                verificado: true
              }
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error en verificarEmail:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Función para reenviar correo de verificación
// Se usa cuando el usuario no recibió el correo o expiró
const reenviarVerificacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email requerido'
      });
    }

    // Buscar el usuario por email
    Usuario.buscarPorEmail(email, (err, usuarios) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({
          success: false,
          mensaje: 'Error interno del servidor'
        });
      }

      if (usuarios.length === 0) {
        return res.status(404).json({
          success: false,
          mensaje: 'Usuario no encontrado'
        });
      }

      const usuario = usuarios[0];

      if (usuario.verificado) {
        return res.status(400).json({
          success: false,
          mensaje: 'Este usuario ya está verificado'
        });
      }

      // Eliminar tokens anteriores del usuario
      Token.eliminarTokensUsuario(usuario.id_usuario, 'verificacion', (err) => {
        if (err) {
          console.error('Error al eliminar tokens anteriores:', err);
          return res.status(500).json({
            success: false,
            mensaje: 'Error interno del servidor'
          });
        }

        // Generar nuevo token
        const token = crypto.randomBytes(32).toString('hex');
        const fechaExpiracion = new Date();
        fechaExpiracion.setHours(fechaExpiracion.getHours() + 24);

        const tokenData = {
          usuario_id: usuario.id_usuario,
          token: token,
          tipo: 'verificacion',
          expira_en: fechaExpiracion
        };

        // Guardar nuevo token
        Token.crear(tokenData, async (err) => {
          if (err) {
            console.error('Error al crear nuevo token:', err);
            return res.status(500).json({
              success: false,
              mensaje: 'Error interno del servidor'
            });
          }

          // Enviar nuevo correo de verificación
          const emailResult = await emailService.enviarCorreoVerificacion(usuario.email, usuario.nombre, token);

          if (emailResult.success) {
            res.json({
              success: true,
              mensaje: 'Correo de verificación reenviado exitosamente'
            });
          } else {
            res.status(500).json({
              success: false,
              mensaje: 'Error al enviar correo de verificación'
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Error en reenviarVerificacion:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Exportar las funciones del controlador
module.exports = {
  registrarUsuario,
  verificarEmail,
  reenviarVerificacion
};
