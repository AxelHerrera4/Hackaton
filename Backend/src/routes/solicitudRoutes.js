import express from 'express';
import { SolicitudPagoController as SolicitudCtrl } from '../controllers/solicitudPagoController.js';
import { TransaccionPluxController as TransCtrl } from '../controllers/transaccionPluxController.js';

const router = express.Router();
const solicitudCtrl = new SolicitudCtrl();
const transCtrl = new TransCtrl();

// Solicitud endpoints
router.post('/', (req, res) => solicitudCtrl.crear(req, res));
router.get('/', (req, res) => solicitudCtrl.listar(req, res));
router.get('/:id', (req, res) => solicitudCtrl.obtenerPorId(req, res));
router.put('/:id', (req, res) => solicitudCtrl.actualizar(req, res));
router.delete('/:id', (req, res) => solicitudCtrl.eliminar(req, res));

// Transaccion endpoints (nested under solicitud)
router.post('/:solicitudId/transaccion', (req, res) => {
  req.body.ID_SOLICITUD = req.params.solicitudId; return transCtrl.crear(req, res);
});
router.get('/:solicitudId/transaccion', async (req, res) => {
  // list all transactions for a solicitud
  try {
    const all = await transCtrl.listar(req, res); // controller will handle response
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Separate transaccion endpoints
router.get('/transaccion', (req, res) => transCtrl.listar(req, res));
router.get('/transaccion/ref/:ref', (req, res) => transCtrl.buscarPorReferencia(req, res));
router.get('/transaccion/:id', (req, res) => transCtrl.obtenerPorId(req, res));
router.put('/transaccion/:id', (req, res) => transCtrl.actualizar(req, res));
router.delete('/transaccion/:id', (req, res) => transCtrl.eliminar(req, res));

export default router;
