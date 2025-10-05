import { EjesRepository } from '../repositories/ejeRepository.js';
import { Validaciones } from '../utils/validaciones.js';

const ejesRepo = new EjesRepository();

export class EjesService {
  
  // M├®todo para crear un eje
  async createEje(data) {
    // Validaciones obligatorias
    if (!data.EJES_NOMBRE || !data.EJES_DESCRIPCION) {
      throw new Error("El nombre y la descripci├│n son obligatorios");
    }

    if (!Validaciones.soloLetras(data.EJES_NOMBRE)) {
      throw new Error("El nombre solo puede contener letras");
    }

    if (!Validaciones.soloLetras(data.EJES_DESCRIPCION)) {
      throw new Error("La descripci├│n solo puede contener letras");
    }

    // Convertir a may├║sculas antes de guardar
    const ejeNombre = Validaciones.convertirAMayusculas(data.EJES_NOMBRE);

    const newData = {
      ...data,
      EJES_NOMBRE: ejeNombre,
    };

    // Guardar en repositorio
    const newEje = await ejesRepo.create(newData);
    return newEje;
  }

  // M├®todo para actualizar un eje
  async actualizarEje(data) {
    if (!data.EJES_ID) {
      throw new Error("El ID del eje es obligatorio");
    }

    if (!Validaciones.soloLetras(data.EJES_NOMBRE)) {
      throw new Error("El nombre solo puede contener letras");
    }

    if (!Validaciones.soloLetras(data.EJES_DESCRIPCION)) {
      throw new Error("La descripci├│n solo puede contener letras");
    }

    const ejeNombre = Validaciones.convertirAMayusculas(data.EJES_NOMBRE);

    const actualizado = await ejesRepo.actualizar({
      EJES_ID: data.EJES_ID,
      EJES_NOMBRE: ejeNombre,
      EJES_DESCRIPCION: data.EJES_DESCRIPCION
    });

    if (!actualizado) {
      throw new Error("No se encontr├│ el eje para actualizar");
    }

    return await ejesRepo.buscarPorId(data.EJES_ID);
  }

  // M├®todo para listar todos los ejes
  async obtenerTodosLosEjes() {
    return await ejesRepo.listarTodos();
  }

  // M├®todo para buscar por nombre
  async obtenerEjePorNombre(nombre) {
    return await ejesRepo.buscarPorNombre(nombre);
  }

  // M├®todo para eliminar un eje
  async eliminarEje(id) {
    return await ejesRepo.eliminar(id);
  }

  // M├®todo para buscar por ID
  async obtenerEjePorId(id) {
    return await ejesRepo.buscarPorId(id);
  }

  // M├®todos de ordenamiento (si los agregas en el repositorio)
  async obtenerEjesOrdenDesc() {
    return await ejesRepo.ordenarDescendente();
  }

  async obtenerEjesOrdenAsc() {
    return await ejesRepo.ordenarAscendente();
  }
}
