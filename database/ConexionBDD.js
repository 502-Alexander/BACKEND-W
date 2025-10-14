// backend/config/database.js
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

console.log('🔄 Intentando conectar a MySQL...');
console.log('📍 Host:', process.env.DB_HOST);
console.log('👤 Usuario:', process.env.DB_USER);
console.log('🗄️ Base de datos:', process.env.DB_NAME);
console.log('🔢 Puerto:', process.env.DB_PORT);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // 👈 importante
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000 // 10 segundos
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:');
    console.error('   Código:', err.code);
    console.error('   Mensaje:', err.message);
    console.error('   Host:', process.env.DB_HOST);
  } else {
    console.log('✅ Conectado a MySQL correctamente');
  }
});

export default db;
