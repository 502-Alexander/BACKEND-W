-- =======================================
-- BASE DE DATOS SALON_SF
-- =======================================
CREATE DATABASE IF NOT EXISTS salon_sf;
USE salon_sf;

-- =======================================
-- TABLA USUARIOS (Autenticación) *
-- =======================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'user', 'moderator') DEFAULT 'user',
    verificado BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    token_verificacion VARCHAR(100),
    fecha_verificacion TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_rol (rol)
);

-- =======================================
-- TABLA CLIENTES*
-- =======================================
CREATE TABLE IF NOT EXISTS clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion TEXT,  -- Más flexible para direcciones largas
    telefono VARCHAR(20),
    correo_electronico VARCHAR(150) UNIQUE,  -- Nombre más descriptivo
    tipo_cliente ENUM('Nuevo', 'Frecuente') DEFAULT 'Nuevo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_correo (correo_electronico),
    INDEX idx_tipo_cliente (tipo_cliente),
    INDEX idx_nombre_apellido (nombre, apellido)
);

-- =======================================
-- TABLA SERVICIOS*
-- =======================================
CREATE TABLE IF NOT EXISTS servicios (
    servicio_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10,2) NOT NULL
);

-- =======================================
-- TABLA CITAS*
-- =======================================
CREATE TABLE IF NOT EXISTS citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellidos_cliente VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    direccion TEXT,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    servicio_id INT,
    servicio_nombre VARCHAR(200),
    combo_id INT,
    combo_nombre VARCHAR(200),
    tiene_tratamiento_quimico TINYINT(1) DEFAULT 0,
    tipo_tratamiento VARCHAR(100),
    largo_pelo VARCHAR(50),
    desea_combo TINYINT(1) DEFAULT 0,
    tipo_cliente ENUM('Nuevo', 'Frecuente') DEFAULT 'Nuevo',
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Eliminada') DEFAULT 'Pendiente',
    observaciones TEXT,
    foto_cliente VARCHAR(255) NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fecha_cita (fecha_cita),
    INDEX idx_estado (estado),
    INDEX idx_tipo_cliente (tipo_cliente)
);

-- =======================================
-- TABLA VENTAS*
-- =======================================
CREATE TABLE IF NOT EXISTS ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATE NOT NULL,
    hora_venta TIME NOT NULL,
    total_venta DECIMAL(10,2) NOT NULL,
    cliente_id INT,
    cliente_nombre VARCHAR(100),
    cliente_email VARCHAR(150),
    metodo_pago ENUM('Efectivo', 'Transferencia') DEFAULT 'Efectivo',
    estado ENUM('Pendiente', 'Completada', 'Cancelada') DEFAULT 'Pendiente',
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id) ON DELETE SET NULL,
    INDEX idx_fecha_venta (fecha_venta),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado)
);

-- =======================================
-- TABLA DETALLE VENTAS3*
-- =======================================
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    producto_nombre VARCHAR(200) NOT NULL,
    producto_marca VARCHAR(100),
    categoria VARCHAR(100),
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    INDEX idx_venta (venta_id),
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (fecha_registro)
);

-- =======================================
-- TABLA VENTA_DETALLES (Para carrito/checkout)*
-- =======================================
CREATE TABLE IF NOT EXISTS venta_detalles (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
    INDEX idx_venta (venta_id),
    INDEX idx_producto (producto_id)
);

-- =======================================
-- TABLA MOVIMIENTOS INVENTARIO*
-- =======================================
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    movimiento_id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo_movimiento ENUM('Entrada', 'Salida', 'Ajuste') NOT NULL,
    cantidad INT NOT NULL,
    motivo VARCHAR(255),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (fecha_movimiento),
    INDEX idx_tipo (tipo_movimiento)
);

-- =======================================
-- TABLA COMBOS*
-- =======================================
CREATE TABLE IF NOT EXISTS combos (
    combo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_combo DECIMAL(10,2) NOT NULL
);


