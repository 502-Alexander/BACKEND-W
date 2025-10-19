import Cita from '../models/citaModel.js';

// Crear nueva cita
const crearCita = async (req, res) => {
  try {
    console.log('📅 Creando nueva cita...');
    console.log('📦 Datos recibidos:', req.body);

    const {
      nombre_cliente,
      apellidos_cliente,
      telefono,
      correo,
      direccion,
      fecha_cita,
      hora_cita,
      servicio_id,
      servicio_nombre,
      combo_id,
      combo_nombre,
      tiene_tratamiento_quimico,
      tipo_tratamiento,
      largo_pelo,
      desea_combo,
      tipo_cliente,
      observaciones,
      foto_cliente
    } = req.body;

    // Validar datos requeridos
    if (!nombre_cliente || !apellidos_cliente || !telefono || !correo || !fecha_cita || !hora_cita) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: nombre, apellidos, teléfono, correo, fecha y hora son obligatorios'
      });
    }

    // Verificar disponibilidad del horario (temporalmente deshabilitado para testing)
    console.log('🔍 Verificando disponibilidad para:', fecha_cita, hora_cita);
    
    // Comentar temporalmente la verificación de disponibilidad
    /*
    Cita.verificarDisponibilidad(fecha_cita, hora_cita, (err, result) => {
      if (err) {
        console.error('❌ Error verificando disponibilidad:', err);
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }

      if (result[0].ocupado > 0) {
        return res.status(409).json({
          success: false,
          error: 'El horario seleccionado ya está ocupado'
        });
      }
    */

    // Crear la cita directamente (sin verificación de disponibilidad por ahora)
    const nuevaCita = {
      nombre_cliente,
      apellidos_cliente,
      telefono,
      correo,
      direccion: direccion || '',
      fecha_cita,
      hora_cita,
      servicio_id: servicio_id || null,
      servicio_nombre: servicio_nombre || '',
      combo_id: combo_id || null,
      combo_nombre: combo_nombre || '',
      tiene_tratamiento_quimico: tiene_tratamiento_quimico || 0,
      tipo_tratamiento: tipo_tratamiento || '',
      largo_pelo: largo_pelo || '',
      desea_combo: desea_combo || 0,
      tipo_cliente: tipo_cliente || 'Nuevo',
      estado: 'Pendiente',
      observaciones: observaciones || '',
      foto_cliente: foto_cliente || null
    };

    console.log('📝 Creando cita con datos:', nuevaCita);

    try {
      const result = await Cita.crear(nuevaCita);
      console.log('✅ Cita creada exitosamente:', result.insertId);
      res.status(201).json({
        success: true,
        message: 'Cita creada exitosamente',
        data: {
          cita_id: result.insertId,
          ...nuevaCita
        }
      });
    } catch (err) {
      console.error('❌ Error creando cita:', err);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }

  } catch (error) {
    console.error('❌ Error en crearCita:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener todas las citas
const obtenerCitas = async (req, res) => {
  try {
    console.log('📅 Obteniendo todas las citas...');

    const results = await Cita.obtenerTodas();
    console.log(`✅ ${results.length} citas obtenidas`);
    res.json({
      success: true,
      data: results,
      total: results.length
    });

  } catch (error) {
    console.error('❌ Error en obtenerCitas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener cita por ID
const obtenerCitaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📅 Obteniendo cita ID: ${id}`);

    const result = await Cita.obtenerPorId(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    console.log('✅ Cita obtenida exitosamente');
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Error en obtenerCitaPorId:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar cita
const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📅 Actualizando cita ID: ${id}`);

    const existingCita = await Cita.obtenerPorId(id);
    if (!existingCita) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    const result = await Cita.actualizar(id, req.body);
    console.log('✅ Cita actualizada exitosamente');
    res.json({
      success: true,
      message: 'Cita actualizada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en actualizarCita:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar cita (borrado lógico)
const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📅 Eliminando cita ID: ${id}`);

    const result = await Cita.eliminar(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    console.log('✅ Cita eliminada exitosamente');
    res.json({
      success: true,
      message: 'Cita eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en eliminarCita:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de citas
const obtenerEstadisticas = async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de citas...');

    const results = await Cita.obtenerEstadisticas();
    console.log('✅ Estadísticas obtenidas exitosamente');
    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('❌ Error en obtenerEstadisticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener citas por fecha
const obtenerCitasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    console.log(`📅 Obteniendo citas para la fecha: ${fecha}`);

    const results = await Cita.obtenerPorFecha(fecha);
    console.log(`✅ ${results.length} citas obtenidas para ${fecha}`);
    res.json({
      success: true,
      data: results,
      total: results.length
    });

  } catch (error) {
    console.error('❌ Error en obtenerCitasPorFecha:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};


export default {
  crearCita,
  obtenerCitas,
  obtenerCitaPorId,
  actualizarCita,
  eliminarCita,
  obtenerEstadisticas,
  obtenerCitasPorFecha
};
