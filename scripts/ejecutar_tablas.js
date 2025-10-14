// Script para ejecutar las tablas SQL necesarias para el sistema de verificación
// Este archivo ejecuta automáticamente el script SQL para crear las tablas

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true // Permite ejecutar múltiples statements
});

// Función para ejecutar el script SQL
const ejecutarScript = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Conectar a la base de datos
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

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'crear_tablas_verificacion.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Ejecutando script SQL...');

    // Ejecutar el script SQL
    await new Promise((resolve, reject) => {
      db.query(sqlContent, (err, results) => {
        if (err) {
          console.error('❌ Error al ejecutar script:', err.message);
          reject(err);
        } else {
          console.log('✅ Script ejecutado exitosamente');
          console.log('📊 Resultados:', results);
          resolve();
        }
      });
    });

    console.log('🎉 ¡Tablas creadas exitosamente!');
    console.log('📋 Tablas creadas:');
    console.log('   - usuarios (actualizada con columnas verificado y rol)');
    console.log('   - tokens_verificacion (nueva tabla)');
    console.log('   - Usuario administrador por defecto creado');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Cerrar conexión
    db.end();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar el script
ejecutarScript();
