
// Importar dependencias necesarias
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();




// Crear instancia de Express
const usuarioRoutes = require('../routes/usuarioRoutes');
const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

//==============================
// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas reales con MySQL
app.use('/api/usuarios', usuarioRoutes);

// Importar y usar rutas de verificación por email
const verificacionRoutes = require('../routes/verificacionRoutes');
app.use('/api/verificacion', verificacionRoutes);

// Importar y usar rutas de productos, categorías y carrito
const productosRoutes = require('../routes/productosRoutes');
const categoriasRoutes = require('../routes/categoriasRoutes');
const carritoRoutes = require('../routes/carritoRoutes');

app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/carrito', carritoRoutes);

// Ruta para servicios (para evitar el error 404)
app.get('/api/servicios', (req, res) => {
  const servicios = [
    {
      id: 1,
      nombre: 'Corte de Cabello',
      descripcion: 'Corte profesional personalizado',
      precio: 15.00,
      duracion: 60
    },
    {
      id: 2,
      nombre: 'Peinado',
      descripcion: 'Peinado para ocasiones especiales',
      precio: 25.00,
      duracion: 90
    },
    {
      id: 3,
      nombre: 'Tinte y Coloración',
      descripcion: 'Coloración profesional del cabello',
      precio: 45.00,
      duracion: 120
    },
    {
      id: 4,
      nombre: 'Manicure',
      descripcion: 'Manicure completa con esmaltado',
      precio: 20.00,
      duracion: 60
    },
    {
      id: 5,
      nombre: 'Pedicure',
      descripcion: 'Pedicure completa con esmaltado',
      precio: 25.00,
      duracion: 75
    }
  ];

  res.json({
    success: true,
    data: servicios
  });
});

// Ruta de registro (para compatibilidad con el frontend)
app.post('/api/registro', (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Usar el controlador de usuarios que conecta con MySQL
    const usuarioController = require('./controllers/usuarioController');
    usuarioController.crearUsuario(req, res);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🟢 Servidor funcionando con MySQL' });
});

// Error 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor Backend corriendo en http://localhost:${PORT}`);
});
//==============================


// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por IP
  message: {
    success: false,
    mensaje: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting a todas las rutas
app.use('/api/', limiter);

// Middleware para CORS y parsing de JSON
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5175',
  credentials: process.env.CORS_CREDENTIALS === 'true' || true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitización de datos
app.use(expressSanitizer());

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      mensaje: 'Error de validación',
      error: err.message
    });
  }
  
  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido'
    });
  }
  
  // Error de expiración de JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token expirado'
    });
  }
  
  // Error genérico
  res.status(500).json({
    success: false,
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Datos de ejemplo para productos (en un proyecto real vendría de una base de datos)
const productos = [
  {
    id: 1,
    nombre: "Laptop Gaming Pro",
    precio: 1299.99,
    descripcion: "Laptop de alto rendimiento para gaming y trabajo profesional",
    imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    categoria: "Electrónicos",
    stock: 15
  },
  {
    id: 2,
    nombre: "Smartphone Ultra",
    precio: 899.99,
    descripcion: "Teléfono inteligente con cámara de 108MP y pantalla 4K",
    imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    categoria: "Electrónicos",
    stock: 25
  },
  {
    id: 3,
    nombre: "Auriculares Inalámbricos",
    precio: 199.99,
    descripcion: "Auriculares con cancelación de ruido y sonido de alta calidad",
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    categoria: "Audio",
    stock: 40
  },
  {
    id: 4,
    nombre: "Reloj Inteligente",
    precio: 299.99,
    descripcion: "Smartwatch con monitoreo de salud y GPS integrado",
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    categoria: "Wearables",
    stock: 20
  },
  {
    id: 5,
    nombre: "Tablet Pro",
    precio: 599.99,
    descripcion: "Tablet profesional con pantalla de 12 pulgadas y stylus incluido",
    imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    categoria: "Electrónicos",
    stock: 12
  },
  {
    id: 6,
    nombre: "Cámara Digital",
    precio: 799.99,
    descripcion: "Cámara mirrorless con sensor de 24MP y grabación 4K",
    imagen: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    categoria: "Fotografía",
    stock: 8
  }
];

// Array para simular carrito de compras (en producción se usaría una base de datos)
let carrito = [];

// Arrays para simular base de datos (en producción se usaría una base de datos real)
let usuarios = [];
let citas = [];
let reportes = {
  ventas: [],
  clientes: [],
  productos: [],
  citas: []
};

// Array para gestión de citas del salón
let citasSalon = [
  {
    id: '1',
    nombre: 'María González',
    email: 'maria@email.com',
    telefono: '+502 1234-5678',
    fecha: '2024-01-25',
    hora: '10:00',
    servicio: 'Corte y Peinado',
    tipoCliente: 'frecuente',
    estado: 'confirmada',
    foto: null,
    notas: 'Cliente regular, prefiere cortes cortos',
    fechaCreacion: '2024-01-20T10:30:00Z',
    fechaActualizacion: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    nombre: 'Ana López',
    email: 'ana@email.com',
    telefono: '+502 8765-4321',
    fecha: '2024-01-25',
    hora: '14:00',
    servicio: 'Tinte y Tratamiento',
    tipoCliente: 'nuevo',
    estado: 'pendiente',
    foto: null,
    notas: 'Primera vez en el salón',
    fechaCreacion: '2024-01-22T15:45:00Z',
    fechaActualizacion: '2024-01-22T15:45:00Z'
  },
  {
    id: '3',
    nombre: 'Carmen Ruiz',
    email: 'carmen@email.com',
    telefono: '+502 5555-1234',
    fecha: '2024-01-26',
    hora: '11:30',
    servicio: 'Manicure y Pedicure',
    tipoCliente: 'frecuente',
    estado: 'completada',
    foto: null,
    notas: 'Servicio completado exitosamente',
    fechaCreacion: '2024-01-18T09:15:00Z',
    fechaActualizacion: '2024-01-26T12:00:00Z'
  }
];

// Servicios disponibles en el salón
const serviciosDisponibles = [
  'Corte y Peinado',
  'Tinte y Tratamiento',
  'Manicure y Pedicure',
  'Maquillaje',
  'Tratamiento Facial',
  'Depilación',
  'Peinado para Eventos',
  'Tratamiento Capilar'
];

// Configuración de citas
const configuracionCitas = {
  maxCitasPorDia: 3,
  diasExcluidos: [0], // 0 = Domingo
  horariosDisponibles: [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ]
};

// Array para gestión de stock
let stock = [
  {
    id: '1',
    productoId: '1',
    nombre: 'iPhone 15 Pro',
    categoria: 'Electrónicos',
    stockActual: 5,
    stockMinimo: 10,
    stockMaximo: 100,
    precioCompra: 800,
    precioVenta: 1200,
    proveedor: 'Apple Inc.',
    ubicacion: 'Almacén A - Estante 1',
    fechaUltimaEntrada: '2024-01-15',
    fechaUltimaSalida: '2024-01-20',
    estado: 'activo',
    alertas: {
      stockBajo: true,
      stockCritico: false,
      proximoVencimiento: false
    }
  },
  {
    id: '2',
    productoId: '2',
    nombre: 'Samsung Galaxy S24',
    categoria: 'Electrónicos',
    stockActual: 2,
    stockMinimo: 5,
    stockMaximo: 50,
    precioCompra: 600,
    precioVenta: 900,
    proveedor: 'Samsung Electronics',
    ubicacion: 'Almacén A - Estante 2',
    fechaUltimaEntrada: '2024-01-10',
    fechaUltimaSalida: '2024-01-22',
    estado: 'activo',
    alertas: {
      stockBajo: true,
      stockCritico: true,
      proximoVencimiento: false
    }
  },
  {
    id: '3',
    productoId: '3',
    nombre: 'MacBook Pro M3',
    categoria: 'Electrónicos',
    stockActual: 15,
    stockMinimo: 8,
    stockMaximo: 30,
    precioCompra: 1500,
    precioVenta: 2200,
    proveedor: 'Apple Inc.',
    ubicacion: 'Almacén B - Estante 1',
    fechaUltimaEntrada: '2024-01-18',
    fechaUltimaSalida: '2024-01-19',
    estado: 'activo',
    alertas: {
      stockBajo: false,
      stockCritico: false,
      proximoVencimiento: false
    }
  }
];

// Función para inicializar el administrador por defecto
async function inicializarAdmin() {
  try {
    console.log('Inicializando administrador...');
    console.log('Usuarios actuales:', usuarios.length);
    
    // Verificar si ya existe un admin
    const adminExistente = usuarios.find(u => u.rol === 'admin');
    
    if (!adminExistente) {
      console.log('Creando nuevo administrador...');
      // Generar hash para la contraseña "password"
      const hashedPassword = await bcrypt.hash('password', 10);
      
      const adminDefault = {
        id: 'admin',
        usuario: 'admin',
        email: 'admin@nuevatienda.com',
        password: hashedPassword,
        rol: 'admin',
        nombre: 'Administrador',
        fechaRegistro: new Date()
      };
      
      usuarios.push(adminDefault);
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('👤 Usuario: admin');
      console.log('🔑 Contraseña: password');
      console.log('Total usuarios:', usuarios.length);
    } else {
      console.log('✅ Usuario administrador ya existe');
      console.log('👤 Usuario:', adminExistente.usuario);
      console.log('Total usuarios:', usuarios.length);
    }
  } catch (error) {
    console.error(' Error al inicializar administrador:', error);
  }
}

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      mensaje: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      mensaje: 'Token inválido'
    });
  }
};