-- =======================================
-- TABLA CATEGORÍAS 1*
-- =======================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activa TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================
-- TABLA PRODUCTOS 2*
-- =======================================
CREATE TABLE IF NOT EXISTS productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100),
    categoria_id INT,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    foto1 VARCHAR(255), -- Cambiado de LONGBLOB a VARCHAR para URLs
    foto2 VARCHAR(255), -- Cambiado de LONGBLOB a VARCHAR para URLs
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    INDEX idx_categoria (categoria_id),
    INDEX idx_activo (activo),
    INDEX idx_marca (marca)
);

-- =======================================
-- TABLA INVENTARIO*
-- =======================================
CREATE TABLE IF NOT EXISTS inventario (
    inventario_id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id),
    INDEX idx_stock (stock_actual)
);

-- =======================================
-- TABLA CARRITO
-- =======================================
CREATE TABLE IF NOT EXISTS carrito (
    carrito_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    INDEX idx_carrito_cliente (cliente_id),
    INDEX idx_carrito_fecha (fecha_creacion)
);

-- =======================================
-- TABLA DETALLES CARRITO
-- =======================================
CREATE TABLE IF NOT EXISTS carrito_detalles (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (carrito_id) REFERENCES carrito(carrito_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE CASCADE,
    UNIQUE KEY uq_carrito_producto (carrito_id, producto_id),
    INDEX idx_carrito_detalles_carrito (carrito_id),
    INDEX idx_carrito_detalles_producto (producto_id)
);

-- =======================================
-- TABLA PEDIDOS
-- =======================================
CREATE TABLE IF NOT EXISTS pedidos (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('Pendiente','Confirmado','Cancelado') DEFAULT 'Confirmado',
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

-- =======================================
-- TABLA DETALLES DE PEDIDOS
-- =======================================
CREATE TABLE IF NOT EXISTS pedido_detalles (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id),
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
);

-- =======================================
-- TABLA LOGS
-- =======================================
CREATE TABLE IF NOT EXISTS logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(100),
    accion VARCHAR(50),
    detalle TEXT
);

-- =======================================
-- PROCEDIMIENTOS DE REPORTES
-- =======================================

-- Ingresos combinados por fecha (productos + servicios)
DELIMITER //
CREATE PROCEDURE sp_ingresos_combinados()
BEGIN
    SELECT 
        DATE(c.fecha_cita) AS fecha,
        (SELECT IFNULL(SUM(total),0) 
         FROM pedidos 
         WHERE DATE(fecha_pedido) = DATE(c.fecha_cita)
           AND estado = 'Confirmado') AS ingresos_productos,
        SUM(CASE 
                WHEN c.combo_id IS NOT NULL THEN co.precio_combo
                ELSE s.precio_base
            END) AS ingresos_servicios,
        (
            (SELECT IFNULL(SUM(total),0) 
             FROM pedidos 
             WHERE DATE(fecha_pedido) = DATE(c.fecha_cita)
               AND estado = 'Confirmado')
            +
            SUM(CASE 
                    WHEN c.combo_id IS NOT NULL THEN co.precio_combo
                    ELSE s.precio_base
                END)
        ) AS ingresos_totales
    FROM citas c
    LEFT JOIN servicios s ON c.servicio_id = s.servicio_id
    LEFT JOIN combos co ON c.combo_id = co.combo_id
    GROUP BY DATE(c.fecha_cita)
    ORDER BY fecha DESC;
END;
//
DELIMITER ;

-- Reporte usuarios más activos
DELIMITER //
CREATE PROCEDURE sp_usuarios_activos()
BEGIN
    SELECT usuario, COUNT(*) AS eventos
    FROM logs
    WHERE usuario IS NOT NULL
    GROUP BY usuario
    ORDER BY eventos DESC
    LIMIT 10;
END;
//
DELIMITER ;

-- Reporte errores frecuentes
DELIMITER //
CREATE PROCEDURE sp_errores_frecuentes()
BEGIN
    SELECT detalle AS error, COUNT(*) AS veces
    FROM logs
    WHERE accion = 'ERROR'
    GROUP BY detalle
    ORDER BY veces DESC
    LIMIT 10;
END;
//
DELIMITER ;

