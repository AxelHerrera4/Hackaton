const API_BASE_URL = '/api';

export interface Eje {
  EJES_ID: number;
  EJES_NOMBRE: string;
  EJES_DESCRIPCION: string;
}

// Datos hardcoded cuando el backend no esté disponible
const ejesHardcoded: Eje[] = [
  {
    EJES_ID: 1,
    EJES_NOMBRE: 'Nutrición',
    EJES_DESCRIPCION: 'Eje enfocado en mejorar la nutrición y seguridad alimentaria'
  },
  {
    EJES_ID: 2,
    EJES_NOMBRE: 'Educación',
    EJES_DESCRIPCION: 'Eje centrado en mejorar el acceso y calidad educativa'
  },
  {
    EJES_ID: 3,
    EJES_NOMBRE: 'Emprendimiento',
    EJES_DESCRIPCION: 'Eje destinado a fomentar el emprendimiento y desarrollo económico'
  },
  {
    EJES_ID: 4,
    EJES_NOMBRE: 'Medio Ambiente',
    EJES_DESCRIPCION: 'Eje enfocado en la conservación y protección ambiental'
  },
  {
    EJES_ID: 5,
    EJES_NOMBRE: 'Equidad de Género',
    EJES_DESCRIPCION: 'Eje centrado en promover la equidad e inclusión de género'
  },
  {
    EJES_ID: 7,
    EJES_NOMBRE: 'Educación - Equidad de Género',
    EJES_DESCRIPCION: 'Eje enfocado en promover la formación educativa con enfoque de equidad e inclusión de género'
  }
];

class EjesService {
  async getAllEjes(): Promise<Eje[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for ejes');
      return ejesHardcoded;
    }
  }

  async getEjeById(id: number): Promise<Eje[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje/id/${id}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for eje by id');
      return ejesHardcoded.filter(eje => eje.EJES_ID === id);
    }
  }

  async createEje(eje: Omit<Eje, 'EJES_ID'>): Promise<Eje> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eje),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Backend not available, simulating eje creation');
      return {
        EJES_ID: Math.max(...ejesHardcoded.map(e => e.EJES_ID)) + 1,
        ...eje
      };
    }
  }
}

export const ejesService = new EjesService();