// Middleware para verificar rol de administrador
const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      mensaje: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  next();
};

// Ruta principal - información de la API
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Nueva Tienda funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      productos: '/api/productos',
      carrito: '/api/carrito',
      categorias: '/api/categorias',
      auth: '/api/auth'
    }
  });
});

// Ruta de debug para verificar usuarios (solo para desarrollo)
app.get('/api/debug/usuarios', (req, res) => {
  res.json({
    success: true,
    data: usuarios.map(u => ({
      id: u.id,
      usuario: u.usuario,
      email: u.email,
      rol: u.rol,
      nombre: u.nombre
    }))
  });
});

// ================================
// RUTAS DE GESTIÓN DE STOCK
// ================================

// Obtener todo el stock
app.get('/api/stock', verificarToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el stock',
      error: error.message
    });
  }
});

// Obtener stock por ID
app.get('/api/stock/:id', verificarToken, (req, res) => {
  try {
    const { id } = req.params;
    const item = stock.find(s => s.id === id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item de stock no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el item de stock',
      error: error.message
    });
  }
});

// Crear nuevo item de stock
app.post('/api/stock', verificarToken, verificarAdmin, (req, res) => {
  try {
    const {
      productoId,
      nombre,
      categoria,
      stockActual,
      stockMinimo,
      stockMaximo,
      precioCompra,
      precioVenta,
      proveedor,
      ubicacion
    } = req.body;
    
    // Validar datos requeridos
    if (!productoId || !nombre || !categoria || stockActual === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }
    
    const nuevoItem = {
      id: Date.now().toString(),
      productoId,
      nombre,
      categoria,
      stockActual: parseInt(stockActual),
      stockMinimo: parseInt(stockMinimo) || 0,
      stockMaximo: parseInt(stockMaximo) || 100,
      precioCompra: parseFloat(precioCompra) || 0,
      precioVenta: parseFloat(precioVenta) || 0,
      proveedor: proveedor || '',
      ubicacion: ubicacion || '',
      fechaUltimaEntrada: new Date().toISOString().split('T')[0],
      fechaUltimaSalida: null,
      estado: 'activo',
      alertas: {
        stockBajo: parseInt(stockActual) <= (parseInt(stockMinimo) || 0),
        stockCritico: parseInt(stockActual) <= (parseInt(stockMinimo) || 0) * 0.5,
        proximoVencimiento: false
      }
    };
    
    stock.push(nuevoItem);
    
    res.status(201).json({
      success: true,
      message: 'Item de stock creado exitosamente',
      data: nuevoItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el item de stock',
      error: error.message
    });
  }
});

// Actualizar item de stock
app.put('/api/stock/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const itemIndex = stock.findIndex(s => s.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item de stock no encontrado'
      });
    }
    
    const {
      nombre,
      categoria,
      stockActual,
      stockMinimo,
      stockMaximo,
      precioCompra,
      precioVenta,
      proveedor,
      ubicacion,
      estado
    } = req.body;
    
    // Actualizar item
    stock[itemIndex] = {
      ...stock[itemIndex],
      ...(nombre && { nombre }),
      ...(categoria && { categoria }),
      ...(stockActual !== undefined && { stockActual: parseInt(stockActual) }),
      ...(stockMinimo !== undefined && { stockMinimo: parseInt(stockMinimo) }),
      ...(stockMaximo !== undefined && { stockMaximo: parseInt(stockMaximo) }),
      ...(precioCompra !== undefined && { precioCompra: parseFloat(precioCompra) }),
      ...(precioVenta !== undefined && { precioVenta: parseFloat(precioVenta) }),
      ...(proveedor && { proveedor }),
      ...(ubicacion && { ubicacion }),
      ...(estado && { estado }),
      alertas: {
        stockBajo: parseInt(stockActual) <= (parseInt(stockMinimo) || stock[itemIndex].stockMinimo),
        stockCritico: parseInt(stockActual) <= (parseInt(stockMinimo) || stock[itemIndex].stockMinimo) * 0.5,
        proximoVencimiento: false
      }
    };
    
    res.json({
      success: true,
      message: 'Item de stock actualizado exitosamente',
      data: stock[itemIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el item de stock',
      error: error.message
    });
  }
});

// Eliminar item de stock
app.delete('/api/stock/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const itemIndex = stock.findIndex(s => s.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item de stock no encontrado'
      });
    }
    
    stock.splice(itemIndex, 1);
    
    res.json({
      success: true,
      message: 'Item de stock eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el item de stock',
      error: error.message
    });
  }
});

