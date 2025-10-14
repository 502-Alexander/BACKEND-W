// Rutas para el sistema de verificación por email
// Este archivo define todas las rutas relacionadas con la verificación de cuentas

const express = require('express');
const router = express.Router();
const verificacionController = require('../controllers/verificacionController');
const { body, validationResult } = require('express-validator');

// Ruta para registrar un nuevo usuario (con verificación por email)
// POST /api/verificacion/registro
// Esta ruta reemplaza el registro simple anterior
router.post('/registro', [
  // Validaciones de entrada
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número')
], verificacionController.registrarUsuario);

// Ruta para verificar el email del usuario
// GET /api/verificacion/verificar-email?token=xxx
// Esta ruta se llama cuando el usuario hace clic en el enlace del correo
router.get('/verificar-email', verificacionController.verificarEmail);

// Ruta para reenviar correo de verificación
// POST /api/verificacion/reenviar
// Se usa cuando el usuario no recibió el correo o expiró
router.post('/reenviar', [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail()
], verificacionController.reenviarVerificacion);

// Exportar el router para usar en el servidor principal
module.exports = router;
