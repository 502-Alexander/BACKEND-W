// Script para verificar el estado actual de las tablas
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const verificarTablas = async () => {
  try {
    console.log('🔄 Conectando a MySQL...');
    
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

    // Verificar estructura de la tabla usuarios
    console.log('🔄 Verificando tabla usuarios...');
    await new Promise((resolve, reject) => {
      db.query('DESCRIBE usuarios', (err, results) => {
        if (err) {
          console.error('❌ Error al verificar tabla usuarios:', err.message);
          reject(err);
        } else {
          console.log('📋 Estructura actual de la tabla usuarios:');
          results.forEach(col => {
            console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
          });
          resolve();
        }
      });
    });

    // Verificar si existe la tabla tokens_verificacion
    console.log('🔄 Verificando tabla tokens_verificacion...');
    await new Promise((resolve, reject) => {
      db.query("SHOW TABLES LIKE 'tokens_verificacion'", (err, results) => {
        if (err) {
          console.error('❌ Error al verificar tabla tokens_verificacion:', err.message);
          reject(err);
        } else {
          if (results.length > 0) {
            console.log('✅ Tabla tokens_verificacion existe');
            // Mostrar estructura
            db.query('DESCRIBE tokens_verificacion', (err, results) => {
              if (err) {
                console.error('❌ Error al describir tabla tokens_verificacion:', err.message);
              } else {
                console.log('📋 Estructura de la tabla tokens_verificacion:');
                results.forEach(col => {
                  console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
                });
              }
              resolve();
            });
          } else {
            console.log('❌ Tabla tokens_verificacion NO existe');
            resolve();
          }
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    db.end();
    console.log('🔌 Conexión cerrada');
  }
};

verificarTablas();