// Obtener alertas de stock
app.get('/api/stock/alertas', verificarToken, (req, res) => {
  try {
    const alertas = {
      stockBajo: stock.filter(item => item.alertas.stockBajo && !item.alertas.stockCritico),
      stockCritico: stock.filter(item => item.alertas.stockCritico),
      proximoVencimiento: stock.filter(item => item.alertas.proximoVencimiento),
      total: stock.filter(item => item.alertas.stockBajo || item.alertas.stockCritico || item.alertas.proximoVencimiento).length
    };
    
    res.json({
      success: true,
      data: alertas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las alertas de stock',
      error: error.message
    });
  }
});

// Actualizar stock (entrada/salida)
app.post('/api/stock/:id/movimiento', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, cantidad, motivo, proveedor } = req.body; // tipo: 'entrada' o 'salida'
    
    const itemIndex = stock.findIndex(s => s.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item de stock no encontrado'
      });
    }
    
    const item = stock[itemIndex];
    const cantidadNum = parseInt(cantidad);
    
    if (tipo === 'entrada') {
      item.stockActual += cantidadNum;
      item.fechaUltimaEntrada = new Date().toISOString().split('T')[0];
      if (proveedor) item.proveedor = proveedor;
    } else if (tipo === 'salida') {
      if (item.stockActual < cantidadNum) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuficiente'
        });
      }
      item.stockActual -= cantidadNum;
      item.fechaUltimaSalida = new Date().toISOString().split('T')[0];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Tipo de movimiento inválido'
      });
    }
    
    // Actualizar alertas
    item.alertas = {
      stockBajo: item.stockActual <= item.stockMinimo,
      stockCritico: item.stockActual <= item.stockMinimo * 0.5,
      proximoVencimiento: false
    };
    
    res.json({
      success: true,
      message: `Stock ${tipo === 'entrada' ? 'aumentado' : 'disminuido'} exitosamente`,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el stock',
      error: error.message
    });
  }
});

// Obtener estadísticas de stock
app.get('/api/stock/estadisticas', verificarToken, (req, res) => {
  try {
    const totalItems = stock.length;
    const stockBajo = stock.filter(item => item.alertas.stockBajo).length;
    const stockCritico = stock.filter(item => item.alertas.stockCritico).length;
    const valorTotal = stock.reduce((sum, item) => sum + (item.stockActual * item.precioCompra), 0);
    const valorVenta = stock.reduce((sum, item) => sum + (item.stockActual * item.precioVenta), 0);
    
    const estadisticas = {
      totalItems,
      stockBajo,
      stockCritico,
      stockNormal: totalItems - stockBajo,
      valorTotal,
      valorVenta,
      gananciaPotencial: valorVenta - valorTotal,
      porcentajeStockBajo: totalItems > 0 ? (stockBajo / totalItems) * 100 : 0
    };
    
    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas de stock',
      error: error.message
    });
  }
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
  try {
    res.json({
      success: true,
      data: productos,
      total: productos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
});

// Ruta para obtener un producto específico por ID
app.get('/api/productos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el producto',
      error: error.message
    });
  }
});

// Ruta para obtener categorías
app.get('/api/categorias', (req, res) => {
  try {
    const categorias = [...new Set(productos.map(p => p.categoria))];
    res.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener categorías',
      error: error.message
    });
  }
});

// Ruta para obtener el carrito
app.get('/api/carrito', (req, res) => {
  try {
    res.json({
      success: true,
      data: carrito,
      total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el carrito',
      error: error.message
    });
  }
});

// Ruta para agregar producto al carrito
app.post('/api/carrito', (req, res) => {
  try {
    const { productoId, cantidad = 1 } = req.body;
    
    // Validar que el producto existe
    const producto = productos.find(p => p.id === productoId);
    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    // Verificar stock disponible
    if (producto.stock < cantidad) {
      return res.status(400).json({
        success: false,
        mensaje: 'Stock insuficiente'
      });
    }
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
      // Actualizar cantidad si ya existe
      itemExistente.cantidad += cantidad;
    } else {
      // Agregar nuevo item al carrito
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad,
        stock: producto.stock
      });
    }
    
    res.json({
      success: true,
      mensaje: 'Producto agregado al carrito',
      data: carrito
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al agregar producto al carrito',
      error: error.message
    });
  }
});

