import React, { useState, useEffect } from 'react';
import { reportsService } from '../services/reportsService';

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
      let response;
      
      if (user.role === 'revisor') {
        response = filter === 'pending' 
          ? await reportsService.getPendingReports()
          : await reportsService.getReports();
      } else {
        response = await reportsService.getReports(
          user.role === 'lider' ? user.foundationId : undefined,
          filter === 'all' ? undefined : filter
        );
      }
      
      setReports(response.data || []);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reportId: number, approved: boolean, rejectionReason?: string) => {
    try {
      await reportsService.reviewReport(reportId, approved, rejectionReason);
      loadReports(); // Recargar la lista
      alert(`Reporte ${approved ? 'aprobado' : 'rechazado'} exitosamente`);
    } catch (error) {
      alert('Error al revisar el reporte');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { class: 'badge-pending', text: 'Pendiente' },
      'in_review': { class: 'badge-pending', text: 'En Revisión' },
      'approved': { class: 'badge-approved', text: 'Aprobado' },
      'rejected': { class: 'badge-rejected', text: 'Rechazado' },
      'ready_for_payment': { class: 'badge-approved', text: 'Listo para Pago' },
      'paid': { class: 'badge-approved', text: 'Pagado' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { class: 'badge-pending', text: status };
    
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (loading) {
    return <div className="text-center">Cargando reportes...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          {user.role === 'revisor' ? 'Reportes para Revisar' : 'Mis Reportes'}
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
        {user.role === 'revisor' && (
          <button 
            className={`nav-tab ${filter === 'ready_for_payment' ? 'active' : ''}`}
            onClick={() => setFilter('ready_for_payment')}
          >
            Listos para Pago
          </button>
        )}
      </div>

      {reports.length === 0 ? (
        <p className="text-center text-gray">No hay reportes para mostrar</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fundación</th>
                <th>Proyecto</th>
                <th>Período</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.foundation?.name || 'N/A'}</td>
                  <td>{report.project?.name || 'N/A'}</td>
                  <td>
                    {months[report.periodMonth - 1]} {report.periodYear}
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-primary btn-sm">
                        Ver Detalles
                      </button>
                      
                      {user.role === 'revisor' && report.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleReview(report.id, true)}
                          >
                            Aprobar
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              const reason = prompt('Motivo del rechazo:');
                              if (reason) {
                                handleReview(report.id, false, reason);
                              }
                            }}
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      
                      {user.role === 'lider' && report.status === 'pending' && (
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