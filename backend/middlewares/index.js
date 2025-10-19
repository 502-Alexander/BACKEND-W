// Índice de middlewares
// Este archivo exporta todos los middlewares organizados para facilitar su importación

// Middlewares de autenticación
import {
  verificarToken,
  verificarAdmin,
  verificarTokenOpcional,
  verificarRol
} from './authMiddleware.js';

// Middlewares de seguridad
import {
  corsConfig,
  helmetConfig,
  apiRateLimiter,
  authRateLimiter,
  registerRateLimiter,
  sanitizeInput,
  validatePayloadSize,
  validateOrigin
} from './securityMiddleware.js';

// Middlewares de validación
import {
  procesarValidacion,
  validacionesAuth,
  validacionesProductos,
  validacionesCitas,
  validacionesParams,
  validacionesQuery
} from './validationMiddleware.js';

// Middlewares de logging
import {
  verificarToken as logVerificarToken,
  verificarAdmin as logVerificarAdmin,
  verificarTokenOpcional as logVerificarTokenOpcional,
  verificarRol as logVerificarRol
} from './loggingMiddleware.js';

// Middlewares de manejo de errores
import {
  manejarErrores,
  manejarRutasNoEncontradas,
  manejarMetodosNoPermitidos,
  crearError,
  erroresComunes,
  capturarErroresAsync,
  requerirAutenticacion,
  requerirAdmin,
  enviarRespuestaExito,
  enviarRespuestaError
} from './errorMiddleware.js';

// Exportar todos los middlewares organizados por categoría
export default {
  // Autenticación
  auth: {
    verificarToken,
    verificarAdmin,
    verificarTokenOpcional,
    verificarRol
  },
  
  // Seguridad
  security: {
    corsConfig,
    helmetConfig,
    apiRateLimiter,
    authRateLimiter,
    registerRateLimiter,
    sanitizeInput,
    validatePayloadSize,
    validateOrigin
  },
  
  // Validación
  validation: {
    procesarValidacion,
    validacionesAuth,
    validacionesProductos,
    validacionesCitas,
    validacionesParams,
    validacionesQuery
  },
  
  // Logging
  logging: {
    verificarToken: logVerificarToken,
    verificarAdmin: logVerificarAdmin,
    verificarTokenOpcional: logVerificarTokenOpcional,
    verificarRol: logVerificarRol
  },
  
  // Manejo de errores
  error: {
    manejarErrores,
    manejarRutasNoEncontradas,
    manejarMetodosNoPermitidos,
    crearError,
    erroresComunes,
    capturarErroresAsync,
    requerirAutenticacion,
    requerirAdmin,
    enviarRespuestaExito,
    enviarRespuestaError
  }
};