// Ruta para actualizar cantidad en el carrito
app.put('/api/carrito/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;
    
    const item = carrito.find(item => item.id === id);
    if (!item) {
      return res.status(404).json({
        success: false,
        mensaje: 'Item no encontrado en el carrito'
      });
    }
    
    if (cantidad <= 0) {
      // Eliminar item si cantidad es 0 o menor
      carrito = carrito.filter(item => item.id !== id);
    } else {
      item.cantidad = cantidad;
    }
    
    res.json({
      success: true,
      mensaje: 'Carrito actualizado',
      data: carrito
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar el carrito',
      error: error.message
    });
  }
});

// Ruta para eliminar producto del carrito
app.delete('/api/carrito/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    carrito = carrito.filter(item => item.id !== id);
    
    res.json({
      success: true,
      mensaje: 'Producto eliminado del carrito',
      data: carrito
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar producto del carrito',
      error: error.message
    });
  }
});

// Ruta para vaciar el carrito
app.delete('/api/carrito', (req, res) => {
  try {
    carrito = [];
    res.json({
      success: true,
      mensaje: 'Carrito vaciado',
      data: carrito
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al vaciar el carrito',
      error: error.message
    });
  }
});

// ==================== RUTAS DE AUTENTICACIÓN ====================

// Ruta para registro de usuarios
app.post('/api/auth/registro', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email válido requerido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        mensaje: 'Datos inválidos',
        errores: errors.array()
      });
    }

    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe un usuario con este email'
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre,
      email,
      password: hashedPassword,
      rol: 'cliente',
      fechaRegistro: new Date()
    };

    usuarios.push(nuevoUsuario);

    // Generar JWT
    const token = jwt.sign(
      { 
        id: nuevoUsuario.id, 
        email: nuevoUsuario.email, 
        rol: nuevoUsuario.rol 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      data: {
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// Ruta para login de usuarios
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Email válido requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        mensaje: 'Datos inválidos',
        errores: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      mensaje: 'Login exitoso',
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

// Ruta para login de administrador
app.post('/api/auth/admin-login', [
  body('usuario').notEmpty().withMessage('El usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        mensaje: 'Datos inválidos',
        errores: errors.array()
      });
    }

    const { usuario: usuarioInput, password } = req.body;

    // Debug: Mostrar usuarios disponibles
    console.log('Usuarios disponibles:', usuarios.map(u => ({ usuario: u.usuario, rol: u.rol })));
    console.log('Buscando admin con usuario:', usuarioInput);
    
    // Buscar administrador
    const admin = usuarios.find(u => u.usuario === usuarioInput && u.rol === 'admin');
    if (!admin) {
      console.log('No se encontró administrador con usuario:', usuarioInput);
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales de administrador inválidas'
      });
    }
    
    console.log('Administrador encontrado:', { usuario: admin.usuario, rol: admin.rol });

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, admin.password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales de administrador inválidas'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        rol: admin.rol 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      mensaje: 'Login de administrador exitoso',
      data: {
        usuario: {
          id: admin.id,
          nombre: admin.nombre,
          email: admin.email,
          rol: admin.rol
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al iniciar sesión como administrador',
      error: error.message
    });
  }
});

// ==================== RUTAS DEL DASHBOARD ADMINISTRATIVO ====================

// Ruta para obtener estadísticas generales del dashboard
app.get('/api/admin/dashboard', verificarToken, verificarAdmin, (req, res) => {
  try {
    const estadisticas = {
      totalProductos: productos.length,
      totalUsuarios: usuarios.filter(u => u.rol === 'cliente').length,
      totalVentas: carrito.length,
      totalCitas: citas.length,
      productosBajoStock: productos.filter(p => p.stock < 10).length,
      ventasDelMes: reportes.ventas.length,
      clientesNuevos: usuarios.filter(u => {
        const fechaRegistro = new Date(u.fechaRegistro);
        const mesActual = new Date();
        mesActual.setMonth(mesActual.getMonth() - 1);
        return fechaRegistro > mesActual;
      }).length
    };

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estadísticas del dashboard',
      error: error.message
    });
  }
});

// Ruta para obtener reportes de ventas
app.get('/api/admin/reportes/ventas', verificarToken, verificarAdmin, (req, res) => {
  try {
    // Generar datos de ejemplo para gráficas
    const reporteVentas = {
      ventasPorMes: [
        { mes: 'Enero', ventas: 12000, cantidad: 45 },
        { mes: 'Febrero', ventas: 15000, cantidad: 52 },
        { mes: 'Marzo', ventas: 18000, cantidad: 68 },
        { mes: 'Abril', ventas: 22000, cantidad: 75 },
        { mes: 'Mayo', ventas: 19000, cantidad: 63 },
        { mes: 'Junio', ventas: 25000, cantidad: 89 }
      ],
      productosMasVendidos: productos.slice(0, 5).map(p => ({
        nombre: p.nombre,
        ventas: Math.floor(Math.random() * 100) + 10,
        ingresos: Math.floor(Math.random() * 5000) + 1000
      })),
      ventasPorCategoria: [
        { categoria: 'Electrónicos', ventas: 35000, porcentaje: 45 },
        { categoria: 'Audio', ventas: 15000, porcentaje: 19 },
        { categoria: 'Wearables', ventas: 12000, porcentaje: 15 },
        { categoria: 'Fotografía', ventas: 8000, porcentaje: 10 },
        { categoria: 'Otros', ventas: 10000, porcentaje: 11 }
      ]
    };

    res.json({
      success: true,
      data: reporteVentas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener reportes de ventas',
      error: error.message
    });
  }
});

