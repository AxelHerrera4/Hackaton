const API_BASE_URL = '/api';

export interface ReporteProyecto {
  REPORTEPROYECTO_ID: number;
  USUARIO_ID: number;
  REPORTEPROYECTO_NOMBRE: string;
  REPORTEPROYECTO_FECHAINICIO: string;
  REPORTEPROYECTO_FECHAFIN: string;
  REPORTEPROYECTO_PERIODOSUBIRREPORTES: string;
  REPORTEPROYECTO_ACCIONESDESTACADAS: string;
  REPORTEPROYECTO_PRIMERHITO: string;
  REPORTEPROYECTO_SEGUNDOHITO: string;
  REPORTEPROYECTO_TERCERHITO: string;
  REPORTEPROYECTO_NOMBREHITO: string;
  REPORTEPROYECTO_LUGAR: string;
  REPORTEPROYECTO_DESCRIPCION: string;
  REPORTEPROYECTO_INDICADORLARGOPLAZO: string;
  REPORTEPROYECTO_MATERIALAUDIOVISUAL: string;
  REPORTEPROYECTO_INDICADORPREVENCION: string;
  REPORTEPROYECTO_ESTADO: string;
}

export interface KPIData {
  indicador: string;
  descripcion: string;
  valor: string;
  eje: string;
  mes: string;
  evidencias?: string[];
}

