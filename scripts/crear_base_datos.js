// Script para crear la base de datos si no existe
// Este archivo crea la base de datos 'salon-belleza' antes de crear las tablas

const mysql = require('mysql2');
require('dotenv').config();

// Configuración de conexión sin especificar base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Función para crear la base de datos
const crearBaseDatos = async () => {
  try {
    console.log('🔄 Conectando a MySQL...');
    
    // Conectar a MySQL
    await new Promise((resolve, reject) => {
      db.connect((err) => {
        if (err) {
          console.error('❌ Error de conexión:', err.message);
          reject(err);
        } else {
          console.log('✅ Conectado a MySQL');
          resolve();
        }
      });
    });

    // Crear la base de datos si no existe
    const nombreBD = process.env.DB_NAME || 'salon-belleza';
    console.log(`🔄 Creando base de datos '${nombreBD}'...`);

    await new Promise((resolve, reject) => {
      db.query(`CREATE DATABASE IF NOT EXISTS \`${nombreBD}\``, (err, results) => {
        if (err) {
          console.error('❌ Error al crear base de datos:', err.message);
          reject(err);
        } else {
          console.log(`✅ Base de datos '${nombreBD}' creada/verificada exitosamente`);
          resolve();
        }
      });
    });

    // Crear tabla usuarios básica si no existe
    console.log('🔄 Creando tabla usuarios...');
    await new Promise((resolve, reject) => {
      const crearTablaUsuarios = `
        CREATE TABLE IF NOT EXISTS \`${nombreBD}\`.usuarios (
          id_usuario INT PRIMARY KEY AUTO_INCREMENT,
          nombre VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          contrasena VARCHAR(255) NOT NULL,
          fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.query(crearTablaUsuarios, (err, results) => {
        if (err) {
          console.error('❌ Error al crear tabla usuarios:', err.message);
          reject(err);
        } else {
          console.log('✅ Tabla usuarios creada/verificada');
          resolve();
        }
      });
    });

    console.log('🎉 ¡Base de datos configurada exitosamente!');
    console.log('📋 Próximo paso: Ejecutar node scripts/ejecutar_tablas.js');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Cerrar conexión
    db.end();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar el script
crearBaseDatos();