// Ruta para obtener reportes de clientes
app.get('/api/admin/reportes/clientes', verificarToken, verificarAdmin, (req, res) => {
  try {
    const clientes = usuarios.filter(u => u.rol === 'cliente');
    
    const reporteClientes = {
      totalClientes: clientes.length,
      clientesNuevos: clientes.filter(c => {
        const fechaRegistro = new Date(c.fechaRegistro);
        const mesActual = new Date();
        mesActual.setMonth(mesActual.getMonth() - 1);
        return fechaRegistro > mesActual;
      }).length,
      clientesActivos: Math.floor(clientes.length * 0.7),
      distribucionPorMes: [
        { mes: 'Enero', clientes: 15 },
        { mes: 'Febrero', clientes: 22 },
        { mes: 'Marzo', clientes: 18 },
        { mes: 'Abril', clientes: 25 },
        { mes: 'Mayo', clientes: 30 },
        { mes: 'Junio', clientes: 28 }
      ]
    };

    res.json({
      success: true,
      data: reporteClientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener reportes de clientes',
      error: error.message
    });
  }
});

// Ruta para obtener reportes de productos
app.get('/api/admin/reportes/productos', verificarToken, verificarAdmin, (req, res) => {
  try {
    const reporteProductos = {
      totalProductos: productos.length,
      productosBajoStock: productos.filter(p => p.stock < 10).length,
      productosSinStock: productos.filter(p => p.stock === 0).length,
      valorTotalInventario: productos.reduce((total, p) => total + (p.precio * p.stock), 0),
      productosPorCategoria: productos.reduce((acc, p) => {
        acc[p.categoria] = (acc[p.categoria] || 0) + 1;
        return acc;
      }, {}),
      topProductos: productos
        .sort((a, b) => b.precio - a.precio)
        .slice(0, 5)
        .map(p => ({
          nombre: p.nombre,
          precio: p.precio,
          stock: p.stock,
          categoria: p.categoria
        }))
    };

    res.json({
      success: true,
      data: reporteProductos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener reportes de productos',
      error: error.message
    });
  }
});

// Ruta para obtener reportes de citas (simulado)
app.get('/api/admin/reportes/citas', verificarToken, verificarAdmin, (req, res) => {
  try {
    const reporteCitas = {
      totalCitas: citas.length,
      citasHoy: citas.filter(c => {
        const hoy = new Date().toDateString();
        return new Date(c.fecha).toDateString() === hoy;
      }).length,
      citasPorMes: [
        { mes: 'Enero', citas: 45 },
        { mes: 'Febrero', citas: 52 },
        { mes: 'Marzo', citas: 48 },
        { mes: 'Abril', citas: 61 },
        { mes: 'Mayo', citas: 55 },
        { mes: 'Junio', citas: 58 }
      ],
      serviciosMasSolicitados: [
        { servicio: 'Corte de Cabello', citas: 120 },
        { servicio: 'Tinte', citas: 85 },
        { servicio: 'Manicure', citas: 95 },
        { servicio: 'Pedicure', citas: 70 },
        { servicio: 'Facial', citas: 45 }
      ]
    };

    res.json({
      success: true,
      data: reporteCitas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener reportes de citas',
      error: error.message
    });
  }
});

// Ruta para gestionar productos (CRUD)
app.get('/api/admin/productos', verificarToken, verificarAdmin, (req, res) => {
  try {
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
});

// Ruta para crear nuevo producto
app.post('/api/admin/productos', verificarToken, verificarAdmin, [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('precio').isNumeric().withMessage('El precio debe ser numérico'),
  body('categoria').notEmpty().withMessage('La categoría es requerida'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        mensaje: 'Datos inválidos',
        errores: errors.array()
      });
    }

    const { nombre, precio, descripcion, imagen, categoria, stock } = req.body;
    
    const nuevoProducto = {
      id: productos.length + 1,
      nombre,
      precio: parseFloat(precio),
      descripcion: descripcion || '',
      imagen: imagen || 'https://via.placeholder.com/400x300?text=Producto',
      categoria,
      stock: parseInt(stock)
    };

    productos.push(nuevoProducto);

    res.status(201).json({
      success: true,
      mensaje: 'Producto creado exitosamente',
      data: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear producto',
      error: error.message
    });
  }
});

