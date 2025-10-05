import { useState, useEffect } from 'react';
import { reportesService } from '../services/reportesService';

interface CreateReportProps {
  user: any;
  onReportCreated?: () => void;
}

export default function CreateReport({ user, onReportCreated }: CreateReportProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    periodYear: new Date().getFullYear(),
    periodMonth: new Date().getMonth() + 1,
    data: {} as Record<string, number>,
  });
  
  const [projects, setProjects] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (formData.projectId) {
      loadIndicators();
    }
  }, [formData.projectId]);

  const loadProjects = async () => {
    try {
      // Como el reportesService maneja reportes de proyecto, usamos datos hardcoded para proyectos
      const mockProjects = [
        { id: 1, name: 'Programa Educativo Rural 2024' },
        { id: 2, name: 'Proyecto Reforestación Urbana' },
        { id: 3, name: 'Programa Nutrición Infantil' }
      ];
      setProjects(mockProjects);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Error al cargar proyectos');
      setProjects([]);
    }
  };

  const loadIndicators = async () => {
    try {
      // Usamos datos mock para indicadores basados en la nueva estructura
      const mockIndicators = [
        { id: 1, name: 'Escuelas apoyadas', description: 'Número total de escuelas que reciben apoyo', unit: 'unidades' },
        { id: 2, name: 'Estudiantes beneficiados', description: 'Cantidad de estudiantes que participan', unit: 'personas' },
        { id: 3, name: 'Capacitaciones realizadas', description: 'Número de capacitaciones ejecutadas', unit: 'eventos' }
      ];
      setIndicators(mockIndicators);
      
      // Inicializar data con los indicadores
      const initialData: Record<string, number> = {};
      mockIndicators.forEach((indicator: any) => {
        initialData[indicator.name] = 0;
      });
      setFormData(prev => ({ ...prev, data: initialData }));
    } catch (err) {
      console.error('Error loading indicators:', err);
      setError('Error al cargar indicadores');
      setIndicators([]);
    }
  };

  const handleInputChange = (indicatorName: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [indicatorName]: numericValue
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Crear un nuevo reporte usando el servicio de reportes
      const nuevoReporte = {
        USUARIO_ID: user.id || 1,
        REPORTEPROYECTO_NOMBRE: `Reporte ${months[formData.periodMonth - 1]} ${formData.periodYear}`,
        REPORTEPROYECTO_FECHAINICIO: `${formData.periodYear}-${formData.periodMonth.toString().padStart(2, '0')}-01`,
        REPORTEPROYECTO_FECHAFIN: `${formData.periodYear}-${formData.periodMonth.toString().padStart(2, '0')}-28`,
        REPORTEPROYECTO_PERIODOSUBIRREPORTES: 'Mensual',
        REPORTEPROYECTO_ACCIONESDESTACADAS: Object.entries(formData.data).map(([key, value]) => `${key}: ${value}`).join(', '),
        REPORTEPROYECTO_PRIMERHITO: 'Inicio del período',
        REPORTEPROYECTO_SEGUNDOHITO: 'Seguimiento',
        REPORTEPROYECTO_TERCERHITO: 'Cierre del período',
        REPORTEPROYECTO_NOMBREHITO: `Reporte ${months[formData.periodMonth - 1]}`,
        REPORTEPROYECTO_LUGAR: 'Nacional',
        REPORTEPROYECTO_DESCRIPCION: `Reporte mensual de actividades - ${months[formData.periodMonth - 1]} ${formData.periodYear}`,
        REPORTEPROYECTO_INDICADORLARGOPLAZO: 'Mejora sostenible',
        REPORTEPROYECTO_MATERIALAUDIOVISUAL: 'Videos y fotos del período',
        REPORTEPROYECTO_INDICADORPREVENCION: 'Monitoreo continuo',
        REPORTEPROYECTO_ESTADO: 'En revisión'
      };

      await reportesService.createReporte(nuevoReporte);

      // Reset form
      setFormData({
        projectId: '',
        periodYear: new Date().getFullYear(),
        periodMonth: new Date().getMonth() + 1,
        data: {},
      });

      if (onReportCreated) {
        onReportCreated();
      }

      alert('Reporte creado exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el reporte');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Crear Nuevo Reporte Mensual</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Proyecto</label>
          <select
            className="form-input"
            value={formData.projectId}
            onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
            required
          >
            <option value="">Seleccionar proyecto...</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Año</label>
            <input
              type="number"
              className="form-input"
              value={formData.periodYear}
              onChange={(e) => setFormData(prev => ({ ...prev, periodYear: parseInt(e.target.value) }))}
              min="2020"
              max="2030"
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Mes</label>
            <select
              className="form-input"
              value={formData.periodMonth}
              onChange={(e) => setFormData(prev => ({ ...prev, periodMonth: parseInt(e.target.value) }))}
              required
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {indicators.length > 0 && (
          <div className="form-group">
            <label className="form-label">Indicadores (KPIs)</label>
            <div className="grid grid-cols-1 gap-4">
              {indicators.map(indicator => (
                <div key={indicator.id} className="flex items-center gap-4 p-3 border rounded">
                  <div style={{ flex: 2 }}>
                    <strong>{indicator.name}</strong>
                    <p className="text-sm text-gray">{indicator.description}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      className="form-input"
                      placeholder={`Valor en ${indicator.unit || 'unidades'}`}
                      value={formData.data[indicator.name] || ''}
                      onChange={(e) => handleInputChange(indicator.name, e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="text-sm text-gray">
                    {indicator.unit || 'unidades'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red text-center mb-4">{error}</div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formData.projectId || indicators.length === 0}
          >
            {loading ? 'Creando...' : 'Crear Reporte'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                projectId: '',
                periodYear: new Date().getFullYear(),
                periodMonth: new Date().getMonth() + 1,
                data: {},
              });
              setError('');
            }}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}