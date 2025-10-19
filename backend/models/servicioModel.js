// Modelo para manejar operaciones de servicios y combos en MySQL
// Usando la estructura existente del salón Sandra Fajardo
import db from '../database/ConexionBDD.js';

class ServicioModel {
  
  // Obtener todos los servicios
  static async obtenerServicios() {
    try {
      const query = `
        SELECT 
          servicio_id as id,
          nombre,
          descripcion,
          precio_base as precio
        FROM servicios
        ORDER BY nombre ASC
      `;
      
      const [rows] = await db.query(query);
      console.log('✅ Servicios obtenidos de la BD:', rows.length);
      
      const servicios = rows.map(row => ({
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio)
      }));
      
      return servicios;
    } catch (err) {
      console.error('❌ Error al obtener servicios:', err);
      throw err;
    }
  }

  // Obtener todos los combos
  static async obtenerCombos() {
    try {
      const query = `
        SELECT 
          combo_id as id,
          nombre,
          descripcion,
          precio_combo as precio
        FROM combos
        ORDER BY nombre ASC
      `;
      
      const [rows] = await db.query(query);
      console.log('✅ Combos obtenidos de la BD:', rows.length);
      
      const combos = rows.map(row => ({
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio)
      }));
      
      return combos;
    } catch (err) {
      console.error('❌ Error al obtener combos:', err);
      throw err;
    }
  }

  // Obtener un servicio por ID
  static async obtenerServicioPorId(id) {
    try {
      const query = `
        SELECT 
          servicio_id as id,
          nombre,
          descripcion,
          precio_base as precio
        FROM servicios
        WHERE servicio_id = ?
      `;
      
      const [rows] = await db.query(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio)
      };
    } catch (err) {
      console.error('❌ Error al obtener servicio por ID:', err);
      throw err;
    }
  }

  // Obtener un combo por ID
  static async obtenerComboPorId(id) {
    try {
      const query = `
        SELECT 
          combo_id as id,
          nombre,
          descripcion,
          precio_combo as precio
        FROM combos
        WHERE combo_id = ?
      `;
      
      const [rows] = await db.query(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio)
      };
    } catch (err) {
      console.error('❌ Error al obtener combo por ID:', err);
      throw err;
    }
  }
}

export default ServicioModel;