// Ruta para actualizar producto
app.put('/api/admin/productos/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productoIndex = productos.findIndex(p => p.id === id);
    
    if (productoIndex === -1) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    const { nombre, precio, descripcion, imagen, categoria, stock } = req.body;
    
    productos[productoIndex] = {
      ...productos[productoIndex],
      nombre: nombre || productos[productoIndex].nombre,
      precio: precio ? parseFloat(precio) : productos[productoIndex].precio,
      descripcion: descripcion || productos[productoIndex].descripcion,
      imagen: imagen || productos[productoIndex].imagen,
      categoria: categoria || productos[productoIndex].categoria,
      stock: stock ? parseInt(stock) : productos[productoIndex].stock
    };

    res.json({
      success: true,
      mensaje: 'Producto actualizado exitosamente',
      data: productos[productoIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar producto',
      error: error.message
    });
  }
});

// Ruta para eliminar producto
app.delete('/api/admin/productos/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productoIndex = productos.findIndex(p => p.id === id);
    
    if (productoIndex === -1) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    productos.splice(productoIndex, 1);

    res.json({
      success: true,
      mensaje: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar producto',
      error: error.message
    });
  }
});

// Ruta para obtener lista de clientes
app.get('/api/admin/clientes', verificarToken, verificarAdmin, (req, res) => {
  try {
    const clientes = usuarios.filter(u => u.rol === 'cliente').map(c => ({
      id: c.id,
      nombre: c.nombre,
      email: c.email,
      fechaRegistro: c.fechaRegistro
    }));

    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener clientes',
      error: error.message
    });
  }
});

// ================================
// RUTAS DE GESTIÓN DE CITAS DEL SALÓN
// ================================

// Obtener todas las citas
app.get('/api/citas', verificarToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: citasSalon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas',
      error: error.message
    });
  }
});

// Obtener cita por ID
app.get('/api/citas/:id', verificarToken, (req, res) => {
  try {
    const { id } = req.params;
    const cita = citasSalon.find(c => c.id === id);
    
    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: cita
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cita',
      error: error.message
    });
  }
});

// Crear nueva cita
app.post('/api/citas', verificarToken, (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      fecha,
      hora,
      servicio,
      tipoCliente,
      notas,
      foto
    } = req.body;
    
    // Validar datos requeridos
    if (!nombre || !email || !fecha || !hora || !servicio || !tipoCliente) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }
    
    // Validar que la fecha no sea domingo
    const fechaObj = new Date(fecha);
    if (fechaObj.getDay() === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden agendar citas los domingos'
      });
    }
    
    // Validar que no se exceda el límite de citas por día
    const citasDelDia = citasSalon.filter(c => c.fecha === fecha);
    if (citasDelDia.length >= configuracionCitas.maxCitasPorDia) {
      return res.status(400).json({
        success: false,
        message: `Solo se pueden agendar ${configuracionCitas.maxCitasPorDia} citas por día`
      });
    }
    
    // Validar que el horario esté disponible
    const horarioOcupado = citasDelDia.some(c => c.hora === hora);
    if (horarioOcupado) {
      return res.status(400).json({
        success: false,
        message: 'El horario seleccionado ya está ocupado'
      });
    }
    
    // Validar que el horario esté en la lista de horarios disponibles
    if (!configuracionCitas.horariosDisponibles.includes(hora)) {
      return res.status(400).json({
        success: false,
        message: 'El horario seleccionado no está disponible'
      });
    }
    
    // Validar que el servicio esté disponible
    if (!serviciosDisponibles.includes(servicio)) {
      return res.status(400).json({
        success: false,
        message: 'El servicio seleccionado no está disponible'
      });
    }
    
    // Crear nueva cita
    const nuevaCita = {
      id: Date.now().toString(),
      nombre,
      email,
      telefono: telefono || '',
      fecha,
      hora,
      servicio,
      tipoCliente,
      estado: 'pendiente',
      foto: foto || null,
      notas: notas || '',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
    
    citasSalon.push(nuevaCita);
    
    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: nuevaCita
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la cita',
      error: error.message
    });
  }
});

