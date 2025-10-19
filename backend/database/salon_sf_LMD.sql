-- =============================
-- DATOS INICIALES PARA SALÓN SANDRA FAJARDO
-- =============================

USE salon_sf;

-- =============================
-- INSERTAR SERVICIOS CON PRECIOS REALES
-- =============================
INSERT INTO servicios (nombre, descripcion, precio_base) VALUES
('Nanoplastía (alisado)', 'Alisado profesional según largo y grosor del cabello - Duración: 5 a 8 horas', 925.00),
('Corte', 'Corte profesional adaptado a tu estilo - Duración: 45 minutos', 150.00),
('Baño de color (tinte)', 'Coloración profesional con productos de calidad - Duración: 2 horas', 300.00),
('Diseño de color (mechas y balayage)', 'Técnicas avanzadas de coloración - Duración: 5 a 7 horas', 650.00),
('Pedicure', 'Pedicure completo con esmaltado - Duración: 1 hora', 150.00),
('Tratamientos capilares', 'Tratamiento reparador para cabello dañado - Duración: 2 horas', 350.00),
('Manicure', 'Manicure completo con esmaltado', 120.00);

-- =============================
-- INSERTAR COMBOS CON PRECIOS REALES  
-- =============================
INSERT INTO combos (nombre, descripcion, precio_combo) VALUES
('Baño de color + tratamiento + peinado', 'Combo completo de coloración con tratamiento y peinado - Duración: 2 horas', 300.00),
('Corte + tratamiento + peinado', 'Combo de corte con tratamiento y peinado - Duración: 2 a 3 horas', 350.00);

-- ===============================
-- DATOS DE CATEGORÍAS
-- ===============================
INSERT INTO categorias (nombre, descripcion) VALUES
('Tratamientos', 'Productos especializados para tratamientos capilares'),
('Tintes', 'Productos para coloración del cabello'),
('Tratamientos Capilares', 'Es una alternativa más suave y sin formol, aporta brillo y sedosidad');

SELECT * FROM categorias;
-- =============================
-- INSERTAR PRODUCTOS PROFESIONALES DUE FACETTA
-- =============================
-- Insertar los 10 productos (ahora empezarán desde ID 1)
INSERT INTO productos (nombre, marca, categoria_id, descripcion, precio, activo) VALUES 
('Due Faccetta Lunga Durata', 'Due Faccetta', 2, 'Hidratante protector de color para cabello teñido. Ideal para cabello teñido o con coloración reciente. Aplicar sobre el cabello húmedo, dejar actuar unos minutos y enjuagar. Resultados: Mayor duración del color, hidratación profunda y brillo.', 269.00, 1),
('Due Faccetta Massimo', 'Due Faccetta', 3, 'Reparador para cabello sobreprocesado. Fortalece y controla la porosidad. Ideal para cabello dañado por decoloración, calor o químicos. Aplicar sobre el cabello húmedo, dejar actuar y enjuagar. Resultados: Repara, da fuerza y mejora la textura del cabello.', 269.00, 1),
('Due Faccetta Giorno Per Giorno', 'Due Faccetta', 2, 'Hidratación intensiva diaria, combate el frizz. Ideal para cabello seco, con frizz o sin brillo. Uso diario después del lavado, enjuagar o dejar según necesidad. Resultados: Cabello más suave, manejable y nutrido.', 269.00, 1),
('Balsami Presto Treatment', 'Due Faccetta', 3, 'Tratamiento revitalizante que se deja puesto. Ideal para todo tipo de cabello que necesite suavidad y brillo extra. Aplicar sobre el cabello limpio y húmedo, no se enjuaga. Resultados: Brillo inmediato, reparación ligera y textura sedosa.', 199.00, 1),
('Riccioli Leave-In Cream', 'Due Faccetta', 3, 'Crema definidora para rizos flexibles, sin frizz. Ideal para cabello rizado u ondulado. Aplicar en seco o húmedo, definir con las manos. No se enjuaga. Resultados: Rizos definidos, suaves y con forma natural.', 229.00, 1),
('Silk System Shine', 'Due Faccetta', 3, 'Sérum para brillo, suavidad y prevención de puntas abiertas. Ideal para todo tipo de cabello, especialmente puntas dañadas. Aplicar una pequeña cantidad en medios y puntas. Resultados: Cabello brillante, sin frizz y con apariencia saludable.', 149.00, 1),
('Perfect Blonder 1 - Shampoo', 'Perfect Blonder', 1, 'Neutraliza tonos naranjas y amarillos no deseados en cabellos rubios. Ideal para cabello rubio, decolorado o con mechas. Aplicar sobre cabello húmedo, dejar actuar 3-5 min y enjuagar. Resultados: Matización visible, hidratación y reparación.', 279.00, 1),
('Perfect Blonder 2 - Máscara', 'Perfect Blonder', 3, 'Tratamiento complementario al shampoo Perfect Blonder. Ideal para cabello procesado, rubio o con tonos indeseados. Después del shampoo, aplicar en todo el cabello y dejar actuar 5-10 min. Resultados: Matización, nutrición profunda y suavidad.', 279.00, 1),
('W-One Shampoo', 'W-One', 1, 'Regenera la fibra capilar y prolonga el alisado. Ideal para cabello con alisado o tratamientos capilares. Aplicar sobre el cuero cabelludo y cabello, masajear y enjuagar. Resultados: Cabello fuerte, brillante y saludable por más tiempo.', 269.00, 1),
('W-One Acondicionador 3 en 1', 'W-One', 2, 'Funciona como acondicionador, mascarilla o leave-in. Ideal para cabello seco, alisado o con frizz. Como acondicionador: aplicar y enjuagar. Como mascarilla: dejar 10 min y enjuagar. Como leave-in: aplicar poca cantidad y no enjuagar. Resultados: Hidratación profunda, reducción del frizz y mayor duración del alisado.', 269.00, 1);

