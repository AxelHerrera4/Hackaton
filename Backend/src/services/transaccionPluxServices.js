import { TransaccionPluxRepository as Repo } from '../repositories/transaccionPluxRepository.js';

const repo = new Repo();

export class TransaccionPluxService {
  async createTransaccion(data) { return await repo.create(data); }
  async listarTodos() { return await repo.listarTodos(); }
  async buscarPorId(id) { return await repo.buscarPorId(id); }
  async buscarPorReferencia(ref) { return await repo.buscarPorReferencia(ref); }
  async actualizar(data) { return await repo.actualizar(data); }
  async eliminar(id) { return await repo.eliminar(id); }
}
