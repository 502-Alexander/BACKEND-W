// Modelo para manejar tokens de verificación en la base de datos
// Este archivo contiene todas las operaciones relacionadas con tokens de verificación

const db = require('../database/ConexionBDD');

// Objeto que contiene todas las funciones para manejar tokens
const Token = {
  // Crear un nuevo token de verificación
  // Se usa cuando un usuario se registra y necesita verificar su email
  crear: (data, callback) => {
    const query = 'INSERT INTO tokens_verificacion SET ?';
    db.query(query, data, callback);
  },

  // Buscar un token por su valor
  // Se usa cuando el usuario hace clic en el enlace de verificación
  buscarPorToken: (token, callback) => {
    const query = 'SELECT * FROM tokens_verificacion WHERE token = ? AND usado = 0 AND expira_en > NOW()';
    db.query(query, [token], callback);
  },

  // Marcar un token como usado
  // Se llama después de que el usuario verifica su cuenta exitosamente
  marcarComoUsado: (token, callback) => {
    const query = 'UPDATE tokens_verificacion SET usado = 1 WHERE token = ?';
    db.query(query, [token], callback);
  },

  // Eliminar tokens expirados
  // Función de limpieza para mantener la base de datos ordenada
  eliminarExpirados: (callback) => {
    const query = 'DELETE FROM tokens_verificacion WHERE expira_en < NOW()';
    db.query(query, callback);
  },

  // Buscar tokens por usuario
  // Para verificar si un usuario ya tiene un token pendiente
  buscarPorUsuario: (usuarioId, tipo, callback) => {
    const query = 'SELECT * FROM tokens_verificacion WHERE usuario_id = ? AND tipo = ? AND usado = 0 AND expira_en > NOW()';
    db.query(query, [usuarioId, tipo], callback);
  },

  // Eliminar tokens anteriores de un usuario
  // Para evitar múltiples tokens activos del mismo usuario
  eliminarTokensUsuario: (usuarioId, tipo, callback) => {
    const query = 'DELETE FROM tokens_verificacion WHERE usuario_id = ? AND tipo = ?';
    db.query(query, [usuarioId, tipo], callback);
  }
};

// Exportar el modelo para usar en otros archivos
module.exports = Token;
