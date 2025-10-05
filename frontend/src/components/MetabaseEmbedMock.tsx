import { useEffect, useState } from 'react'
import '../styles/metabase-mock.css'

interface MetabaseEmbedProps {
  dashboardId?: number;
  questionId?: number;
  type: 'dashboard' | 'question';
  params?: Record<string, any>;
}

export default function MetabaseEmbedMock({ dashboardId, params = {} }: MetabaseEmbedProps) {
  const [mockData, setMockData] = useState<any>(null)

  useEffect(() => {
    // Simular datos de dashboard
    const mockDashboardData: { [key: number]: any } = {
      1: { // Dashboard general
        title: "Dashboard General - Todas las Fundaciones",
        charts: [
          { type: "bar", title: "Beneficiarios por Fundación", data: [120, 87, 95] },
          { type: "line", title: "Crecimiento Mensual", data: [10, 15, 8, 12, 20] },
          { type: "pie", title: "Distribución por Eje", data: { "Educación": 45, "Salud": 30, "Medio Ambiente": 25 } }
        ]
      },
      2: { // Dashboard fundación específica
        title: `Dashboard - ${params.foundation_id || 'Fundación Específica'}`,
        charts: [
          { type: "metric", title: "Total Beneficiarios", value: 187 },
          { type: "metric", title: "Proyectos Activos", value: 15 },
          { type: "bar", title: "KPIs por Mes", data: [8, 12, 10, 15, 18] }
        ]
      }
    }
    
    setMockData(mockDashboardData[dashboardId || 1])
  }, [dashboardId, params])

  if (!mockData) {
    return (
      <div className="metabase-placeholder">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando dashboard simulado...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="metabase-mock">
      <div className="dashboard-header">
        <h3>📊 {mockData.title}</h3>
        <span className="badge">DEMO MODE</span>
      </div>
      
      <div className="charts-grid">
        {mockData.charts.map((chart: any, index: number) => (
          <div key={index} className="chart-card">
            <h4>{chart.title}</h4>
            
            {chart.type === 'metric' && (
              <div className="metric-display">
                <div className="metric-value">{chart.value}</div>
                <div className="metric-label">{chart.title}</div>
              </div>
            )}
            
            {chart.type === 'bar' && (
              <div className="bar-chart-mock">
                {chart.data.map((value: number, i: number) => (
                  <div key={i} className="bar" style={{height: `${value * 2}px`}}>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {chart.type === 'line' && (
              <div className="line-chart-mock">
                <svg width="300" height="150">
                  <polyline
                    points={chart.data.map((val: number, i: number) => `${i * 60},${150 - val * 5}`).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}
            
            {chart.type === 'pie' && (
              <div className="pie-chart-mock">
                {Object.entries(chart.data).map(([key, value]: [string, any]) => (
                  <div key={key} className="pie-segment">
                    <span className="segment-label">{key}</span>
                    <span className="segment-value">{value}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="dashboard-footer">
        <p className="text-sm text-gray">
          🔧 Modo simulación - Para dashboards reales, configura Metabase
          <button 
            className="btn btn-link btn-sm ml-2"
            onClick={() => window.open('http://localhost:3030', '_blank')}
          >
            Abrir Metabase Real
          </button>
        </p>
      </div>
    </div>
  )
}