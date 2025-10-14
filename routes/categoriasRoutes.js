// Rutas para categorías de productos
const express = require('express');
const router = express.Router();

// Ruta para obtener todas las categorías
router.get('/', (req, res) => {
  const categorias = [
    {
      id: 1,
      nombre: 'Cuidado Capilar',
      descripcion: 'Productos para el cuidado del cabello',
      imagen: '/images/categoria-capilar.jpg'
    },
    {
      id: 2,
      nombre: 'Tratamientos',
      descripcion: 'Tratamientos especializados',
      imagen: '/images/categoria-tratamientos.jpg'
    },
    {
      id: 3,
      nombre: 'Cuidado Personal',
      descripcion: 'Productos de cuidado personal',
      imagen: '/images/categoria-personal.jpg'
    },
    {
      id: 4,
      nombre: 'Manicure',
      descripcion: 'Productos para manicure y pedicure',
      imagen: '/images/categoria-manicure.jpg'
    },
    {
      id: 5,
      nombre: 'Maquillaje',
      descripcion: 'Productos de maquillaje profesional',
      imagen: '/images/categoria-maquillaje.jpg'
    }
  ];

  res.json({
    success: true,
    data: categorias
  });
});

module.exports = router;
