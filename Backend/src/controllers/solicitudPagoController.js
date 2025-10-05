import { SolicitudPagoService as SolicitudServiceClass } from '../services/solicitudPagoServices.js';

const solicitudService = new SolicitudServiceClass();

export class SolicitudPagoController {
  async crear(req, res) {
    try {
      const nuevo = await solicitudService.createSolicitud(req.body);
      res.status(201).json(nuevo);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listar(req, res) {
    try { res.status(200).json(await solicitudService.listarTodos()); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorId(req, res) {
    try { res.status(200).json(await solicitudService.buscarPorId(req.params.id)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async actualizar(req, res) {
    try {
      const data = { ...req.body, ID_SOLICITUD: req.params.id };
      const ok = await solicitudService.actualizar(data);
      if (!ok) return res.status(404).json({ message: 'No encontrado' });
      res.status(200).json(await solicitudService.buscarPorId(req.params.id));
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async eliminar(req, res) {
    try { const ok = await solicitudService.eliminar(req.params.id); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }
}
