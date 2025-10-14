-- Script SQL para crear las tablas necesarias para el sistema de verificación por email
-- Ejecutar este script en tu base de datos MySQL

-- 1. Agregar columna 'verificado' a la tabla usuarios existente
-- Esta columna indica si el usuario ha verificado su email
ALTER TABLE usuarios 
ADD COLUMN verificado BOOLEAN DEFAULT FALSE AFTER contrasena;

-- 2. Agregar columna 'rol' a la tabla usuarios
-- Esta columna define si el usuario es admin o cliente
ALTER TABLE usuarios 
ADD COLUMN rol ENUM('admin', 'cliente') DEFAULT 'cliente' AFTER verificado;

-- 3. Crear tabla para tokens de verificación
-- Esta tabla almacena los tokens únicos para verificar emails
CREATE TABLE IF NOT EXISTS tokens_verificacion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  tipo ENUM('verificacion', 'reset_password') NOT NULL DEFAULT 'verificacion',
  expira_en TIMESTAMP NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 4. Crear índice para mejorar el rendimiento de búsquedas por token
CREATE INDEX idx_token ON tokens_verificacion(token);

-- 5. Crear índice para mejorar el rendimiento de búsquedas por usuario
CREATE INDEX idx_usuario_tipo ON tokens_verificacion(usuario_id, tipo);

-- 6. Crear índice para mejorar el rendimiento de limpieza de tokens expirados
CREATE INDEX idx_expira_en ON tokens_verificacion(expira_en);

-- 7. Insertar usuario administrador por defecto (si no existe)
-- Este usuario tendrá rol de admin y estará verificado
INSERT IGNORE INTO usuarios (nombre, email, contrasena, verificado, rol, fecha_registro) 
VALUES (
  'Administrador', 
  'admin@nuevatienda.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
  TRUE, 
  'admin', 
  NOW()
);

-- 8. Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas exitosamente' as mensaje;
SELECT 'Usuarios con nuevas columnas:' as info;
DESCRIBE usuarios;
SELECT 'Tabla de tokens creada:' as info;
DESCRIBE tokens_verificacion;
