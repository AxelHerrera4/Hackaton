const API_BASE_URL = 'http://localhost:3001/api';
export interface Indicador {
  INDICADORES_ID: number;
  EJES_ID: number;
  INDICADORES_NOMBRE: string;
  INDICADORES_DESCRIPCION: string;
  INDICADORES_VALOR: string;
  eje?: {
    EJES_ID: number;
    EJES_NOMBRE: string;
    EJES_DESCRIPCION: string;
  };
}
// Datos hardcoded cuando el backend no esté disponible
const indicadoresHardcoded: Indicador[] = [
  {
    INDICADORES_ID: 1,
    EJES_ID: 2,
    INDICADORES_NOMBRE: 'Escuelas apoyadas (#)',
    INDICADORES_DESCRIPCION: 'Número total de escuelas que reciben apoyo del programa educativo',
    INDICADORES_VALOR: '25',
    eje: {
      EJES_ID: 2,
      EJES_NOMBRE: 'Educación',
      EJES_DESCRIPCION: 'Eje centrado en mejorar el acceso y calidad educativa'
    }
  },
  {
    INDICADORES_ID: 2,
    EJES_ID: 5,
    INDICADORES_NOMBRE: 'Mujeres apoyadas FF (estudiantes) #',
    INDICADORES_DESCRIPCION: 'Cantidad de mujeres estudiantes beneficiadas con apoyo del programa de Equidad de Género',
    INDICADORES_VALOR: '150',
    eje: {
      EJES_ID: 5,
      EJES_NOMBRE: 'Equidad de Género',
      EJES_DESCRIPCION: 'Eje centrado en promover la equidad e inclusión de género'
    }
  },
  {
    INDICADORES_ID: 3,
    EJES_ID: 1,
    INDICADORES_NOMBRE: 'Personas con alimentos, cuidado y/o guía en nutrición (#)',
    INDICADORES_DESCRIPCION: 'Número de personas beneficiadas con apoyo alimentario, orientación o cuidado nutricional',
    INDICADORES_VALOR: '300',
    eje: {
      EJES_ID: 1,
      EJES_NOMBRE: 'Nutrición',
      EJES_DESCRIPCION: 'Eje enfocado en mejorar la nutrición y seguridad alimentaria'
    }
  },
  {
    INDICADORES_ID: 4,
    EJES_ID: 5,
    INDICADORES_NOMBRE: 'Mujeres apoyadas FF (#)',
    INDICADORES_DESCRIPCION: 'Cantidad total de mujeres beneficiadas a través de los programas de equidad e inclusión',
    INDICADORES_VALOR: '200',
    eje: {
      EJES_ID: 5,
      EJES_NOMBRE: 'Equidad de Género',
      EJES_DESCRIPCION: 'Eje centrado en promover la equidad e inclusión de género'
    }
  },
  {
    INDICADORES_ID: 5,
    EJES_ID: 2,
    INDICADORES_NOMBRE: 'Estudiantes vulnerables con capacitaciones puntuales (#)',
    INDICADORES_DESCRIPCION: 'Número de estudiantes en situación vulnerable que participan en capacitaciones específicas',
    INDICADORES_VALOR: '75',
    eje: {
      EJES_ID: 2,
      EJES_NOMBRE: 'Educación',
      EJES_DESCRIPCION: 'Eje centrado en mejorar el acceso y calidad educativa'
    }
  },
  {
    INDICADORES_ID: 6,
    EJES_ID: 3,
    INDICADORES_NOMBRE: 'Emprendimientos apoyados (#)',
    INDICADORES_DESCRIPCION: 'Número de emprendimientos que reciben apoyo y mentoría',
    INDICADORES_VALOR: '45',
    eje: {
      EJES_ID: 3,
      EJES_NOMBRE: 'Emprendimiento',
      EJES_DESCRIPCION: 'Eje destinado a fomentar el emprendimiento y desarrollo económico'
    }
  },
  {
    INDICADORES_ID: 7,
    EJES_ID: 4,
    INDICADORES_NOMBRE: 'Iniciativas ambientales (#)',
    INDICADORES_DESCRIPCION: 'Número de proyectos enfocados en la conservación ambiental',
    INDICADORES_VALOR: '15',
    eje: {
      EJES_ID: 4,
      EJES_NOMBRE: 'Medio Ambiente',
      EJES_DESCRIPCION: 'Eje enfocado en la conservación y protección ambiental'
    }
  },
  {
    INDICADORES_ID: 8,
    EJES_ID: 8,
    INDICADORES_NOMBRE: 'Capacitaciones económicas (#)',
    INDICADORES_DESCRIPCION: 'Número de capacitaciones en temas de desarrollo económico',
    INDICADORES_VALOR: '30',
    eje: {
      EJES_ID: 8,
      EJES_NOMBRE: 'Economía',
      EJES_DESCRIPCION: 'Eje enfocado en fortalecer las capacidades económicas de las comunidades'
    }
  }
];
class IndicadoresService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };
    
    if (!token) {
      console.error('⚠️ No hay token de autenticación');
      throw new Error('No hay token de autenticación. Por favor inicie sesión nuevamente.');
    }

    if (token.trim() === '' || token === 'null' || token === 'undefined') {
      console.error('⚠️ Token inválido');
      localStorage.removeItem('token'); // Limpiar token inválido
      throw new Error('Token de autenticación inválido. Por favor inicie sesión nuevamente.');
    }

    headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }
  async getAllIndicadores(): Promise<Indicador[]> {
    // Usando datos hardcoded temporalmente
    console.log('📥 Usando datos hardcoded de indicadores');
    return Promise.resolve(indicadoresHardcoded);
  }
  async getIndicadorById(id: number): Promise<Indicador[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/indicadores/id/${id}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return indicadoresHardcoded.filter(ind => ind.INDICADORES_ID === id);
    }
  }
  async getIndicadoresByEje(ejeId: number): Promise<Indicador[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/indicadores/eje/${ejeId}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        // Si no hay endpoint específico, filtrar todos los indicadores
        const allIndicadores = await this.getAllIndicadores();
        return allIndicadores.filter(ind => ind.EJES_ID === ejeId);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return indicadoresHardcoded.filter(ind => ind.EJES_ID === ejeId);
    }
  }
  async createIndicador(indicador: Omit<Indicador, 'INDICADORES_ID'>): Promise<Indicador> {
    try {
      const response = await fetch(`${API_BASE_URL}/indicadores/crear`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(indicador),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        INDICADORES_ID: Math.max(...indicadoresHardcoded.map(i => i.INDICADORES_ID)) + 1,
        ...indicador
      };
    }
  }
  // Método para registrar valores de KPI mensuales
  async registrarKPIMensual(data: {
    indicadorId: number;
    valor: string;
    mes: string;
    evidencias: string[];
    observaciones?: string;
    usuarioId: number;
    reporteId?: number;
    ejeId: number;
  }): Promise<any> {
    try {
      // Usar el endpoint correcto del backend: /respuesta/crear
      const response = await fetch(`${API_BASE_URL}/respuesta/crear`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          REPORTEPROYECTO_ID: data.reporteId || 1, // Usar reporte activo
          EJES_ID: data.ejeId,
          INDICADORES_ID: data.indicadorId,
          RESPUESTA_VALOR: data.valor
          // Note: evidencias y observaciones podrían necesitar otro endpoint
        }),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: true,
        message: 'KPI registrado exitosamente (simulado)',
        data: {
          id: Date.now(),
          ...data,
          fecha_registro: new Date().toISOString()
        }
      };
    }
  }
  async getKPIMensual(usuarioId: number, mes: string, reporteId: number = 1): Promise<any[]> {
    try {
      // Usar el endpoint correcto: /respuesta/reporte/:reporteId con parámetros de consulta
      const params = new URLSearchParams({
        usuario: usuarioId.toString(),
        mes: mes
      });
      const response = await fetch(`${API_BASE_URL}/respuesta/reporte/${reporteId}?${params}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const data = await response.json();
      return data;
      return data;
    } catch (error) {
      return [];
    }
  }
}
export const indicadoresService = new IndicadoresService();
