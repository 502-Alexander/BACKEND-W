// Servidor principal del Salón Sandra Fajardo
// Este archivo configura y arranca el servidor Express con todos los middlewares organizados

// Importar dependencias principales
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Importar middlewares organizados
import middlewares from '../middlewares/index.js';

// Importar rutas
import usuarioRoutes from '../routes/usuarioRoutes.js';
import verificacionRoutes from '../routes/verificacionRoutes.js';
import productosRoutes from '../routes/productosRoutes.js';
import categoriasRoutes from '../routes/categoriasRoutes.js';
import carritoRoutes from '../routes/carritoRoutes.js';
import serviciosRoutes from '../routes/serviciosRoutes.js';
import uploadRoutes from '../routes/uploadRoutes.js';
import clienteRoutes from '../routes/clienteRoutes.js';

// Importar controladores
import usuarioController from '../controllers/usuarioController.js';

// Importar módulos adicionales
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Crear instancia de Express
const app = express();
const PORT = process.env.PORT || 4000;

// ===============================
// CONFIGURACIÓN DE MIDDLEWARES
// ===============================

// Middleware de seguridad
app.use(middlewares.security.helmetConfig);
app.use(cors(middlewares.security.corsConfig));

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// Middleware de sanitización
app.use(middlewares.security.sanitizeInput);

// ===============================
// RUTAS PRINCIPALES
// ===============================
app.get('/', (req, res) => {
  res.json({
    mensaje: '🟢 API del Salón Sandra Fajardo funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      productos: '/api/productos',
      carrito: '/api/carrito',
      categorias: '/api/categorias',
      usuarios: '/api/usuarios',
      verificacion: '/api/verificacion',
      auth: '/api/auth',
      admin: '/api/admin',
      citas: '/api/citas',
      stock: '/api/stock'
    }
  });
});

// ===============================
// RUTA DE LOGIN DE ADMINISTRADOR
// ===============================
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email y contraseña son requeridos'
      });
    }

    // Credenciales por defecto del administrador
    const adminEmail = 'admin@nuevatienda.com';
    const adminPassword = 'password';

    // Verificar credenciales
    if (email === adminEmail && password === adminPassword) {
      // Generar token JWT
      const token = jwt.sign(
        { 
          id: 1, 
          email: adminEmail, 
          rol: 'admin' 
        },
        process.env.JWT_SECRET || 'salon_sandra_secret_key',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: 1,
          email: adminEmail,
          nombre: 'Administrador',
          rol: 'admin'
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales incorrectas'
      });
    }
  } catch (error) {
    console.error('❌ Error en login de admin:', error);
    return res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
});

// ===============================
// RUTAS DE API
// ===============================
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/verificacion', verificacionRoutes);
app.use('/api/productos', productosRoutes);
import productoReportesRoutes from '../routes/productoReportesRoutes.js';
app.use('/api/productos/reportes', productoReportesRoutes);
import inventarioRoutes from '../routes/inventarioRoutes.js';
app.use('/api/inventario', inventarioRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/servicios', serviciosRoutes);
import servicioReportesRoutes from '../routes/servicioReportesRoutes.js';
app.use('/api/servicios/reportes', servicioReportesRoutes);
app.use('/api/upload', uploadRoutes);
import logsRoutes from '../routes/logsRoutes.js';
app.use('/api/logs', logsRoutes);
import citasRoutes from '../routes/citasRoutes.js';
app.use('/api/citas', citasRoutes);
import ventasRoutes from '../routes/ventasRoutes.js';
app.use('/api/ventas', ventasRoutes);
app.use('/api/clientes', clienteRoutes);

// ===============================
// EXPORTACIÓN
// ===============================
export default app;

// ===============================
// INICIALIZACIÓN DEL SERVIDOR
// ===============================
app.listen(PORT, async () => {
  console.log(`🚀 Servidor Backend del Salón Sandra Fajardo corriendo en http://localhost:${PORT}`);
  console.log(`📱 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);

  // Inicializar administrador por defecto - TEMPORALMENTE DESHABILITADO
  console.log('✅ Usuario administrador: admin@nuevatienda.com');
  console.log('🔑 Contraseña: password');
});