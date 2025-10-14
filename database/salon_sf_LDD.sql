-- =============================
-- CREAR BASE DE DATOS
-- =============================
CREATE DATABASE IF NOT EXISTS salon_sf;
USE salon_sf;

-- =============================
-- TABLA DE CLIENTES
-- =============================
CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    correo VARCHAR(150) UNIQUE,
    tipo_cliente ENUM('Nuevo','Frecuente') DEFAULT 'Nuevo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- TABLA DE SERVICIOS
-- =============================
CREATE TABLE servicios (
    servicio_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10,2) NOT NULL
);

-- =============================
-- TABLA DE COMBOS
-- =============================
CREATE TABLE combos (
    combo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_combo DECIMAL(10,2) NOT NULL
);

-- =============================
-- TABLA DE CITAS
-- =============================
CREATE TABLE citas (
    cita_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    servicio_id INT,
    combo_id INT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tratamiento_quimico BOOLEAN DEFAULT FALSE,
    nota TEXT,
    foto LONGBLOB NOT NULL,
    estado ENUM('Agendada','Cancelada','Atendida') DEFAULT 'Agendada',
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(servicio_id),
    FOREIGN KEY (combo_id) REFERENCES combos(combo_id)
);

-- =============================
-- TABLA DE PRODUCTOS
-- =============================
CREATE TABLE productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    foto1 LONGBLOB,
    foto2 LONGBLOB,
    precio DECIMAL(10,2) NOT NULL
);

-- =============================
-- TABLA DE INVENTARIO
-- =============================
CREATE TABLE inventario (
    inventario_id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
);

