import { User } from '../App'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateReport from './CreateReport'
import ReportsList from './ReportsList'
import PaymentsList from './PaymentsList'
import AdminMetrics from './AdminMetrics'
import ReportsGenerator from './ReportsGenerator'
import KPIForm from './KPIForm'
import logoImage from '../assets/images.png'

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showFormularios, setShowFormularios] = useState(false)

  const renderAdminDashboard = () => (
    <div>
      <div className="fundacion-header">
        <div className="fundacion-logo-section">
          <img 
            src={logoImage} 
            alt="Fundación Favorita" 
            className="fundacion-logo"
          />
          <div>
            <h1 className="fundacion-title">Fundación Favorita</h1>
            <p className="fundacion-subtitle">Panel de Administración - Sistema de Gestión de Reportes</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>

      {/* Botón desplegable de formularios */}
      <div className="mb-6">
        <button
          onClick={() => setShowFormularios(!showFormularios)}
          className="btn btn-primary flex items-center gap-2"
        >
          📋 Gestionar Formularios
          <svg
            className={`w-4 h-4 transition-transform ${showFormularios ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Menú desplegable */}
        {showFormularios && (
          <div className="mt-3 card p-4 bg-white shadow-lg">
            <h3 className="font-semibold mb-3 text-gray-700">Selecciona una opción:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/admin/ejes/nuevo')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-blue-50"
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-semibold">Crear Eje</div>
                  <div className="text-sm text-gray-500">Agregar nuevo eje temático</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/indicadores/nuevo')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-blue-50"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">Crear Indicador</div>
                  <div className="text-sm text-gray-500">Agregar nuevo indicador</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/ejes')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-green-50"
              >
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold">Ver Ejes</div>
                  <div className="text-sm text-gray-500">Lista de ejes registrados</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/indicadores')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-green-50"
              >
                <span className="text-2xl">📈</span>
                <div>
                  <div className="font-semibold">Ver Indicadores</div>
                  <div className="text-sm text-gray-500">Lista de indicadores registrados</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
      
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
          className={`nav-tab ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          Generador de Reportes
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

      {activeTab === 'metrics' && <AdminMetrics />}
      {activeTab === 'reports' && <ReportsList user={user} />}
      {activeTab === 'generator' && <ReportsGenerator />}
      {activeTab === 'payments' && <PaymentsList />}
    </div>
  )

  const renderLiderDashboard = () => (
    <div>
      <div className="fundacion-header">
        <div className="fundacion-logo-section">
          <img 
            src={logoImage} 
            alt="Fundación Favorita" 
            className="fundacion-logo"
          />
          <div>
            <h1 className="fundacion-title">Fundación Favorita</h1>
            <p className="fundacion-subtitle">Portal de Fundaciones - Sistema de Reportes</p>
          </div>
        </div>
      </div>
      
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
          className={`nav-tab ${activeTab === 'kpis' ? 'active' : ''}`}
          onClick={() => setActiveTab('kpis')}
        >
          Registrar KPIs
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

      {activeTab === 'kpis' && <KPIForm userId={user.id} userRole={user.role} />}
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

      {activeTab === 'payments' && <PaymentsList />}
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