export interface Foundation {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ReportData {
  foundation?: Foundation;
  foundations?: Foundation[];
  kpis: KPIData[];
  period: string;
  totalBeneficiarios: number;
  proyectosActivos: number;
  metricasPorEje: {
    [eje: string]: {
      total: number;
      crecimiento: number;
      evidencias: number;
    };
  };
}

// Datos hardcoded cuando el backend no esté disponible
const reportesHardcoded: ReporteProyecto[] = [
  {
    REPORTEPROYECTO_ID: 1,
    USUARIO_ID: 2,
    REPORTEPROYECTO_NOMBRE: 'Programa Educativo Rural 2024',
    REPORTEPROYECTO_FECHAINICIO: '2024-01-15',
    REPORTEPROYECTO_FECHAFIN: '2024-12-15',
    REPORTEPROYECTO_PERIODOSUBIRREPORTES: 'Mensual',
    REPORTEPROYECTO_ACCIONESDESTACADAS: 'Implementación de laboratorios de ciencias en 5 escuelas rurales',
    REPORTEPROYECTO_PRIMERHITO: 'Selección de escuelas beneficiarias',
    REPORTEPROYECTO_SEGUNDOHITO: 'Capacitación de docentes',
    REPORTEPROYECTO_TERCERHITO: 'Implementación de laboratorios',
    REPORTEPROYECTO_NOMBREHITO: 'Evaluación de impacto',
    REPORTEPROYECTO_LUGAR: 'Zona rural de Pichincha',
    REPORTEPROYECTO_DESCRIPCION: 'Proyecto enfocado en mejorar la calidad educativa en zonas rurales mediante la implementación de laboratorios de ciencias',
    REPORTEPROYECTO_INDICADORLARGOPLAZO: 'Mejora en las calificaciones de ciencias en un 30%',
    REPORTEPROYECTO_MATERIALAUDIOVISUAL: 'Videos educativos, presentaciones interactivas',
    REPORTEPROYECTO_INDICADORPREVENCION: 'Reducción de la deserción escolar en un 15%',
    REPORTEPROYECTO_ESTADO: 'En ejecución'
  },
  {
    REPORTEPROYECTO_ID: 2,
    USUARIO_ID: 3,
    REPORTEPROYECTO_NOMBRE: 'Proyecto Reforestación Urbana',
    REPORTEPROYECTO_FECHAINICIO: '2024-03-01',
    REPORTEPROYECTO_FECHAFIN: '2024-11-30',
    REPORTEPROYECTO_PERIODOSUBIRREPORTES: 'Trimestral',
    REPORTEPROYECTO_ACCIONESDESTACADAS: 'Plantación de 1000 árboles en parques urbanos',
    REPORTEPROYECTO_PRIMERHITO: 'Identificación de áreas verdes',
    REPORTEPROYECTO_SEGUNDOHITO: 'Adquisición de plantas',
    REPORTEPROYECTO_TERCERHITO: 'Jornadas de plantación',
    REPORTEPROYECTO_NOMBREHITO: 'Seguimiento y cuidado',
    REPORTEPROYECTO_LUGAR: 'Parques urbanos de Quito',
    REPORTEPROYECTO_DESCRIPCION: 'Iniciativa para aumentar las áreas verdes urbanas y mejorar la calidad del aire',
    REPORTEPROYECTO_INDICADORLARGOPLAZO: 'Incremento del 20% en área verde urbana',
    REPORTEPROYECTO_MATERIALAUDIOVISUAL: 'Documentales sobre reforestación',
    REPORTEPROYECTO_INDICADORPREVENCION: 'Reducción de CO2 en 500 toneladas anuales',
    REPORTEPROYECTO_ESTADO: 'En planificación'
  }
];

class ReportesService {
  async getAllReportes(): Promise<ReporteProyecto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reporte`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for reportes');
      return reportesHardcoded;
    }
  }

  async getReporteById(id: number): Promise<ReporteProyecto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reporte/id/${id}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for reporte by id');
      return reportesHardcoded.filter(rep => rep.REPORTEPROYECTO_ID === id);
    }
  }

  async createReporte(reporte: Omit<ReporteProyecto, 'REPORTEPROYECTO_ID'>): Promise<ReporteProyecto> {
    try {
      const response = await fetch(`${API_BASE_URL}/reporte/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reporte),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Backend not available, simulating reporte creation');
      return {
        REPORTEPROYECTO_ID: Math.max(...reportesHardcoded.map(r => r.REPORTEPROYECTO_ID)) + 1,
        ...reporte
      };
    }
  }

  async updateReporte(id: number, updates: Partial<ReporteProyecto>): Promise<ReporteProyecto> {
    try {
      const response = await fetch(`${API_BASE_URL}/reporte/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Backend not available, simulating reporte update');
      const reporteIndex = reportesHardcoded.findIndex(r => r.REPORTEPROYECTO_ID === id);
      if (reporteIndex !== -1) {
        reportesHardcoded[reporteIndex] = { ...reportesHardcoded[reporteIndex], ...updates };
        return reportesHardcoded[reporteIndex];
      }
      throw new Error('Reporte no encontrado');
    }
  }

  // Nuevas funcionalidades para generación de reportes
  async getGeneralReport(period: string): Promise<ReportData> {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/general?period=${period}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for general report');
      return this.generateHardcodedGeneralReport(period);
    }
  }

  async getFoundationReport(foundationId: string, period: string): Promise<ReportData> {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/foundation/${foundationId}?period=${period}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for foundation report');
      return this.generateHardcodedFoundationReport(foundationId, period);
    }
  }

  async createMetabaseDashboard(config: any): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/metabase/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const result = await response.json();
      return result.dashboardUrl;
    } catch (error) {
      console.log('Backend not available, returning mock Metabase URL');
      return 'http://localhost:3030/dashboard/1-fundacion-favorita-general';
    }
  }

  async generateExcelReport(data: any): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/excel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.blob();
    } catch (error) {
      console.log('Backend not available, generating mock Excel file');
      return this.generateMockExcelFile(data);
    }
  }

  async generatePowerPointReport(data: any): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/powerpoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.blob();
    } catch (error) {
      console.log('Backend not available, generating mock PowerPoint file');
      return this.generateMockPowerPointFile(data);
    }
  }

  // Métodos auxiliares para datos hardcoded
  private generateHardcodedGeneralReport(period: string): ReportData {
    return {
      foundations: [
        { id: 2, nombre: 'Fundación Esperanza', descripcion: 'Fundación dedicada a la educación' },
        { id: 3, nombre: 'Fundación Verde', descripcion: 'Fundación enfocada en medio ambiente' }
      ],
      kpis: [
        {
          indicador: 'Escuelas apoyadas (#)',
          descripcion: 'Número total de escuelas que reciben apoyo del programa educativo',
          valor: '25',
          eje: 'Educación',
          mes: period,
          evidencias: [
            'https://drive.google.com/file/d/1abc123/view',
            'https://drive.google.com/file/d/1def456/view'
          ]
        },
        {
          indicador: 'Mujeres apoyadas FF (#)',
          descripcion: 'Cantidad total de mujeres beneficiadas',
          valor: '200',
          eje: 'Equidad de Género',
          mes: period,
          evidencias: [
            'https://drive.google.com/file/d/1ghi789/view'
          ]
        },
        {
          indicador: 'CO2 evitadas (tn)',
          descripcion: 'Toneladas de CO2 evitadas mediante acciones ambientales',
          valor: '12.5',
          eje: 'Medio Ambiente',
          mes: period,
          evidencias: [
            'https://drive.google.com/file/d/1jkl012/view',
            'https://drive.google.com/file/d/1mno345/view'
          ]
        }
      ],
      period,
      totalBeneficiarios: 587,
      proyectosActivos: 15,
      metricasPorEje: {
        'Educación': { total: 225, crecimiento: 15.2, evidencias: 12 },
        'Equidad de Género': { total: 200, crecimiento: 8.7, evidencias: 8 },
        'Medio Ambiente': { total: 162, crecimiento: 22.1, evidencias: 15 },
        'Nutrición': { total: 300, crecimiento: 12.4, evidencias: 10 }
      }
    };
  }

  private generateHardcodedFoundationReport(foundationId: string, period: string): ReportData {
    const foundations = {
      '2': { id: 2, nombre: 'Fundación Esperanza', descripcion: 'Fundación dedicada a la educación' },
      '3': { id: 3, nombre: 'Fundación Verde', descripcion: 'Fundación enfocada en medio ambiente' }
    };

    const foundation = foundations[foundationId as keyof typeof foundations];
    
    return {
      foundation,
      kpis: [
        {
          indicador: 'Escuelas apoyadas (#)',
          descripcion: 'Número total de escuelas que reciben apoyo',
          valor: '15',
          eje: 'Educación',
          mes: period,
          evidencias: [
            'https://drive.google.com/file/d/1abc123/view',
            'https://drive.google.com/file/d/1def456/view'
          ]
        }
      ],
      period,
      totalBeneficiarios: 287,
      proyectosActivos: 8,
      metricasPorEje: {
        'Educación': { total: 150, crecimiento: 18.5, evidencias: 8 },
        'Equidad de Género': { total: 87, crecimiento: 12.3, evidencias: 5 }
      }
    };
  }

  private async generateMockExcelFile(data: any): Promise<Blob> {
    // Generar un archivo mock Excel usando una librería como ExcelJS
    const content = `Reporte ${data.type}\nPeríodo: ${data.period}\nGenerado: ${new Date().toLocaleDateString()}`;
    return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private async generateMockPowerPointFile(data: any): Promise<Blob> {
    // Generar un archivo mock PowerPoint
    const content = `Presentación ${data.type}\nPeríodo: ${data.period}\nGenerado: ${new Date().toLocaleDateString()}`;
    return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  }
}

export const reportesService = new ReportesService();
