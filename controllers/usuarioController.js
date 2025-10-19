// Importamos el modelo de usuario, bcrypt para hash de contraseñas y jwt para tokens
import Usuario from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/*** Obtener todos los usuarios,  GET /api/usuarios */
// Obtener todos los usuarios
const obtenerUsuarios = (req, res) => {
  // Llama a la función getAll del modelo para traer todos los usuarios
  Usuario.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err }); // Error en la consulta
    res.json(results); // Devolver resultados en formato JSON
  });
};

/*** Crear un nuevo usuario, POST /api/usuarios/crear */
// Crear nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar que se reciban todos los campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Generar hash seguro de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear objeto de usuario adaptado a la base de datos
    const nuevoUsuario = {
      nombre,
      email,
      contrasena: hashedPassword, // Guardamos la contraseña hasheada
      fecha_registro: new Date(),
      rol: 'user' // Rol por defecto
    };

    // Llamamos a la función create del modelo para insertar en la BD
    Usuario.create(nuevoUsuario, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Usuario creado', id_usuario: results.insertId });
    });

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Login de administrador - MOVIDO A server.js para simplificar el sistema

export default {
  obtenerUsuarios,
  crearUsuario
};