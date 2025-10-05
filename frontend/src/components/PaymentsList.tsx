import React, { useState, useEffect } from 'react';
import { paymentsService } from '../services/paymentsService';

interface PaymentsListProps {
  user: any;
}

export default function PaymentsList({ user }: PaymentsListProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (filter) {
        case 'pending':
          response = await paymentsService.getPendingPayments();
          break;
        case 'generated':
          response = await paymentsService.getGeneratedPayments();
          break;
        default:
          response = await paymentsService.getPayments();
      }
      
      setPayments(response.data || []);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePaymentLink = async (paymentId: number) => {
    try {
      const result = await paymentsService.generatePaymentLink(paymentId);
      alert('Link de pago generado exitosamente');
      
      // Abrir el link en una nueva ventana
      if (result.pluxPaymentLink) {
        window.open(result.pluxPaymentLink, '_blank');
      }
      
      loadPayments(); // Recargar la lista
    } catch (error) {
      alert('Error al generar el link de pago');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { class: 'badge-pending', text: 'Pendiente' },
      'link_generated': { class: 'badge-approved', text: 'Link Generado' },
      'paid': { class: 'badge-approved', text: 'Pagado' },
      'failed': { class: 'badge-rejected', text: 'Fallido' },
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
    return <div className="text-center">Cargando pagos...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Gestión de Pagos</h3>
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
          className={`nav-tab ${filter === 'generated' ? 'active' : ''}`}
          onClick={() => setFilter('generated')}
        >
          Links Generados
        </button>
      </div>

      {payments.length === 0 ? (
        <p className="text-center text-gray">No hay pagos para mostrar</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fundación</th>
                <th>Proyecto</th>
                <th>Período</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.report?.foundation?.name || 'N/A'}</td>
                  <td>{payment.report?.project?.name || 'N/A'}</td>
                  <td>
                    {payment.report ? 
                      `${months[payment.report.periodMonth - 1]} ${payment.report.periodYear}` 
                      : 'N/A'
                    }
                  </td>
                  <td>
                    ${payment.amount.toLocaleString()} {payment.currency}
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {payment.status === 'pending' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleGeneratePaymentLink(payment.id)}
                        >
                          Generar Link Plux
                        </button>
                      )}
                      
                      {payment.status === 'link_generated' && payment.pluxPaymentLink && (
                        <a 
                          href={payment.pluxPaymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Abrir Link de Pago
                        </a>
                      )}
                      
                      <button className="btn btn-secondary btn-sm">
                        Ver Detalles
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="mt-4 dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">
            {payments.filter(p => p.status === 'pending').length}
          </div>
          <div className="stat-label">Pagos Pendientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {payments.filter(p => p.status === 'link_generated').length}
          </div>
          <div className="stat-label">Links Generados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            ${payments
              .filter(p => p.status === 'paid')
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
          </div>
          <div className="stat-label">Total Pagado</div>
        </div>
      </div>
    </div>
  );
}