-- Reporte actividad diaria
DELIMITER //
CREATE PROCEDURE sp_actividad_diaria()
BEGIN
    SELECT DATE(fecha) AS dia, COUNT(*) AS eventos
    FROM logs
    GROUP BY DATE(fecha)
    ORDER BY dia DESC;
END;
//
DELIMITER ;

-- =======================================
-- DATOS DE EJEMPLO BÁSICOS
-- =======================================
-- Insertar categorías básicas
INSERT IGNORE INTO categorias (nombre, descripcion) VALUES
('Cuidado Capilar', 'Productos para el cuidado del cabello'),
('Tratamientos', 'Tratamientos especializados para el cabello'),
('Accesorios', 'Accesorios y herramientas de belleza'),
('Productos Químicos', 'Tintes, decolorantes y productos químicos');

-- Insertar servicios básicos
INSERT IGNORE INTO servicios (nombre, descripcion, precio_base) VALUES
('Corte', 'Corte de cabello básico', 50.00),
('Color', 'Aplicación de color', 80.00),
('Nanoplastia', 'Tratamiento de nanoplastia', 120.00),
('Botox', 'Tratamiento botox capilar', 100.00),
('Pedicure', 'Cuidado de pies', 40.00),
('Manicure', 'Cuidado de manos', 35.00);

-- Insertar usuario administrador por defecto
INSERT IGNORE INTO usuarios (nombre, email, contrasena, rol, verificado) VALUES
('Administrador', 'admin@salonsf.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- =======================================
-- AJUSTES DE INTEGRIDAD PARA CITAS Y SERVICIOS
-- =======================================
-- Estas sentencias ALTER se incluyen para asegurar relaciones y performance
-- Ejecutar de forma incremental si las tablas ya existen

-- FK: citas.servicio_id → servicios(servicio_id)
ALTER TABLE citas
  ADD CONSTRAINT fk_citas_servicio
  FOREIGN KEY (servicio_id) REFERENCES servicios(servicio_id)
  ON DELETE SET NULL;

-- FK: citas.combo_id → combos(combo_id)
ALTER TABLE citas
  ADD CONSTRAINT fk_citas_combo
  FOREIGN KEY (combo_id) REFERENCES combos(combo_id)
  ON DELETE SET NULL;

-- Índice recomendado para búsquedas por nombre de servicio
CREATE INDEX idx_servicios_nombre ON servicios(nombre);

-- =======================================
-- NORMALIZACIÓN Y OPTIMIZACIONES EXTRAS
-- =======================================
-- 1) Vincular usuarios ↔ clientes por correo (crear clientes faltantes)
INSERT INTO clientes (nombre, apellido, correo_electronico, telefono)
SELECT u.nombre, '', u.email, ''
FROM usuarios u
LEFT JOIN clientes c ON c.correo_electronico = u.email
WHERE c.cliente_id IS NULL;

-- 2) Inventario para productos sin registro
INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
SELECT p.producto_id, 20, 2
FROM productos p
LEFT JOIN inventario i ON i.producto_id = p.producto_id
WHERE i.producto_id IS NULL;

-- 3) Índices recomendados (ignorar error si ya existen)
-- Logs
CREATE INDEX idx_logs_fecha ON logs(fecha);
CREATE INDEX idx_logs_accion ON logs(accion);
-- Productos por categoría
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
-- Citas combinadas
CREATE INDEX idx_citas_fecha_estado ON citas(fecha_cita, estado);

