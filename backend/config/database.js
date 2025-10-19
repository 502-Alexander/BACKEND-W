import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Crear pool de conexiones para mejor manejo
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  // Configuración SSL
  ssl: false,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
});

// Función para probar la conexión
async function testConnection() {
  try {
    console.log("🔄 Intentando conectar a MySQL...");
    console.log("📍 Host:", process.env.DB_HOST);
    console.log("👤 Usuario:", process.env.DB_USER);
    console.log("🗄️ Base de datos:", process.env.DB_NAME);
    
    const connection = await db.getConnection();
    console.log("✅ Conectado a MySQL con éxito");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Error conectando a MySQL:");
    console.error("   Código:", error.code);
    console.error("   Mensaje:", error.message);
    console.error("   Host:", process.env.DB_HOST);
    return false;
  }
}

// Probar conexión al cargar el módulo
testConnection();

export { db, testConnection };
