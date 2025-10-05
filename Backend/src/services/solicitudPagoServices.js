import { SolicitudPagoRepository as Repo } from '../repositories/solicitudPagoRepository.js';

const repo = new Repo();

export class SolicitudPagoService {
  async createSolicitud(data) {
    return await repo.create(data);
  }

  async listarTodos() {
    return await repo.listarTodos();
  }

  async buscarPorId(id) {
    return await repo.buscarPorId(id);
  }

  async actualizar(data) {
    return await repo.actualizar(data);
  }

  async eliminar(id) {
    return await repo.eliminar(id);
  }
}
