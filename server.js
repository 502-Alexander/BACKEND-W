const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas reales con MySQL
app.use('/api/usuarios', usuarioRoutes);

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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🟢 Servidor Backend corriendo en http://localhost:${PORT}`);
});
