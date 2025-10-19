import express from 'express';
const router = express.Router();
import ServicioReportesController from '../controllers/servicioReportesController.js';

// Rutas para reportes de servicios
router.get('/estadisticas-generales', ServicioReportesController.obtenerEstadisticasGenerales);
router.get('/por-servicio', ServicioReportesController.obtenerEstadisticasPorServicio);
router.get('/mensuales', ServicioReportesController.obtenerEstadisticasMensuales);
router.get('/mas-rentables', ServicioReportesController.obtenerServiciosMasRentables);
router.get('/tendencias-diarias', ServicioReportesController.obtenerTendenciasDiarias);

export default router;
