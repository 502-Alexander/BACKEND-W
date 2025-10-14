
const db = require('../database/ConexionBDD'); //importo la conexion a la base de datos

// Definición del modelo Usuario con funciones para verificación por email
const Usuario = {
  // Obtener todos los usuarios (función existente)
  getAll: (callback) => {
    db.query('SELECT id_usuario, nombre, email, fecha_registro, verificado FROM usuarios', callback);
  },

  // Crear un nuevo usuario (función existente)
  create: (data, callback) => {
    db.query('INSERT INTO usuarios SET ?', data, callback);
  },

  // Buscar usuario por email
  // Se usa para verificar si el email ya está registrado
  buscarPorEmail: (email, callback) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], callback);
  },

  // Buscar usuario por ID
  // Se usa para obtener datos del usuario después de verificar el token
  buscarPorId: (id, callback) => {
    const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
    db.query(query, [id], callback);
  },

  // Marcar usuario como verificado
  // Se llama cuando el usuario confirma su email exitosamente
  marcarComoVerificado: (id, callback) => {
    const query = 'UPDATE usuarios SET verificado = 1 WHERE id_usuario = ?';
    db.query(query, [id], callback);
  },

  // Buscar usuario por email y contraseña para login
  // Se usa en el proceso de autenticación
  buscarPorCredenciales: (email, callback) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], callback);
  },

  // Actualizar contraseña del usuario
  // Para futuras funcionalidades de recuperación de contraseña
  actualizarPassword: (id, nuevaPassword, callback) => {
    const query = 'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?';
    db.query(query, [nuevaPassword, id], callback);
  }
};

module.exports = Usuario;
