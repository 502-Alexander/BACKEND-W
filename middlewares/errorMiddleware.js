// Middleware de manejo de errores
// Este archivo centraliza el manejo de errores y respuestas de error del sistema

/**
 * Middleware principal de manejo de errores
 * Debe ser el último middleware en la cadena
 */
const manejarErrores = (err, req, res, next) => {
  // Log del error
  console.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    user: req.usuario?.id || 'anonymous'
  });

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      mensaje: 'Error de validación',
      codigo: 'VALIDATION_ERROR',
      detalles: err.message,
      timestamp: new Date().toISOString()
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido',
      codigo: 'INVALID_TOKEN',
      timestamp: new Date().toISOString()
    });
  }

  // Error de expiración de JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token expirado',
      codigo: 'TOKEN_EXPIRED',
      timestamp: new Date().toISOString()
    });
  }

  // Error de base de datos
  if (err.name === 'SequelizeError' || err.name === 'MongoError') {
    return res.status(500).json({
      success: false,
      mensaje: 'Error de base de datos',
      codigo: 'DATABASE_ERROR',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { detalles: err.message })
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      mensaje: 'JSON inválido en el cuerpo de la petición',
      codigo: 'INVALID_JSON',
      timestamp: new Date().toISOString()
    });
  }

  // Error de límite de tamaño
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      mensaje: 'Archivo demasiado grande',
      codigo: 'FILE_TOO_LARGE',
      timestamp: new Date().toISOString()
    });
  }

  // Error de conexión
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      mensaje: 'Servicio no disponible',
      codigo: 'SERVICE_UNAVAILABLE',
      timestamp: new Date().toISOString()
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    mensaje: err.message || 'Error interno del servidor',
    codigo: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      detalles: err
    })
  });
};

/**
 * Middleware para manejar rutas no encontradas
 * Debe aplicarse después de todas las rutas
 */
const manejarRutasNoEncontradas = (req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada',
    codigo: 'ROUTE_NOT_FOUND',
    ruta: req.url,
    metodo: req.method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Middleware para manejar métodos HTTP no permitidos
 */
const manejarMetodosNoPermitidos = (req, res) => {
  res.status(405).json({
    success: false,
    mensaje: 'Método HTTP no permitido',
    codigo: 'METHOD_NOT_ALLOWED',
    metodo: req.method,
    ruta: req.url,
    timestamp: new Date().toISOString()
  });
};

/**
 * Función para crear errores personalizados
 */
const crearError = (mensaje, codigo = 'CUSTOM_ERROR', status = 400) => {
  const error = new Error(mensaje);
  error.code = codigo;
  error.status = status;
  return error;
};

/**
 * Errores comunes predefinidos
 */
const erroresComunes = {
  // Errores de autenticación
  NO_AUTHENTICATED: crearError('Usuario no autenticado', 'NO_AUTHENTICATED', 401),
  INVALID_CREDENTIALS: crearError('Credenciales inválidas', 'INVALID_CREDENTIALS', 401),
  TOKEN_EXPIRED: crearError('Token expirado', 'TOKEN_EXPIRED', 401),
  INVALID_TOKEN: crearError('Token inválido', 'INVALID_TOKEN', 401),
  
  // Errores de autorización
  INSUFFICIENT_PERMISSIONS: crearError('Permisos insuficientes', 'INSUFFICIENT_PERMISSIONS', 403),
  ACCESS_DENIED: crearError('Acceso denegado', 'ACCESS_DENIED', 403),
  
  // Errores de validación
  VALIDATION_ERROR: crearError('Error de validación', 'VALIDATION_ERROR', 400),
  MISSING_FIELDS: crearError('Campos requeridos faltantes', 'MISSING_FIELDS', 400),
  INVALID_FORMAT: crearError('Formato inválido', 'INVALID_FORMAT', 400),
  
  // Errores de recursos
  RESOURCE_NOT_FOUND: crearError('Recurso no encontrado', 'RESOURCE_NOT_FOUND', 404),
  RESOURCE_ALREADY_EXISTS: crearError('El recurso ya existe', 'RESOURCE_ALREADY_EXISTS', 409),
  RESOURCE_CONFLICT: crearError('Conflicto con el recurso', 'RESOURCE_CONFLICT', 409),
  
  // Errores de servidor
  INTERNAL_ERROR: crearError('Error interno del servidor', 'INTERNAL_ERROR', 500),
  DATABASE_ERROR: crearError('Error de base de datos', 'DATABASE_ERROR', 500),
  SERVICE_UNAVAILABLE: crearError('Servicio no disponible', 'SERVICE_UNAVAILABLE', 503),
  
  // Errores de límites
  RATE_LIMIT_EXCEEDED: crearError('Límite de solicitudes excedido', 'RATE_LIMIT_EXCEEDED', 429),
  FILE_TOO_LARGE: crearError('Archivo demasiado grande', 'FILE_TOO_LARGE', 413),
  PAYLOAD_TOO_LARGE: crearError('Payload demasiado grande', 'PAYLOAD_TOO_LARGE', 413)
};

/**
 * Middleware para manejar errores asíncronos
 * Envuelve funciones async para capturar errores automáticamente
 */
const capturarErroresAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware para validar que el usuario esté autenticado
 */
const requerirAutenticacion = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      success: false,
      mensaje: 'Autenticación requerida',
      codigo: 'AUTHENTICATION_REQUIRED',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * Middleware para validar que el usuario sea administrador
 */
const requerirAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      mensaje: 'Permisos de administrador requeridos',
      codigo: 'ADMIN_REQUIRED',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * Función para enviar respuesta de éxito
 */
const enviarRespuestaExito = (res, data = null, mensaje = 'Operación exitosa', status = 200) => {
  return res.status(status).json({
    success: true,
    mensaje,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Función para enviar respuesta de error
 */
const enviarRespuestaError = (res, mensaje = 'Error en la operación', codigo = 'ERROR', status = 400, detalles = null) => {
  return res.status(status).json({
    success: false,
    mensaje,
    codigo,
    detalles,
    timestamp: new Date().toISOString()
  });
};

export {

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

};
