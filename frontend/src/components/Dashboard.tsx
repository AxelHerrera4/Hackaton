import { User } from '../App'
import { useState } from 'react'
import CreateReport from './CreateReport'
import ReportsList from './ReportsList'
import PaymentsList from './PaymentsList'
import AdminMetrics from './AdminMetrics'

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const renderAdminDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>
      
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Resumen
        </button>
        <button 
          className={`nav-tab ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          KPIs y Métricas
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reportes
        </button>
        <button 
          className={`nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Pagos
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Fundaciones Registradas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">45</div>
              <div className="stat-label">Reportes Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">$25,000</div>
              <div className="stat-label">Pagos Pendientes</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Fundaciones Recientes</h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Eje Principal</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fundación Esperanza</td>
                    <td>contacto@fundacionesperanza.org</td>
                    <td>Nutrición</td>
                    <td><span className="badge badge-approved">Activa</span></td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveTab('metrics')}
                      >
                        Ver KPIs
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'metrics' && <AdminMetrics user={user} />}
      {activeTab === 'reports' && <ReportsList user={user} />}
      {activeTab === 'payments' && <PaymentsList user={user} />}
    </div>
  )

  const renderLiderDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Panel de {user.foundation?.name || 'Fundación'}
      </h2>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Resumen
        </button>
        <button 
          className={`nav-tab ${activeTab === 'create-report' ? 'active' : ''}`}
          onClick={() => setActiveTab('create-report')}
        >
          Crear Reporte
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Mis Reportes
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-number">3</div>
              <div className="stat-label">Proyectos Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2</div>
              <div className="stat-label">Reportes Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">KPIs Configurados</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Próximos Reportes</h3>
            </div>
            <p className="text-gray">
              Debes subir el reporte de octubre antes del 5 de noviembre.
            </p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => setActiveTab('create-report')}
            >
              Subir Reporte Mensual
            </button>
          </div>
        </>
      )}

      {activeTab === 'create-report' && (
        <CreateReport 
          user={user} 
          onReportCreated={() => setActiveTab('reports')}
        />
      )}

      {activeTab === 'reports' && <ReportsList user={user} />}
    </div>
  )

  const renderRevisorDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel de Revisión</h2>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Resumen
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reportes para Revisar
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-number">15</div>
              <div className="stat-label">Reportes Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">KPIs por Aprobar</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Reportes Urgentes</h3>
            </div>
            <p className="text-gray">
              Hay 3 reportes que requieren revisión urgente.
            </p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => setActiveTab('reports')}
            >
              Revisar Reportes
            </button>
          </div>
        </>
      )}

      {activeTab === 'reports' && <ReportsList user={user} />}
    </div>
  )

  const renderTesoreriaDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel de Tesorería</h2>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Resumen
        </button>
        <button 
          className={`nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Gestión de Pagos
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-number">$45,000</div>
              <div className="stat-label">Pagos Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Links de Pago Generados</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Pagos Urgentes</h3>
            </div>
            <p className="text-gray">
              Hay 5 reportes aprobados listos para generar pagos.
            </p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => setActiveTab('payments')}
            >
              Gestionar Pagos
            </button>
          </div>
        </>
      )}

      {activeTab === 'payments' && <PaymentsList user={user} />}
    </div>
  )

  return (
    <div>
      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'lider' && renderLiderDashboard()}
      {user.role === 'revisor' && renderRevisorDashboard()}
      {user.role === 'tesoreria' && renderTesoreriaDashboard()}
    </div>
  )
}