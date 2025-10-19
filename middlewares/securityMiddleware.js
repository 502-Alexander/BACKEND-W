// Middleware de seguridad
// Este archivo maneja aspectos de seguridad como CORS, rate limiting, sanitización, etc.

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import expressSanitizer from 'express-sanitizer';

/**
 * Configuración de CORS
 * Maneja las políticas de Cross-Origin Resource Sharing
 */
const corsConfig = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin) return callback(null, true);
    
    // En desarrollo, permitir localhost en cualquier puerto
    if (process.env.NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // Permitir el frontend URL configurado
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('No permitido por CORS'));
  },
  credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

/**
 * Configuración de Helmet para seguridad HTTP
 * Protege contra vulnerabilidades comunes
 */
const helmetConfig = helmet({
  contentSecurityPolicy: false, // Deshabilitado completamente en desarrollo
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  xFrameOptions: false, // Deshabilitar X-Frame-Options
  hsts: false // Deshabilitar HSTS en desarrollo
});

/**
 * Rate Limiting para prevenir ataques de fuerza bruta
 * Limita el número de requests por IP
 */
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: {
      success: false,
      mensaje: message || 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
      codigo: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Saltar rate limiting en desarrollo
      return process.env.NODE_ENV === 'development';
    }
  });
};

// Rate limiter general para API
const apiRateLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests
  'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
);

// Rate limiter estricto para autenticación
const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  5, // máximo 5 intentos de login
  'Demasiados intentos de login, intenta de nuevo en 15 minutos.'
);

// Rate limiter para registro
const registerRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hora
  3, // máximo 3 registros por hora
  'Demasiados intentos de registro, intenta de nuevo en 1 hora.'
);

/**
 * Middleware para sanitizar datos de entrada
 * Previene ataques XSS y limpia datos maliciosos
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitizar body usando express-sanitizer
    if (req.body) {
      req.sanitizeBody = expressSanitizer.sanitize;
    }
    
    // Sanitizar query parameters
    if (req.query) {
      req.sanitizeQuery = expressSanitizer.sanitize;
    }
    
    // Sanitizar params
    if (req.params) {
      req.sanitizeParams = expressSanitizer.sanitize;
    }
    
    next();
  } catch (error) {
    console.error('Error en sanitización:', error);
    next();
  }
};

/**
 * Middleware para validar tamaño de payload
 * Previene ataques de DoS por payloads grandes
 */
const validatePayloadSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxBytes = parseSize(maxSize);
    
    if (contentLength > maxBytes) {
      return res.status(413).json({
        success: false,
        mensaje: 'Payload demasiado grande',
        codigo: 'PAYLOAD_TOO_LARGE',
        maxSize: maxSize
      });
    }
    
    next();
  };
};

/**
 * Función auxiliar para convertir tamaño a bytes
 */
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = size.match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/i);
  if (!match) return 10 * 1024 * 1024; // Default 10MB
  
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  
  return Math.floor(value * units[unit]);
}

/**
 * Middleware para validar origen de requests
 * Verifica que las requests vengan de dominios permitidos
 */
const validateOrigin = (allowedOrigins = []) => {
  return (req, res, next) => {
    const origin = req.get('origin') || req.get('referer');
    
    if (allowedOrigins.length > 0 && origin) {
      const isAllowed = allowedOrigins.some(allowedOrigin => 
        origin.includes(allowedOrigin)
      );
      
      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          mensaje: 'Origen no permitido',
          codigo: 'ORIGIN_NOT_ALLOWED'
        });
      }
    }
    
    next();
  };
};

export {
  corsConfig,
  helmetConfig,
  apiRateLimiter,
  authRateLimiter,
  registerRateLimiter,
  sanitizeInput,
  validatePayloadSize,
  validateOrigin
};
