import { ReporteRepository } from '../repositories/reporteRepository.js';
import { Validaciones } from '../utils/validaciones.js';

const reporteRepo = new ReporteRepository();

export class ReporteService {
  async createReporte(data) {
    if (!data.USUARIO_ID || !data.REPORTEPROYECTO_NOMBRE) {
      throw new Error('USUARIO_ID y nombre del reporte son obligatorios');
    }

    const newData = {
      ...data,
      REPORTEPROYECTO_NOMBRE: Validaciones.convertirAMayusculas(data.REPORTEPROYECTO_NOMBRE)
    };

    return await reporteRepo.create(newData);
  }

  async listarTodos() { return await reporteRepo.listarTodos(); }
  async buscarPorId(id) { return await reporteRepo.buscarPorId(id); }
  async eliminar(id) { return await reporteRepo.eliminar(id); }
  async actualizar(data) { return await reporteRepo.actualizar(data); }
}
