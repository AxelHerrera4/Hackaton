import express from 'express';
import { TieneController } from '../controllers/tieneControllers.js';

const router = express.Router();
const controller = new TieneController();

router.post('/crear', (req, res) => controller.crear(req, res));
router.get('/', (req, res) => controller.listar(req, res));
router.get('/reporte/:reporteId', (req, res) => controller.obtenerPorReporte(req, res));
router.delete('/eliminar/:reporteId/:ejeId', (req, res) => controller.eliminar(req, res));

export default router;
