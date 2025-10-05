const API_BASE_URL = '/api';

export interface Indicador {
  INDICADORES_ID: number;
  EJES_ID: number;
  INDICADORES_NOMBRE: string;
  INDICADORES_DESCRIPCION: string;
  INDICADORES_VALOR: string;
}

// Datos hardcoded cuando el backend no esté disponible
const indicadoresHardcoded: Indicador[] = [
  {
    INDICADORES_ID: 1,
    EJES_ID: 2,
    INDICADORES_NOMBRE: 'Escuelas apoyadas (#)',
    INDICADORES_DESCRIPCION: 'Número total de escuelas que reciben apoyo del programa educativo',
    INDICADORES_VALOR: '25'
  },
  {
    INDICADORES_ID: 2,
    EJES_ID: 5,
    INDICADORES_NOMBRE: 'Mujeres apoyadas FF (estudiantes) #',
    INDICADORES_DESCRIPCION: 'Cantidad de mujeres estudiantes beneficiadas con apoyo del programa de Equidad de Género',
    INDICADORES_VALOR: '150'
  },
  {
    INDICADORES_ID: 3,
    EJES_ID: 1,
    INDICADORES_NOMBRE: 'Personas con alimentos, cuidado y/o guía en nutrición (#)',
    INDICADORES_DESCRIPCION: 'Número de personas beneficiadas con apoyo alimentario, orientación o cuidado nutricional',
    INDICADORES_VALOR: '300'
  },
  {
    INDICADORES_ID: 4,
    EJES_ID: 5,
    INDICADORES_NOMBRE: 'Mujeres apoyadas FF (#)',
    INDICADORES_DESCRIPCION: 'Cantidad total de mujeres beneficiadas a través de los programas de equidad e inclusión',
    INDICADORES_VALOR: '200'
  },
  {
    INDICADORES_ID: 5,
    EJES_ID: 2,
    INDICADORES_NOMBRE: 'Estudiantes vulnerables con capacitaciones puntuales (#)',
    INDICADORES_DESCRIPCION: 'Número de estudiantes en situación vulnerable que participan en capacitaciones específicas',
    INDICADORES_VALOR: '75'
  }
];

class IndicadoresService {
  async getAllIndicadores(): Promise<Indicador[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/indicadores`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for indicadores');
      return indicadoresHardcoded;
    }
  }

  async getIndicadorById(id: number): Promise<Indicador[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/indicadores/id/${id}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for indicador by id');
      return indicadoresHardcoded.filter(ind => ind.INDICADORES_ID === id);
    }
  }

  async getIndicadoresByEje(ejeId: number): Promise<Indicador[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/indicadores/eje/${ejeId}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for indicadores by eje');
      return indicadoresHardcoded.filter(ind => ind.EJES_ID === ejeId);
    }
  }

  async createIndicador(indicador: Omit<Indicador, 'INDICADORES_ID'>): Promise<Indicador> {
    try {
      const response = await fetch(`${API_BASE_URL}/indicadores/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(indicador),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Backend not available, simulating indicador creation');
      return {
        INDICADORES_ID: Math.max(...indicadoresHardcoded.map(i => i.INDICADORES_ID)) + 1,
        ...indicador
      };
    }
  }
}

export const indicadoresService = new IndicadoresService();
