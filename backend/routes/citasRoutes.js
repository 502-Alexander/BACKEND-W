import express from 'express';
const router = express.Router();
import citaController from '../controllers/citaController.js';

// Rutas para citas
router.post('/', citaController.crearCita);
router.get('/', citaController.obtenerCitas);
router.get('/estadisticas', citaController.obtenerEstadisticas);
router.get('/fecha/:fecha', citaController.obtenerCitasPorFecha);
router.get('/:id', citaController.obtenerCitaPorId);
router.put('/:id', citaController.actualizarCita);
router.delete('/:id', citaController.eliminarCita);

export default router;
