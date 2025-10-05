import { useState, useEffect } from 'react';
import { reportesService } from '../services/reportesService';

interface ReportsListProps {
  user: any;
}

export default function ReportsList({ user }: ReportsListProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const reportes = await reportesService.getAllReportes();
      
      // Filtrar reportes según el rol y filtro
      let filteredReports = reportes;
      
      if (user.role === 'fundacion' && user.id) {
        // Solo mostrar reportes del usuario fundación
        filteredReports = reportes.filter(r => r.USUARIO_ID === user.id);
      }
      
      if (filter !== 'all') {
        filteredReports = filteredReports.filter(r => {
          switch (filter) {
            case 'pending':
              return r.REPORTEPROYECTO_ESTADO === 'En revisión' || r.REPORTEPROYECTO_ESTADO === 'Pendiente';
            case 'approved':
              return r.REPORTEPROYECTO_ESTADO === 'Aprobado' || r.REPORTEPROYECTO_ESTADO === 'En ejecución';
            default:
              return true;
          }
        });
      }
      
      setReports(filteredReports);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reportId: number, approved: boolean) => {
    try {
      // Actualizar el estado del reporte
      const nuevoEstado = approved ? 'Aprobado' : 'Rechazado';
      await reportesService.updateReporte(reportId, { REPORTEPROYECTO_ESTADO: nuevoEstado });
      loadReports(); // Recargar la lista
      alert(`Reporte ${approved ? 'aprobado' : 'rechazado'} exitosamente`);
    } catch (error) {
      alert('Error al revisar el reporte');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'Pendiente': { class: 'badge-pending', text: 'Pendiente' },
      'En revisión': { class: 'badge-pending', text: 'En Revisión' },
      'En ejecución': { class: 'badge-approved', text: 'En Ejecución' },
      'Aprobado': { class: 'badge-approved', text: 'Aprobado' },
      'Rechazado': { class: 'badge-rejected', text: 'Rechazado' },
      'En planificación': { class: 'badge-pending', text: 'En Planificación' },
      'Completado': { class: 'badge-approved', text: 'Completado' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { class: 'badge-pending', text: status };
    
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center">Cargando reportes...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          {user.role === 'admin' ? 'Reportes para Revisar' : 'Mis Reportes'}
        </h3>
      </div>

      {/* Filtros */}
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        <button 
          className={`nav-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendientes
        </button>
        <button 
          className={`nav-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Aprobados
        </button>
      </div>

      {reports.length === 0 ? (
        <p className="text-center text-gray">No hay reportes para mostrar</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Período</th>
                <th>Estado</th>
                <th>Lugar</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.REPORTEPROYECTO_ID}>
                  <td>{report.REPORTEPROYECTO_NOMBRE || 'N/A'}</td>
                  <td>
                    {new Date(report.REPORTEPROYECTO_FECHAINICIO).toLocaleDateString()} - {new Date(report.REPORTEPROYECTO_FECHAFIN).toLocaleDateString()}
                  </td>
                  <td>{getStatusBadge(report.REPORTEPROYECTO_ESTADO)}</td>
                  <td>{report.REPORTEPROYECTO_LUGAR}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-primary btn-sm">
                        Ver Detalles
                      </button>
                      
                      {user.role === 'admin' && (report.REPORTEPROYECTO_ESTADO === 'En revisión' || report.REPORTEPROYECTO_ESTADO === 'Pendiente') && (
                        <>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleReview(report.REPORTEPROYECTO_ID, true)}
                          >
                            Aprobar
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              const reason = prompt('Motivo del rechazo:');
                              if (reason) {
                                handleReview(report.REPORTEPROYECTO_ID, false);
                              }
                            }}
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      
                      {user.role === 'fundacion' && (report.REPORTEPROYECTO_ESTADO === 'En revisión' || report.REPORTEPROYECTO_ESTADO === 'Pendiente') && (
                        <button className="btn btn-secondary btn-sm">
                          Editar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}