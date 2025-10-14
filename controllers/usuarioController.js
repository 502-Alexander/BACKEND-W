const Usuario = require('../models/usuarioModel');

// Instrucción para obtener todos los usuarios
exports.obtenerUsuarios = (req, res) => {
  Usuario.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Instrucción para crear un usuario
exports.crearUsuario = (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los Campos son Requeridos' });
  }

  // Adaptar el objeto a los nombres de columnas en MySQL
  const nuevoUsuario = {
    nombre,
    email,
    contrasena: password,  
    fecha_registro: new Date() // Fecha actual
  };

  Usuario.create(nuevoUsuario, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Usuario Creado', id_usuario: results.insertId });
  });
};
