// Tests para el servidor backend
const request = require('supertest');
const app = require('../server');

describe('API de Nueva Tienda', () => {
  
  // Test de la ruta principal
  describe('GET /', () => {
    it('debería devolver información de la API', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  // Test de productos
  describe('GET /api/productos', () => {
    it('debería devolver lista de productos', async () => {
      const response = await request(app)
        .get('/api/productos')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  // Test de categorías
  describe('GET /api/categorias', () => {
    it('debería devolver lista de categorías', async () => {
      const response = await request(app)
        .get('/api/categorias')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  // Test de carrito
  describe('GET /api/carrito', () => {
    it('debería devolver carrito vacío inicialmente', async () => {
      const response = await request(app)
        .get('/api/carrito')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });
  });

  // Test de servicios de citas
  describe('GET /api/citas/servicios', () => {
    it('debería devolver servicios disponibles', async () => {
      const response = await request(app)
        .get('/api/citas/servicios')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  // Test de autenticación
  describe('POST /api/auth/registro', () => {
    it('debería registrar un nuevo usuario', async () => {
      const nuevoUsuario = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/registro')
        .send(nuevoUsuario)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('usuario');
      expect(response.body.data).toHaveProperty('token');
    });

    it('debería fallar con datos inválidos', async () => {
      const usuarioInvalido = {
        nombre: '',
        email: 'email-invalido',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/registro')
        .send(usuarioInvalido)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });

  // Test de login
  describe('POST /api/auth/login', () => {
    it('debería hacer login con credenciales válidas', async () => {
      // Primero registrar un usuario
      const nuevoUsuario = {
        nombre: 'Test User Login',
        email: 'testlogin@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/registro')
        .send(nuevoUsuario);

      // Luego hacer login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testlogin@example.com',
          password: 'password123'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('usuario');
      expect(response.body.data).toHaveProperty('token');
    });

    it('debería fallar con credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@example.com',
          password: 'password123'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });

  // Test de admin login
  describe('POST /api/auth/admin-login', () => {
    it('debería hacer login como admin', async () => {
      const response = await request(app)
        .post('/api/auth/admin-login')
        .send({
          usuario: 'admin',
          password: 'password'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.usuario.rol).toBe('admin');
    });

    it('debería fallar con credenciales de admin inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/admin-login')
        .send({
          usuario: 'admin',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });

  // Test de rutas protegidas
  describe('Rutas protegidas', () => {
    let token;

    beforeAll(async () => {
      // Hacer login como admin para obtener token
      const response = await request(app)
        .post('/api/auth/admin-login')
        .send({
          usuario: 'admin',
          password: 'password'
        });
      
      token = response.body.data.token;
    });

    it('debería acceder al dashboard con token válido', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalProductos');
    });

    it('debería fallar sin token', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });

  // Test de rate limiting
  describe('Rate Limiting', () => {
    it('debería aplicar rate limiting después de muchas requests', async () => {
      // Hacer muchas requests rápidamente
      const promises = [];
      for (let i = 0; i < 105; i++) {
        promises.push(request(app).get('/api/productos'));
      }
      
      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  // Test de manejo de errores
  describe('Manejo de errores', () => {
    it('debería manejar rutas no encontradas', async () => {
      const response = await request(app)
        .get('/api/ruta-inexistente')
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
});
