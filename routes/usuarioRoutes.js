
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// GET: Instrucción para obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// POST: Instruccion para crear un nuevo usuario
router.post('/', usuarioController.crearUsuario);

module.exports = router;
