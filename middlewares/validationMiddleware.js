// Middleware de validación de datos
// Este archivo maneja la validación de datos de entrada usando express-validator

import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware para procesar resultados de validación
 * Debe aplicarse después de las validaciones de express-validator
 */
const procesarValidacion = (req, res, next) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        mensaje: 'Datos inválidos',
        codigo: 'VALIDATION_ERROR',
        errores: errors.array().map(error => ({
          campo: error.path || error.param,
          mensaje: error.msg,
          valor: error.value
        }))
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: 'Error en validación',
      codigo: 'VALIDATION_PROCESSING_ERROR'
    });
  }
};

/**
 * Validaciones para autenticación
 */
const validacionesAuth = {
  // Validación para registro de usuarios
  registro: [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('email')
      .isEmail()
      .withMessage('Debe proporcionar un email válido')
      .normalizeEmail()
      .withMessage('Formato de email inválido'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
  ],
  
  // Validación para login de usuarios
  login: [
    body('email')
      .isEmail()
      .withMessage('Debe proporcionar un email válido')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 1 })
      .withMessage('La contraseña no puede estar vacía')
  ],
  
  // Validación para login de administrador
  adminLogin: [
    body('usuario')
      .notEmpty()
      .withMessage('El usuario es requerido')
      .isLength({ min: 3, max: 20 })
      .withMessage('El usuario debe tener entre 3 y 20 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('El usuario solo puede contener letras, números y guiones bajos'),
    
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 1 })
      .withMessage('La contraseña no puede estar vacía')
  ]
};

/**
 * Validaciones para productos
 */
const validacionesProductos = {
  // Validación para crear producto
  crear: [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre del producto es requerido')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    
    body('precio')
      .isNumeric()
      .withMessage('El precio debe ser un número')
      .isFloat({ min: 0.01 })
      .withMessage('El precio debe ser mayor a 0'),
    
    body('categoria')
      .notEmpty()
      .withMessage('La categoría es requerida')
      .isLength({ min: 2, max: 50 })
      .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
    
    body('stock')
      .isInt({ min: 0 })
      .withMessage('El stock debe ser un número entero positivo'),
    
    body('descripcion')
      .optional()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres'),
    
    body('imagen')
      .optional()
      .isURL()
      .withMessage('La imagen debe ser una URL válida')
  ],
  
  // Validación para actualizar producto
  actualizar: [
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    
    body('precio')
      .optional()
      .isNumeric()
      .withMessage('El precio debe ser un número')
      .isFloat({ min: 0.01 })
      .withMessage('El precio debe ser mayor a 0'),
    
    body('categoria')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
    
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El stock debe ser un número entero positivo'),
    
    body('descripcion')
      .optional()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres'),
    
    body('imagen')
      .optional()
      .isURL()
      .withMessage('La imagen debe ser una URL válida')
  ]
};

/**
 * Validaciones para citas
 */
const validacionesCitas = {
  // Validación para crear cita
  crear: [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    
    body('email')
      .isEmail()
      .withMessage('Debe proporcionar un email válido')
      .normalizeEmail(),
    
    body('telefono')
      .optional()
      .matches(/^[\+]?[0-9\s\-\(\)]{7,15}$/)
      .withMessage('Formato de teléfono inválido'),
    
    body('fecha')
      .isISO8601()
      .withMessage('Formato de fecha inválido')
      .custom((value) => {
        const fecha = new Date(value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fecha < hoy) {
          throw new Error('La fecha no puede ser anterior a hoy');
        }
        
        if (fecha.getDay() === 0) {
          throw new Error('No se pueden agendar citas los domingos');
        }
        
        return true;
      }),
    
    body('hora')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Formato de hora inválido (HH:MM)'),
    
    body('servicio')
      .notEmpty()
      .withMessage('El servicio es requerido'),
    
    body('tipoCliente')
      .isIn(['nuevo', 'frecuente'])
      .withMessage('El tipo de cliente debe ser "nuevo" o "frecuente"'),
    
    body('notas')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Las notas no pueden exceder 500 caracteres')
  ]
};

/**
 * Validaciones para parámetros de URL
 */
const validacionesParams = {
  // Validación para ID numérico
  idNumerico: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo')
  ],
  
  // Validación para ID string
  idString: [
    param('id')
      .notEmpty()
      .withMessage('El ID es requerido')
      .isLength({ min: 1, max: 50 })
      .withMessage('El ID debe tener entre 1 y 50 caracteres')
  ]
};

/**
 * Validaciones para queries
 */
const validacionesQuery = {
  // Validación para paginación
  paginacion: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La página debe ser un número entero positivo'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser entre 1 y 100')
  ],
  
  // Validación para búsqueda
  busqueda: [
    query('search')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres')
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage('El término de búsqueda contiene caracteres no válidos')
  ]
};

export {

  procesarValidacion,
  validacionesAuth,
  validacionesProductos,
  validacionesCitas,
  validacionesParams,
  validacionesQuery

};
