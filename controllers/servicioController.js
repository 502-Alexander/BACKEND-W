// Controlador para manejar las operaciones de servicios y combos
import ServicioModel from '../models/servicioModel.js';

class ServicioController {
  
  // Obtener todos los servicios
  static async obtenerServicios(req, res) {
    try {
      console.log('💇 Obteniendo servicios del salón...');
      const servicios = await ServicioModel.obtenerServicios();
      
      res.json({
        success: true,
        data: servicios,
        total: servicios.length,
        mensaje: 'Servicios obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener servicios:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener todos los combos
  static async obtenerCombos(req, res) {
    try {
      console.log('🎁 Obteniendo combos del salón...');
      const combos = await ServicioModel.obtenerCombos();
      
      res.json({
        success: true,
        data: combos,
        total: combos.length,
        mensaje: 'Combos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener combos:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener un servicio por ID
  static async obtenerServicioPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          mensaje: 'ID de servicio inválido'
        });
      }

      console.log(`🔍 Obteniendo servicio con ID: ${id}`);
      const servicio = await ServicioModel.obtenerServicioPorId(id);
      
      if (!servicio) {
        return res.status(404).json({
          success: false,
          mensaje: 'Servicio no encontrado'
        });
      }

      res.json({
        success: true,
        data: servicio,
        mensaje: 'Servicio obtenido exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener servicio:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener un combo por ID
  static async obtenerComboPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          mensaje: 'ID de combo inválido'
        });
      }

      console.log(`🔍 Obteniendo combo con ID: ${id}`);
      const combo = await ServicioModel.obtenerComboPorId(id);
      
      if (!combo) {
        return res.status(404).json({
          success: false,
          mensaje: 'Combo no encontrado'
        });
      }

      res.json({
        success: true,
        data: combo,
        mensaje: 'Combo obtenido exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener combo:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default ServicioController;
