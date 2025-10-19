import db from '../database/ConexionBDD.js';

const Usuario = {
  // Obtener todos los usuarios
  getAll: (callback) => {
    db.query('SELECT * FROM usuarios', callback);
  },
  
  // Buscar usuario por email
  buscarPorEmail: (email, callback) => {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
  },
  
  // Crear nuevo usuario
  create: (usuario, callback) => {
    db.query('INSERT INTO usuarios SET ?', usuario, callback);
  },
  
  // Crear usuario (alias para compatibilidad)
  crearUsuario: (usuario, callback) => {
    db.query('INSERT INTO usuarios SET ?', usuario, callback);
  }
};

export default Usuario;