// Actualizar cita
app.put('/api/citas/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const citaIndex = citasSalon.findIndex(c => c.id === id);
    
    if (citaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    const {
      nombre,
      email,
      telefono,
      fecha,
      hora,
      servicio,
      tipoCliente,
      estado,
      notas,
      foto
    } = req.body;
    
    // Validar que la fecha no sea domingo si se está cambiando
    if (fecha) {
      const fechaObj = new Date(fecha);
      if (fechaObj.getDay() === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se pueden agendar citas los domingos'
        });
      }
    }
    
    // Actualizar cita
    citasSalon[citaIndex] = {
      ...citasSalon[citaIndex],
      ...(nombre && { nombre }),
      ...(email && { email }),
      ...(telefono !== undefined && { telefono }),
      ...(fecha && { fecha }),
      ...(hora && { hora }),
      ...(servicio && { servicio }),
      ...(tipoCliente && { tipoCliente }),
      ...(estado && { estado }),
      ...(notas !== undefined && { notas }),
      ...(foto !== undefined && { foto }),
      fechaActualizacion: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: citasSalon[citaIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la cita',
      error: error.message
    });
  }
});

// Eliminar cita
app.delete('/api/citas/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const citaIndex = citasSalon.findIndex(c => c.id === id);
    
    if (citaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    citasSalon.splice(citaIndex, 1);
    
    res.json({
      success: true,
      message: 'Cita eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la cita',
      error: error.message
    });
  }
});

// Obtener servicios disponibles
app.get('/api/citas/servicios', (req, res) => {
  try {
    res.json({
      success: true,
      data: serviciosDisponibles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios',
      error: error.message
    });
  }
});

// Obtener horarios disponibles para una fecha
app.get('/api/citas/horarios/:fecha', verificarToken, (req, res) => {
  try {
    const { fecha } = req.params;
    
    // Validar que la fecha no sea domingo
    const fechaObj = new Date(fecha);
    if (fechaObj.getDay() === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden agendar citas los domingos'
      });
    }
    
    // Obtener citas del día
    const citasDelDia = citasSalon.filter(c => c.fecha === fecha);
    
    // Filtrar horarios ocupados
    const horariosOcupados = citasDelDia.map(c => c.hora);
    const horariosDisponibles = configuracionCitas.horariosDisponibles.filter(
      horario => !horariosOcupados.includes(horario)
    );
    
    res.json({
      success: true,
      data: {
        horariosDisponibles,
        citasDelDia: citasDelDia.length,
        maxCitasPorDia: configuracionCitas.maxCitasPorDia
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener horarios disponibles',
      error: error.message
    });
  }
});

// Obtener estadísticas de citas
app.get('/api/citas/estadisticas', verificarToken, (req, res) => {
  try {
    const totalCitas = citasSalon.length;
    const citasPendientes = citasSalon.filter(c => c.estado === 'pendiente').length;
    const citasConfirmadas = citasSalon.filter(c => c.estado === 'confirmada').length;
    const citasCompletadas = citasSalon.filter(c => c.estado === 'completada').length;
    const clientesFrecuentes = citasSalon.filter(c => c.tipoCliente === 'frecuente').length;
    const clientesNuevos = citasSalon.filter(c => c.tipoCliente === 'nuevo').length;
    
    // Estadísticas por servicio
    const serviciosStats = serviciosDisponibles.map(servicio => ({
      servicio,
      cantidad: citasSalon.filter(c => c.servicio === servicio).length
    }));
    
    // Estadísticas por mes (últimos 6 meses)
    const ahora = new Date();
    const estadisticasMensuales = [];
    
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const mes = fecha.toLocaleString('es-ES', { month: 'long' });
      const año = fecha.getFullYear();
      
      const citasDelMes = citasSalon.filter(c => {
        const fechaCita = new Date(c.fecha);
        return fechaCita.getMonth() === fecha.getMonth() && 
               fechaCita.getFullYear() === fecha.getFullYear();
      });
      
      estadisticasMensuales.push({
        mes: `${mes} ${año}`,
        cantidad: citasDelMes.length
      });
    }
    
    const estadisticas = {
      totalCitas,
      citasPendientes,
      citasConfirmadas,
      citasCompletadas,
      clientesFrecuentes,
      clientesNuevos,
      serviciosStats,
      estadisticasMensuales
    };
    
    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de citas',
      error: error.message
    });
  }
});

// Subir foto de cita
app.post('/api/citas/:id/foto', verificarToken, (req, res) => {
  try {
    const { id } = req.params;
    const { foto } = req.body; // Base64 string
    
    const citaIndex = citasSalon.findIndex(c => c.id === id);
    
    if (citaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    // Actualizar foto de la cita
    citasSalon[citaIndex].foto = foto;
    citasSalon[citaIndex].fechaActualizacion = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Foto actualizada exitosamente',
      data: citasSalon[citaIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la foto',
      error: error.message
    });
  }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📱 API disponible en http://localhost:${PORT}/api`);
  
  // Inicializar administrador por defecto
  await inicializarAdmin();
});