-- =======================================
-- DATOS DE PRUEBA - CITAS DEL SALÓN
-- =======================================
-- Insertar citas de julio y agosto 2025
INSERT INTO citas (
    nombre_cliente,
    apellidos_cliente,
    telefono,
    correo,
    fecha_cita,
    hora_cita,
    servicio_nombre,
    estado,
    tipo_cliente,
    observaciones
) VALUES 
-- JULIO 2025
('Karyn', 'de la roca', '0000-0000', 'karyn@email.com', '2025-07-01', '09:00:00', 'Botox Tratamiento', 'Pendiente', 'Nuevo', 'Cita programada'),
('danizza', '', '0000-0001', 'danizza@email.com', '2025-07-01', '10:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Rose', '', '0000-0002', 'rose@email.com', '2025-07-02', '09:00:00', 'Baño de color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Luci', 'Muñoz', '0000-0003', 'luci@email.com', '2025-07-02', '10:00:00', 'Corte y Tratamiento', 'Pendiente', 'Nuevo', 'Cita programada'),
('Mónica', 'Cuan', '0000-0004', 'monica@email.com', '2025-07-03', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Mely', '', '0000-0005', 'mely@email.com', '2025-07-04', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Marce', 'Romila', '0000-0006', 'marce@email.com', '2025-07-04', '10:00:00', 'Corte y baño de color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Paola', 'de León', '0000-0007', 'paola@email.com', '2025-07-05', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Margarita', '', '0000-0008', 'margarita@email.com', '2025-07-05', '10:00:00', 'Pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Monika', '', '0000-0009', 'monika@email.com', '2025-07-06', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Mirna', 'Mancio', '0000-0010', 'mirna@email.com', '2025-07-06', '10:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Made', '', '0000-0011', 'made@email.com', '2025-07-07', '09:00:00', 'Mechas', 'Pendiente', 'Nuevo', 'Cita programada'),
('Paola', 'Marroquin', '0000-0012', 'paola.marroquin@email.com', '2025-07-07', '10:00:00', 'Corte y color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Doctora', 'Luna', '0000-0013', 'doctora.luna@email.com', '2025-07-09', '18:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada - 6 pm'),
('Leonel', '', '0000-0014', 'leonel@email.com', '2025-07-09', '19:00:00', 'Corte y pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Marleny', '', '0000-0015', 'marleny@email.com', '2025-07-10', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Gaby', '', '0000-0016', 'gaby@email.com', '2025-07-10', '10:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Lorena', '', '0000-0017', 'lorena@email.com', '2025-07-11', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Carmen', 'Terraza', '0000-0018', 'carmen@email.com', '2025-07-11', '10:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Wendy', '', '0000-0019', 'wendy@email.com', '2025-07-12', '09:00:00', 'Pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Danilo', '', '0000-0020', 'danilo@email.com', '2025-07-12', '10:00:00', 'Pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Mónica', '', '0000-0021', 'monica2@email.com', '2025-07-14', '09:00:00', 'Mechas', 'Pendiente', 'Nuevo', 'Cita programada'),
('Frida', '', '0000-0022', 'frida@email.com', '2025-07-15', '09:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Fabiola', '', '0000-0023', 'fabiola@email.com', '2025-07-16', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Sandra', '', '0000-0024', 'sandra@email.com', '2025-07-17', '09:00:00', 'Mechas', 'Pendiente', 'Nuevo', 'Cita programada'),
('Lesbia', '', '0000-0025', 'lesbia@email.com', '2025-07-18', '09:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Doris', '', '0000-0026', 'doris@email.com', '2025-07-18', '10:00:00', 'Color y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Débora', '', '0000-0027', 'debora@email.com', '2025-07-18', '11:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Rocío', 'López', '0000-0028', 'rocio@email.com', '2025-07-19', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Oyiila', '', '0000-0029', 'oyiila@email.com', '2025-07-19', '10:00:00', 'Corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Mariana', '', '0000-0030', 'mariana@email.com', '2025-07-20', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Majo', 'Barras', '0000-0031', 'majo@email.com', '2025-07-20', '10:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Lili', '', '0000-0032', 'lili@email.com', '2025-07-21', '09:00:00', 'Corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Liseth', 'mendez', '0000-0033', 'liseth@email.com', '2025-07-22', '09:00:00', 'Corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Aby', '', '0000-0034', 'aby@email.com', '2025-07-22', '10:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Mirna', 'Mancio', '0000-0035', 'mirna.mancio@email.com', '2025-07-23', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Leny', '', '0000-0036', 'leny@email.com', '2025-07-24', '09:00:00', 'Mechas y pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Katia', 'Monrroy', '0000-0037', 'katia@email.com', '2025-07-24', '10:00:00', 'Mechas', 'Pendiente', 'Nuevo', 'Cita programada'),
('Daniela', '', '0000-0038', 'daniela@email.com', '2025-07-25', '09:00:00', 'Pedicure, corte y manicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Karen', '', '0000-0039', 'karen@email.com', '2025-07-25', '10:00:00', 'Servicio por definir', 'Pendiente', 'Nuevo', 'Cita programada - servicio pendiente'),
('Suncet', '', '0000-0040', 'suncet@email.com', '2025-07-29', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Carol', 'pozuelo', '0000-0041', 'carol@email.com', '2025-07-30', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Andrea', 'pineda', '0000-0042', 'andrea.pineda@email.com', '2025-07-31', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Doctora', 'luna', '0000-0043', 'doctora.luna2@email.com', '2025-07-31', '10:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Leonel', '', '0000-0044', 'leonel2@email.com', '2025-07-31', '11:00:00', 'Corte y pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),

-- AGOSTO 2025
('Katy', '', '0000-0045', 'katy@email.com', '2025-08-01', '08:00:00', 'Servicio por definir', 'Pendiente', 'Nuevo', 'Cita programada - 8 am'),
('Cecilia', '', '0000-0046', 'cecilia@email.com', '2025-08-02', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Nancy', 'de Gonzales', '0000-0047', 'nancy@email.com', '2025-08-04', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Analiz', '', '0000-0048', 'analiz@email.com', '2025-08-04', '10:00:00', 'Corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('danizza', '', '0000-0049', 'danizza2@email.com', '2025-08-05', '09:00:00', 'Color y corte', 'Pendiente', 'Nuevo', 'Cita programada - 9 am'),
('Armando', 'papá', '0000-0050', 'armando.papa@email.com', '2025-08-05', '10:00:00', 'Corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Aparicio', '', '0000-0051', 'aparicio@email.com', '2025-08-05', '11:00:00', 'Corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Rocio', 'Lazo', '0000-0052', 'rocio.lazo@email.com', '2025-08-05', '12:00:00', 'Pedicure y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Armando', 'hijo', '0000-0053', 'armando.hijo@email.com', '2025-08-05', '13:00:00', 'Pedicure y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Yara', 'de Santizo', '0000-0054', 'yara@email.com', '2025-08-06', '09:00:00', 'Mechas y Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Alejandra', 'Noriega', '0000-0055', 'alejandra.noriega@email.com', '2025-08-06', '10:00:00', 'Baño de color y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Doris', '', '0000-0056', 'doris2@email.com', '2025-08-06', '11:00:00', 'Color y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Regina', '', '0000-0057', 'regina@email.com', '2025-08-07', '09:00:00', 'Color y corte', 'Pendiente', 'Nuevo', 'Cita programada - 9 am'),
('Rose', 'manases', '0000-0058', 'rose.manases@email.com', '2025-08-07', '10:00:00', 'Corte y tratamiento', 'Pendiente', 'Nuevo', 'Cita programada'),
('Marcela', '', '0000-0059', 'marcela@email.com', '2025-08-09', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Lucy', '', '0000-0060', 'lucy@email.com', '2025-08-09', '10:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Gaby', '', '0000-0061', 'gaby2@email.com', '2025-08-11', '09:00:00', 'Mechas y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Anita', '', '0000-0062', 'anita@email.com', '2025-08-11', '10:00:00', 'Corte y tratamiento botox', 'Pendiente', 'Nuevo', 'Cita programada'),
('Majo', 'Barras', '0000-0063', 'majo.barras@email.com', '2025-08-12', '09:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Pilar', '', '0000-0064', 'pilar@email.com', '2025-08-12', '10:00:00', 'Botox y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Paulina', '', '0000-0065', 'paulina@email.com', '2025-08-13', '09:00:00', 'Baño de color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Liz', '', '0000-0066', 'liz@email.com', '2025-08-13', '10:00:00', 'Mechas y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Gaby', '', '0000-0067', 'gaby3@email.com', '2025-08-13', '11:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Alejandra', 'Obregon', '0000-0068', 'alejandra.obregon@email.com', '2025-08-14', '09:00:00', 'Color y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Wendy', '', '0000-0069', 'wendy2@email.com', '2025-08-14', '10:00:00', 'pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Danilo', '', '0000-0070', 'danilo2@email.com', '2025-08-14', '11:00:00', 'pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Nadia', '', '0000-0071', 'nadia@email.com', '2025-08-15', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Evelin', '', '0000-0072', 'evelin@email.com', '2025-08-15', '10:00:00', 'Botox', 'Pendiente', 'Nuevo', 'Cita programada'),
('Marin', 'Luna', '0000-0073', 'marin@email.com', '2025-08-16', '09:00:00', 'Nanoplstia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Alejandra', '', '0000-0074', 'alejandra2@email.com', '2025-08-16', '10:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Isabel', '', '0000-0075', 'isabel@email.com', '2025-08-17', '09:00:00', 'Pedicure y manicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Evelin', '', '0000-0076', 'evelin2@email.com', '2025-08-18', '09:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Anita', '', '0000-0077', 'anita2@email.com', '2025-08-18', '10:00:00', 'Baño de color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Yara', '', '0000-0078', 'yara2@email.com', '2025-08-21', '09:00:00', 'Nanoplastia', 'Pendiente', 'Nuevo', 'Cita programada'),
('Paola', '', '0000-0079', 'paola2@email.com', '2025-08-22', '08:00:00', 'Color y corte', 'Pendiente', 'Nuevo', 'Cita programada - 8 am'),
('Lucy', '', '0000-0080', 'lucy2@email.com', '2025-08-23', '09:00:00', 'Color y Tratamiento', 'Pendiente', 'Nuevo', 'Cita programada'),
('Doctora', 'Luna', '0000-0081', 'doctora.luna3@email.com', '2025-08-24', '09:00:00', 'Color', 'Pendiente', 'Nuevo', 'Cita programada'),
('Leonel', '', '0000-0082', 'leonel3@email.com', '2025-08-24', '10:00:00', 'Corte y pedicure', 'Pendiente', 'Nuevo', 'Cita programada'),
('Leny', '', '0000-0083', 'leny2@email.com', '2025-08-25', '09:00:00', 'Pedicure y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Bely', '', '0000-0084', 'bely@email.com', '2025-08-25', '10:00:00', 'Pedicure y corte', 'Pendiente', 'Nuevo', 'Cita programada'),
('Andrea', 'facciano', '0000-0085', 'andrea.facciano@email.com', '2025-08-27', '09:00:00', 'Blue', 'Pendiente', 'Nuevo', 'Cita programada'),
('Andrea', '', '0000-0086', 'andrea3@email.com', '2025-07-28', '09:00:00', 'Mechas', 'Pendiente', 'Nuevo', 'Cita programada'),
('Paty', '', '0000-0087', 'paty@email.com', '2025-07-28', '10:00:00', 'Mechas', 'Pendiente', 'Nuevo', 'Cita programada'),
('Cristian', 'Benítez', '0000-0088', 'cristian@email.com', '2025-08-29', '09:00:00', 'Botox', 'Pendiente', 'Nuevo', 'Cita programada'),
('Debora', '', '0000-0089', 'debora2@email.com', '2025-08-30', '09:00:00', 'Corte y tratamiento', 'Pendiente', 'Nuevo', 'Cita programada'),
('Mara', '', '0000-0090', 'mara@email.com', '2025-08-30', '10:00:00', 'Corte', 'Pendiente', 'Nuevo', 'Cita programada');

-- =======================================
-- CONSULTAS DE VERIFICACIÓN
-- =======================================
-- Mostrar resumen de citas insertadas
SELECT 
    COUNT(*) as total_citas_insertadas,
    COUNT(DISTINCT nombre_cliente) as clientes_unicos,
    MIN(fecha_cita) as fecha_inicio,
    MAX(fecha_cita) as fecha_fin
FROM citas 
WHERE fecha_cita >= '2025-07-01' AND fecha_cita <= '2025-08-31';

-- Mostrar citas por mes
SELECT 
    MONTH(fecha_cita) as mes,
    COUNT(*) as total_citas
FROM citas 
WHERE fecha_cita >= '2025-07-01' AND fecha_cita <= '2025-08-31'
GROUP BY MONTH(fecha_cita)
ORDER BY mes;

SELECT * FROM categorias;
