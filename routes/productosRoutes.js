// Rutas para productos
const express = require('express');
const router = express.Router();

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
  // Productos de ejemplo para el salón de belleza
  const productos = [
    {
      id: 1,
      nombre: 'Shampoo Hidratante',
      descripcion: 'Shampoo para cabello seco y dañado',
      precio: 25.99,
      categoria: 'Cuidado Capilar',
      imagen: '/images/shampoo.jpg',
      stock: 50
    },
    {
      id: 2,
      nombre: 'Acondicionador Reparador',
      descripcion: 'Acondicionador para cabello dañado',
      precio: 28.99,
      categoria: 'Cuidado Capilar',
      imagen: '/images/acondicionador.jpg',
      stock: 30
    },
    {
      id: 3,
      nombre: 'Mascarilla Nutritiva',
      descripcion: 'Mascarilla para cabello maltratado',
      precio: 35.99,
      categoria: 'Tratamientos',
      imagen: '/images/mascarilla.jpg',
      stock: 20
    },
    {
      id: 4,
      nombre: 'Crema para Manos',
      descripcion: 'Crema hidratante para manos',
      precio: 15.99,
      categoria: 'Cuidado Personal',
      imagen: '/images/crema-manos.jpg',
      stock: 40
    },
    {
      id: 5,
      nombre: 'Esmalte de Uñas',
      descripcion: 'Esmalte de larga duración',
      precio: 12.99,
      categoria: 'Manicure',
      imagen: '/images/esmalte.jpg',
      stock: 60
    },
    {
      id: 6,
      nombre: 'Kit de Maquillaje',
      descripcion: 'Kit completo de maquillaje profesional',
      precio: 89.99,
      categoria: 'Maquillaje',
      imagen: '/images/kit-maquillaje.jpg',
      stock: 15
    }
  ];

  res.json({
    success: true,
    data: productos
  });
});

// Ruta para obtener un producto por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // Por ahora devolvemos un producto de ejemplo
  res.json({
    success: true,
    data: {
      id: parseInt(id),
      nombre: 'Producto de Ejemplo',
      descripcion: 'Descripción del producto',
      precio: 25.99,
      categoria: 'Cuidado Capilar',
      imagen: '/images/producto.jpg',
      stock: 50
    }
  });
});

module.exports = router;