-- =============================
-- TABLA DE CARRITO
-- =============================
CREATE TABLE carrito (
    carrito_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

-- =============================
-- TABLA DE DETALLES DE CARRITO
-- =============================
CREATE TABLE carrito_detalles (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (carrito_id) REFERENCES carrito(carrito_id),
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
);

-- =============================
-- TABLA DE PEDIDOS
-- =============================
CREATE TABLE pedidos (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('Pendiente','Confirmado','Cancelado') DEFAULT 'Confirmado',
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

-- =============================
-- TABLA DE DETALLES DE PEDIDOS
-- =============================
CREATE TABLE pedido_detalles (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id),
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
);

-- =============================
-- PROCEDIMIENTO: Insertar cita
-- =============================
DELIMITER //
CREATE PROCEDURE sp_insertar_cita (
    IN p_cliente_id INT,
    IN p_servicio_id INT,
    IN p_combo_id INT,
    IN p_fecha DATE,
    IN p_hora TIME,
    IN p_tratamiento_quimico BOOLEAN,
    IN p_nota TEXT,
    IN p_foto LONGBLOB
)
BEGIN
    DECLARE v_count INT;

    -- Validar domingo
    IF DAYOFWEEK(p_fecha) = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se pueden agendar citas los domingos';
    END IF;

    -- Validar máximo 3 citas por día
    SELECT COUNT(*) INTO v_count
    FROM citas
    WHERE fecha = p_fecha;

    IF v_count >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El límite de 3 citas por día ya está completo';
    END IF;

    -- Insertar cita
    INSERT INTO citas (cliente_id, servicio_id, combo_id, fecha, hora, tratamiento_quimico, nota, foto)
    VALUES (p_cliente_id, p_servicio_id, p_combo_id, p_fecha, p_hora, p_tratamiento_quimico, p_nota, p_foto);
END;
//
DELIMITER ;

-- =============================
-- PROCEDIMIENTO: Costo estimado cita
-- =============================
DELIMITER //
CREATE PROCEDURE sp_costo_estimado (
    IN p_servicio_id INT,
    IN p_combo_id INT,
    OUT p_costo DECIMAL(10,2)
)
BEGIN
    IF p_combo_id IS NOT NULL THEN
        SELECT precio_combo INTO p_costo
        FROM combos
        WHERE combo_id = p_combo_id;
    ELSE
        SELECT precio_base INTO p_costo
        FROM servicios
        WHERE servicio_id = p_servicio_id;
    END IF;
END;
//
DELIMITER ;

-- =============================
-- PROCEDIMIENTO: Horarios disponibles
-- =============================
DELIMITER //
CREATE PROCEDURE sp_horarios_disponibles (
    IN p_fecha DATE
)
BEGIN
    DECLARE v_hora TIME;
    SET v_hora = '09:00:00';

    DROP TEMPORARY TABLE IF EXISTS tmp_horarios;
    CREATE TEMPORARY TABLE tmp_horarios (
        hora TIME,
        disponible BOOLEAN
    );

    WHILE v_hora < '18:00:00' DO
        INSERT INTO tmp_horarios (hora, disponible)
        VALUES (v_hora,
            (SELECT COUNT(*) FROM citas WHERE fecha = p_fecha AND hora = v_hora) < 1
        );
        SET v_hora = ADDTIME(v_hora, '01:00:00');
    END WHILE;

    SELECT * FROM tmp_horarios;
END;
//
DELIMITER ;

-- =============================
-- PROCEDIMIENTO: Agregar producto al carrito
-- =============================
DELIMITER //
CREATE PROCEDURE sp_agregar_producto_carrito (
    IN p_cliente_id INT,
    IN p_producto_id INT,
    IN p_cantidad INT,
    OUT p_total DECIMAL(10,2)
)
BEGIN
    DECLARE v_carrito_id INT;
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_stock INT;

    IF p_cantidad <= 0 THEN
        SET p_cantidad = 1;
    END IF;

    SELECT stock_actual INTO v_stock
    FROM inventario
    WHERE producto_id = p_producto_id;

    IF v_stock IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no existe en inventario';
    END IF;

    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para este producto';
    END IF;

    SELECT carrito_id INTO v_carrito_id
    FROM carrito
    WHERE cliente_id = p_cliente_id
    ORDER BY fecha_creacion DESC
    LIMIT 1;

    IF v_carrito_id IS NULL THEN
        INSERT INTO carrito (cliente_id) VALUES (p_cliente_id);
        SET v_carrito_id = LAST_INSERT_ID();
    END IF;

    SELECT precio INTO v_precio
    FROM productos
    WHERE producto_id = p_producto_id;

    IF EXISTS (SELECT 1 FROM carrito_detalles WHERE carrito_id = v_carrito_id AND producto_id = p_producto_id) THEN
        UPDATE carrito_detalles
        SET cantidad = cantidad + p_cantidad,
            precio_unitario = v_precio
        WHERE carrito_id = v_carrito_id AND producto_id = p_producto_id;
    ELSE
        INSERT INTO carrito_detalles (carrito_id, producto_id, cantidad, precio_unitario)
        VALUES (v_carrito_id, p_producto_id, p_cantidad, v_precio);
    END IF;

    SELECT SUM(subtotal) INTO p_total
    FROM carrito_detalles
    WHERE carrito_id = v_carrito_id;
END;
//
DELIMITER ;

-- =============================
-- PROCEDIMIENTO: Quitar producto del carrito
-- =============================
DELIMITER //
CREATE PROCEDURE sp_quitar_producto_carrito (
    IN p_cliente_id INT,
    IN p_producto_id INT,
    OUT p_total DECIMAL(10,2)
)
BEGIN
    DECLARE v_carrito_id INT;

    SELECT carrito_id INTO v_carrito_id
    FROM carrito
    WHERE cliente_id = p_cliente_id
    ORDER BY fecha_creacion DESC
    LIMIT 1;

    IF v_carrito_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no tiene un carrito activo';
    END IF;

    DELETE FROM carrito_detalles
    WHERE carrito_id = v_carrito_id AND producto_id = p_producto_id;

    SELECT SUM(subtotal) INTO p_total
    FROM carrito_detalles
    WHERE carrito_id = v_carrito_id;
END;
//
DELIMITER ;

-- =============================
-- PROCEDIMIENTO: Confirmar compra
-- =============================
DELIMITER //
CREATE PROCEDURE sp_confirmar_compra (
    IN p_cliente_id INT,
    OUT p_pedido_id INT,
    OUT p_total DECIMAL(10,2)
)
BEGIN
    DECLARE v_carrito_id INT;

    SELECT carrito_id INTO v_carrito_id
    FROM carrito
    WHERE cliente_id = p_cliente_id
    ORDER BY fecha_creacion DESC
    LIMIT 1;

    IF v_carrito_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no tiene un carrito activo';
    END IF;

    SELECT SUM(subtotal) INTO p_total
    FROM carrito_detalles
    WHERE carrito_id = v_carrito_id;

    IF p_total IS NULL OR p_total = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El carrito está vacío';
    END IF;

    INSERT INTO pedidos (cliente_id, total, estado)
    VALUES (p_cliente_id, p_total, 'Confirmado');
    SET p_pedido_id = LAST_INSERT_ID();

    INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
    SELECT p_pedido_id, producto_id, cantidad, precio_unitario, subtotal
    FROM carrito_detalles
    WHERE carrito_id = v_carrito_id;

    UPDATE inventario i
    JOIN carrito_detalles cd ON i.producto_id = cd.producto_id
    SET i.stock_actual = i.stock_actual - cd.cantidad
    WHERE cd.carrito_id = v_carrito_id;

    DELETE FROM carrito_detalles WHERE carrito_id = v_carrito_id;
    DELETE FROM carrito WHERE carrito_id = v_carrito_id;
END;
//
DELIMITER ;

-- =============================
-- PROCEDIMIENTO: Alertas de inventario
-- =============================
DELIMITER //
CREATE PROCEDURE sp_alertas_inventario ()
BEGIN
    SELECT p.nombre, i.stock_actual, i.stock_minimo
    FROM inventario i
    JOIN productos p ON i.producto_id = p.producto_id
    WHERE i.stock_actual <= i.stock_minimo
    ORDER BY i.stock_actual ASC;
END;
//
DELIMITER ;

-- =============================
-- PROCEDIMIENTO: Ingresos combinados
-- =============================
DELIMITER //
CREATE PROCEDURE sp_ingresos_combinados ()
BEGIN
    SELECT 
        DATE(ci.fecha) AS fecha,
        (SELECT IFNULL(SUM(total),0) 
         FROM pedidos 
         WHERE DATE(fecha_pedido) = DATE(ci.fecha) 
           AND estado = 'Confirmado') AS ingresos_productos,
        SUM(CASE 
                WHEN ci.combo_id IS NOT NULL THEN co.precio_combo
                ELSE s.precio_base 
            END) AS ingresos_servicios,
        (
            (SELECT IFNULL(SUM(total),0) 
             FROM pedidos 
             WHERE DATE(fecha_pedido) = DATE(ci.fecha) 
               AND estado = 'Confirmado')
            +
            SUM(CASE 
                    WHEN ci.combo_id IS NOT NULL THEN co.precio_combo
                    ELSE s.precio_base 
                END)
        ) AS ingresos_totales
    FROM citas ci
    LEFT JOIN servicios s ON ci.servicio_id = s.servicio_id
    LEFT JOIN combos co ON ci.combo_id = co.combo_id
    GROUP BY DATE(ci.fecha)
    ORDER BY fecha DESC;
END;
//
DELIMITER ;
