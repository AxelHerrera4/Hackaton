import { useState, useEffect } from 'react'
import { User } from '../App'

interface AdminMetricsProps {
  user: User;
}

interface MetricData {
  foundationName: string;
  projectName: string;
  reportPeriod: string;
  kpis: {
    name: string;
    value: number;
    target: number;
    percentage: number;
    status: 'good' | 'warning' | 'danger';
  }[];
}

interface FoundationSummary {
  id: number;
  name: string;
  totalReports: number;
  approvedReports: number;
  pendingPayments: number;
  totalAmount: number;
}

export default function AdminMetrics({ user }: AdminMetricsProps) {
  const [metricsData, setMetricsData] = useState<MetricData[]>([])
  const [foundationsSummary, setFoundationsSummary] = useState<FoundationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('2025-10')

  useEffect(() => {
    fetchMetricsData()
    fetchFoundationsSummary()
  }, [selectedPeriod])

  const fetchMetricsData = async () => {
    try {
      // Simular datos de métricas para el MVP
      const mockData: MetricData[] = [
        {
          foundationName: 'Fundación Esperanza',
          projectName: 'Programa Nutrición Infantil',
          reportPeriod: '2025-09',
          kpis: [
            {
              name: 'DCI (Desnutrición Crónica Infantil)',
              value: 12.5,
              target: 10.0,
              percentage: 125,
              status: 'danger'
            },
            {
              name: 'Alimentos entregados (kg)',
              value: 800,
              target: 1000,
              percentage: 80,
              status: 'warning'
            },
            {
              name: 'Raciones de alimentos',
              value: 400,
              target: 500,
              percentage: 80,
              status: 'warning'
            },
            {
              name: 'Beneficiarios con alimentos',
              value: 180,
              target: 200,
              percentage: 90,
              status: 'good'
            }
          ]
        },
        {
          foundationName: 'Fundación Esperanza',
          projectName: 'Educación Digital Comunitaria',
          reportPeriod: '2025-09',
          kpis: [
            {
              name: 'Escuelas apoyadas',
              value: 4,
              target: 5,
              percentage: 80,
              status: 'warning'
            },
            {
              name: 'Asistencia a la escuela (%)',
              value: 82.5,
              target: 85.0,
              percentage: 97,
              status: 'good'
            },
            {
              name: 'Capacitaciones realizadas',
              value: 15,
              target: 20,
              percentage: 75,
              status: 'warning'
            }
          ]
        }
      ]
      setMetricsData(mockData)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const fetchFoundationsSummary = async () => {
    try {
      // Simular datos de resumen de fundaciones
      const mockSummary: FoundationSummary[] = [
        {
          id: 2,
          name: 'Fundación Esperanza',
          totalReports: 4,
          approvedReports: 2,
          pendingPayments: 1,
          totalAmount: 2500
        }
      ]
      setFoundationsSummary(mockSummary)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching foundations summary:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'danger': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return 'badge-approved'
      case 'warning': return 'badge-pending'
      case 'danger': return 'badge-rejected'
      default: return 'badge-pending'
    }
  }

  if (loading) {
    return <div className="text-center py-4">Cargando métricas...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Período */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Filtros</h3>
        </div>
        <div className="p-4">
          <div className="flex gap-4 items-center">
            <label className="font-medium">Período:</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-input"
            >
              <option value="2025-10">Octubre 2025</option>
              <option value="2025-09">Septiembre 2025</option>
              <option value="2025-08">Agosto 2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resumen General */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">{foundationsSummary.length}</div>
          <div className="stat-label">Fundaciones Activas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {foundationsSummary.reduce((acc, f) => acc + f.totalReports, 0)}
          </div>
          <div className="stat-label">Total Reportes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {foundationsSummary.reduce((acc, f) => acc + f.pendingPayments, 0)}
          </div>
          <div className="stat-label">Pagos Pendientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            ${foundationsSummary.reduce((acc, f) => acc + f.totalAmount, 0).toLocaleString()}
          </div>
          <div className="stat-label">Monto Total Pendiente</div>
        </div>
      </div>

      {/* KPIs por Proyecto */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">KPIs de Cumplimiento por Proyecto</h3>
        </div>
        <div className="space-y-6 p-4">
          {metricsData.map((projectData, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-blue-600">
                  {projectData.foundationName}
                </h4>
                <p className="text-gray-600">{projectData.projectName}</p>
                <p className="text-sm text-gray-500">
                  Período: {projectData.reportPeriod}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {projectData.kpis.map((kpi, kpiIndex) => (
                  <div key={kpiIndex} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-sm">{kpi.name}</h5>
                      <span className={`badge ${getStatusBadge(kpi.status)}`}>
                        {kpi.percentage}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Actual:</span>
                        <span className={getStatusColor(kpi.status)}>
                          {kpi.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meta:</span>
                        <span>{kpi.target.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          kpi.status === 'good' ? 'bg-green-500' :
                          kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(kpi.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen por Fundación */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Resumen por Fundación</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fundación</th>
                <th>Total Reportes</th>
                <th>Reportes Aprobados</th>
                <th>Pagos Pendientes</th>
                <th>Monto Pendiente</th>
                <th>Cumplimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {foundationsSummary.map((foundation) => {
                const compliance = foundation.totalReports > 0 
                  ? Math.round((foundation.approvedReports / foundation.totalReports) * 100)
                  : 0
                
                return (
                  <tr key={foundation.id}>
                    <td className="font-medium">{foundation.name}</td>
                    <td>{foundation.totalReports}</td>
                    <td>{foundation.approvedReports}</td>
                    <td>{foundation.pendingPayments}</td>
                    <td>${foundation.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        compliance >= 80 ? 'badge-approved' :
                        compliance >= 60 ? 'badge-pending' : 'badge-rejected'
                      }`}>
                        {compliance}%
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}