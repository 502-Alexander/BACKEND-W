// Middleware de logging
// Este archivo maneja el registro de actividades, errores y monitoreo del sistema

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';

/**
 * Middleware para verificar el token JWT
 * Se aplica a rutas que requieren autenticación
 */
const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token de acceso requerido',
        codigo: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.usuario = decoded;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        mensaje: 'Token inválido',
        codigo: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        mensaje: 'Token expirado',
        codigo: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      mensaje: 'Error de autenticación',
      codigo: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware para verificar rol de administrador
 * Se aplica después de verificarToken
 */
const verificarAdmin = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado',
        codigo: 'NOT_AUTHENTICATED'
      });
    }

    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        mensaje: 'Acceso denegado. Se requieren permisos de administrador',
        codigo: 'INSUFFICIENT_PERMISSIONS',
        usuario: {
          id: req.usuario.id,
          rol: req.usuario.rol
        }
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado',
      codigo: 'INVALID_TOKEN',
      error: error.message
    });
  }
};

/**
 * Middleware opcional para verificar token (no falla si no existe)
 * Útil para rutas que pueden funcionar con o sin autenticación
 */
const verificarTokenOpcional = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.usuario = decoded;
      req.token = token;
    }

    next();
  } catch (error) {
    next(); // continuar aunque el token sea inválido
  }
};

/**
 * Middleware para verificar rol específico
 * @param {string} rol - Rol requerido
 */
const verificarRol = (rol) => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          mensaje: 'Usuario no autenticado',
          codigo: 'NOT_AUTHENTICATED'
        });
      }

      if (req.usuario.rol !== rol) {
        return res.status(403).json({
          success: false,
          mensaje: `Acceso denegado. Se requiere rol: ${rol}`,
          codigo: 'INSUFFICIENT_PERMISSIONS',
          usuario: {
            id: req.usuario.id,
            rol: req.usuario.rol
          }
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al verificar rol',
        codigo: 'ROLE_ERROR'
      });
    }
  };
};

export {
  verificarToken,
  verificarAdmin,
  verificarTokenOpcional,
  verificarRol
};