-- INSERTAR USUARIO ADMINISTRADOR
-- =============================
INSERT INTO usuarios (nombre, email, contrasena, verificado, rol) VALUES
('Administrador', 'admin@salonsandra.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'admin');

-- =============================
-- INSERTAR CLIENTE ADMINISTRADOR DE PRUEBA
-- =============================
INSERT INTO clientes (nombre, apellido, direccion, telefono, correo_electronico, tipo_cliente) VALUES
('Administrador', 'Sistema', 'Dirección del Salón', '+502 1234-5678', 'admin@salonsandra.com', 'Frecuente'),
('María', 'González', 'Avenida Reforma 123, Zona 9', '1234-5678', 'maria.gonzalez@email.com', 'Frecuente'),
('Carlos', 'López', 'Calzada Roosevelt 456, Zona 11', '2345-6789', 'carlos.lopez@email.com', 'Nuevo'),
('Ana', 'Martínez', '5a calle 8-72, Zona 1', '3456-7890', 'ana.martinez@email.com', 'Frecuente'),
('Pedro', 'Ramírez', '12 calle 6-45, Zona 10', '4567-8901', 'pedro.ramirez@email.com', 'Nuevo'),
('Laura', 'Hernández', 'Ruta 6 9-21, Zona 4', '5678-9012', 'laura.hernandez@email.com', 'Frecuente'),
('José', 'Díaz', 'Avenida Las Américas 15-67, Zona 13', '6789-0123', 'jose.diaz@email.com', 'Nuevo'),
('Sofía', 'Castillo', '8a avenida 12-34, Zona 2', '7890-1234', 'sofia.castillo@email.com', 'Frecuente'),
('Miguel', 'Vásquez', 'Diagonal 6 12-89, Zona 10', '8901-2345', 'miguel.vasquez@email.com', 'Nuevo'),
('Elena', 'Morales', 'Calzada San Juan 45-23, Zona 7', '9012-3456', 'elena.morales@email.com', 'Frecuente'),
('Roberto', 'Silva', 'Boulevard Liberación 78-56, Zona 5', '0123-4567', 'roberto.silva@email.com', 'Nuevo');

SELECT * FROM clientes;

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
-- ===============================
-- ACTUALIZAR PRODUCTOS CON MARCAS Y CATEGORÍAS
-- ===============================
UPDATE productos SET marca = 'Due Faccetta', categoria_id = 1 WHERE nombre = 'Due Faccetta Shampoo';
UPDATE productos SET marca = 'Due Faccetta', categoria_id = 2 WHERE nombre = 'Due Faccetta Acondicionador';
UPDATE productos SET marca = 'Perfect Blonder', categoria_id = 3 WHERE nombre = 'Perfect Blonder Tratamiento';
UPDATE productos SET marca = 'W-One', categoria_id = 4 WHERE nombre = 'W-One Tinte Rubio';
UPDATE productos SET marca = 'W-One', categoria_id = 4 WHERE nombre = 'W-One Tinte Castaño';
UPDATE productos SET marca = 'Due Faccetta', categoria_id = 3 WHERE nombre = 'Due Faccetta Mascarilla';
UPDATE productos SET marca = 'Perfect Blonder', categoria_id = 1 WHERE nombre = 'Perfect Blonder Shampoo';
UPDATE productos SET marca = 'W-One', categoria_id = 2 WHERE nombre = 'W-One Acondicionador';
UPDATE productos SET marca = 'Due Faccetta', categoria_id = 5 WHERE nombre = 'Due Faccetta Cepillo';
UPDATE productos SET marca = 'Perfect Blonder', categoria_id = 5 WHERE nombre = 'Perfect Blonder Secador';

SHOW TABLES LIKE 'ventas';
SHOW TABLES LIKE 'detalle_ventas';
-- ===============================
-- DATOS DE VENTAS DE EJEMPLO
-- ===============================
INSERT INTO ventas (fecha_venta, hora_venta, total_venta, cliente_id, cliente_nombre, cliente_email, metodo_pago, estado) VALUES 
('2024-01-15', '10:30:00', 450.00, 1, 'María González', 'maria@email.com', 'Efectivo', 'Completada'),
('2024-01-15', '14:15:00', 300.00, 2, 'Ana Rodríguez', 'ana@email.com', 'Tarjeta', 'Completada'),
('2024-01-16', '09:45:00', 550.00, 3, 'Carmen López', 'carmen@email.com', 'Transferencia', 'Completada'),
('2024-01-16', '16:20:00', 200.00, 4, 'Sofia Martínez', 'sofia@email.com', 'Efectivo', 'Completada'),
('2024-01-17', '11:00:00', 400.00, 5, 'Laura Pérez', 'laura@email.com', 'Tarjeta', 'Completada');
-- Insertar detalles de ventas
INSERT INTO detalle_ventas (venta_id, producto_id, producto_nombre, producto_marca, categoria, precio_unitario, cantidad, subtotal) VALUES
(1, 1, 'Due Faccetta Lunga Durata', 'Due Faccetta', 'Acondicionador', 269.00, 1, 269.00),
(1, 2, 'Due Faccetta Massimo', 'Due Faccetta', 'Tratamiento', 269.00, 1, 269.00),
(2, 3, 'Due Faccetta Giorno Per Giorno', 'Due Faccetta', 'Acondicionador', 269.00, 1, 269.00),
(3, 4, 'Balsami Presto Treatment', 'Due Faccetta', 'Tratamiento', 199.00, 1, 199.00),
(4, 5, 'Riccioli Leave-In Cream', 'Due Faccetta', 'Tratamiento', 229.00, 1, 229.00);

-- Insertar inventario con los IDs correctos (1-10)
INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES 
(1, 25, 5),    -- Due Faccetta Lunga Durata
(2, 20, 5),    -- Due Faccetta Massimo
(3, 30, 8),    -- Due Faccetta Giorno Per Giorno
(4, 15, 3),    -- Balsami Presto Treatment
(5, 18, 4),    -- Riccioli Leave-In Cream
(6, 22, 5),    -- Silk System Shine
(7, 12, 3),    -- Perfect Blonder 1 - Shampoo
(8, 10, 2),    -- Perfect Blonder 2 - Máscara
(9, 20, 5),    -- W-One Shampoo
(10, 25, 6);   -- W-One Acondicionador 3 en 1 HASTA ACA TERMINE

-- ===============================
-- VERIFICACIÓN FINAL
-- ===============================
SELECT 'Datos insertados exitosamente' as mensaje;
SELECT COUNT(*) as total_productos FROM productos;
SELECT COUNT(*) as total_categorias FROM categorias;
SELECT COUNT(*) as total_inventario FROM inventario;
SELECT COUNT(*) as total_ventas FROM ventas;
SELECT COUNT(*) as total_detalles FROM detalle_ventas;

-- Ver productos existentes
SELECT producto_id, nombre, marca FROM productos ORDER BY producto_id;
-- Reiniciar el AUTO_INCREMENT para que empiece en 1
ALTER TABLE productos AUTO_INCREMENT = 1;
-- Ver el siguiente ID que se generará
SHOW TABLE STATUS LIKE 'productos';
-- Reiniciar el AUTO_INCREMENT para que empiece en 1
ALTER TABLE productos AUTO_INCREMENT = 1;
-- Ver el siguiente ID que se generará
SHOW TABLE STATUS LIKE 'productos';
SELECT * FROM productos;