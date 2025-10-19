// Instrucciones para la conexión a la base de datos MySQL
import { db } from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

// Exportar la conexión para compatibilidad
export default db;
