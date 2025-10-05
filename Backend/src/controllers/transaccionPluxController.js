import { TransaccionPluxService as TransServiceClass } from '../services/transaccionPluxServices.js';

const transService = new TransServiceClass();

export class TransaccionPluxController {
  async crear(req, res) {
    try { const nuevo = await transService.createTransaccion(req.body); res.status(201).json(nuevo); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listar(req, res) {
    try { res.status(200).json(await transService.listarTodos()); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorId(req, res) {
    try { res.status(200).json(await transService.buscarPorId(req.params.id)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async buscarPorReferencia(req, res) {
    try { res.status(200).json(await transService.buscarPorReferencia(req.params.ref)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async actualizar(req, res) {
    try { const data = { ...req.body, ID_TRANSACCION: req.params.id }; const ok = await transService.actualizar(data); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json(await transService.buscarPorId(req.params.id)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async eliminar(req, res) {
    try { const ok = await transService.eliminar(req.params.id); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }
}
