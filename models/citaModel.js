import db from '../database/ConexionBDD.js';

const Cita = {
  // Crear nueva cita
  crear: async (cita) => {
    try {
      const query = `
        INSERT INTO citas (
          nombre_cliente, apellidos_cliente, telefono, correo, direccion,
          fecha_cita, hora_cita, servicio_id, servicio_nombre, combo_id, combo_nombre,
          tiene_tratamiento_quimico, tipo_tratamiento, largo_pelo, desea_combo,
          tipo_cliente, estado, observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        cita.nombre_cliente,
        cita.apellidos_cliente,
        cita.telefono,
        cita.correo,
        cita.direccion,
        cita.fecha_cita,
        cita.hora_cita,
        cita.servicio_id,
        cita.servicio_nombre,
        cita.combo_id,
        cita.combo_nombre,
        cita.tiene_tratamiento_quimico,
        cita.tipo_tratamiento,
        cita.largo_pelo,
        cita.desea_combo,
        cita.tipo_cliente,
        cita.estado,
        cita.observaciones
      ];
      
      const [result] = await db.query(query, values);
      return result;
    } catch (err) {
      console.error('❌ Error en Cita.crear:', err);
      throw err;
    }
  },

  // Obtener todas las citas
  obtenerTodas: async () => {
    try {
      const query = `
        SELECT 
          id_cita, nombre_cliente, apellidos_cliente, telefono, correo, direccion,
          fecha_cita, hora_cita, servicio_id, servicio_nombre, combo_id, combo_nombre,
          tiene_tratamiento_quimico, tipo_tratamiento, largo_pelo, desea_combo,
          tipo_cliente, estado, observaciones, fecha_registro, fecha_modificacion
        FROM citas 
        WHERE estado != 'Eliminada'
        ORDER BY fecha_cita DESC, hora_cita DESC
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (err) {
      console.error('❌ Error en Cita.obtenerTodas:', err);
      throw err;
    }
  },

  // Obtener cita por ID
  obtenerPorId: async (id) => {
    try {
      const query = 'SELECT * FROM citas WHERE id_cita = ? AND estado != ?';
      const [rows] = await db.query(query, [id, 'Eliminada']);
      return rows[0] || null;
    } catch (err) {
      console.error('❌ Error en Cita.obtenerPorId:', err);
      throw err;
    }
  },

  // Obtener citas por fecha
  obtenerPorFecha: async (fecha) => {
    try {
      const query = `
        SELECT * FROM citas 
        WHERE fecha_cita = ? AND estado != 'Eliminada'
        ORDER BY hora_cita ASC
      `;
      const [rows] = await db.query(query, [fecha]);
      return rows;
    } catch (err) {
      console.error('❌ Error en Cita.obtenerPorFecha:', err);
      throw err;
    }
  },

  // Obtener citas por estado
  obtenerPorEstado: async (estado) => {
    try {
      const query = 'SELECT * FROM citas WHERE estado = ? ORDER BY fecha_cita DESC';
      const [rows] = await db.query(query, [estado]);
      return rows;
    } catch (err) {
      console.error('❌ Error en Cita.obtenerPorEstado:', err);
      throw err;
    }
  },

  // Actualizar cita
  actualizar: async (id, cita) => {
    try {
      const query = `
        UPDATE citas SET 
          nombre_cliente = ?, apellidos_cliente = ?, telefono = ?, correo = ?, 
          direccion = ?, fecha_cita = ?, hora_cita = ?, servicio_id = ?, 
          servicio_nombre = ?, combo_id = ?, combo_nombre = ?,
          tiene_tratamiento_quimico = ?, tipo_tratamiento = ?, largo_pelo = ?, 
          desea_combo = ?, tipo_cliente = ?, estado = ?, observaciones = ?,
          fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_cita = ?
      `;
      
      const values = [
        cita.nombre_cliente,
        cita.apellidos_cliente,
        cita.telefono,
        cita.correo,
        cita.direccion,
        cita.fecha_cita,
        cita.hora_cita,
        cita.servicio_id,
        cita.servicio_nombre,
        cita.combo_id,
        cita.combo_nombre,
        cita.tiene_tratamiento_quimico,
        cita.tipo_tratamiento,
        cita.largo_pelo,
        cita.desea_combo,
        cita.tipo_cliente,
        cita.estado,
        cita.observaciones,
        id
      ];
      
      const [result] = await db.query(query, values);
      return result;
    } catch (err) {
      console.error('❌ Error en Cita.actualizar:', err);
      throw err;
    }
  },

  // Eliminar cita (borrado lógico)
  eliminar: async (id) => {
    try {
      const query = 'UPDATE citas SET estado = ?, fecha_modificacion = CURRENT_TIMESTAMP WHERE id_cita = ?';
      const [result] = await db.query(query, ['Eliminada', id]);
      return result;
    } catch (err) {
      console.error('❌ Error en Cita.eliminar:', err);
      throw err;
    }
  },

  // Obtener estadísticas de citas
  obtenerEstadisticas: async () => {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_citas,
          COUNT(CASE WHEN estado = 'Confirmada' THEN 1 END) as citas_confirmadas,
          COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as citas_pendientes,
          COUNT(CASE WHEN estado = 'Cancelada' THEN 1 END) as citas_canceladas,
          COUNT(CASE WHEN estado = 'Completada' THEN 1 END) as citas_completadas,
          COUNT(CASE WHEN tipo_cliente = 'Frecuente' THEN 1 END) as clientes_frecuentes,
          COUNT(CASE WHEN tipo_cliente = 'Nuevo' THEN 1 END) as clientes_nuevos
        FROM citas 
        WHERE estado != 'Eliminada'
      `;
      const [rows] = await db.query(query);
      return rows[0];
    } catch (err) {
      console.error('❌ Error en Cita.obtenerEstadisticas:', err);
      throw err;
    }
  },

  // Obtener citas por rango de fechas
  obtenerPorRango: async (fechaInicio, fechaFin) => {
    try {
      const query = `
        SELECT * FROM citas 
        WHERE fecha_cita BETWEEN ? AND ? AND estado != 'Eliminada'
        ORDER BY fecha_cita ASC, hora_cita ASC
      `;
      const [rows] = await db.query(query, [fechaInicio, fechaFin]);
      return rows;
    } catch (err) {
      console.error('❌ Error en Cita.obtenerPorRango:', err);
      throw err;
    }
  },

  // Verificar disponibilidad de horario
  verificarDisponibilidad: async (fecha, hora) => {
    try {
      const query = `
        SELECT COUNT(*) as ocupado 
        FROM citas 
        WHERE fecha_cita = ? AND hora_cita = ? AND estado IN ('Pendiente', 'Confirmada')
      `;
      const [rows] = await db.query(query, [fecha, hora]);
      return rows[0];
    } catch (err) {
      console.error('❌ Error en Cita.verificarDisponibilidad:', err);
      throw err;
    }
  }
};

export default Cita;
