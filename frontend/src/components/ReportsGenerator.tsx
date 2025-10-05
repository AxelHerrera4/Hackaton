import { useState, useEffect } from 'react'
import { reportesService } from '../services/reportesService'
import { usuariosService } from '../services/usuariosService'
import { reportGenerator, ReportGenerationData } from '../services/reportGenerator'
import MetabaseEmbed from './MetabaseEmbed'

interface Foundation {
  id: number;
  nombre: string;
  descripcion: string;
}

interface KPIData {
  indicador: string;
  descripcion: string;
  valor: string;
  eje: string;
  mes: string;
  evidencias?: string[];
}

interface ReportData {
  foundation?: Foundation;
  foundations?: Foundation[];
  kpis: KPIData[];
  period: string;
  totalBeneficiarios: number;
  proyectosActivos: number;
  metricasPorEje?: {
    [eje: string]: {
      total: number;
      crecimiento: number;
      evidencias: number;
    };
  };
}

export default function ReportsGenerator() {
  const [foundations, setFoundations] = useState<Foundation[]>([])
  const [selectedFoundation, setSelectedFoundation] = useState<string>('')
  const [reportType, setReportType] = useState<'general' | 'foundation'>('general')
  const [period, setPeriod] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    loadFoundations()
  }, [])

  const loadFoundations = async () => {
    try {
      const data = await usuariosService.getFoundations()
      setFoundations(data)
    } catch (error) {
      console.error('Error loading foundations:', error)
    }
  }

  const generateReport = async () => {
    if (!period) {
      alert('Por favor selecciona un período')
      return
    }

    setLoading(true)
    try {
      if (reportType === 'general') {
        await generateGeneralReport()
      } else {
        await generateFoundationReport()
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error al generar el reporte')
    } finally {
      setLoading(false)
    }
  }

  const generateGeneralReport = async () => {
    // Generar reporte general de todas las fundaciones
    const reportData = await reportesService.getGeneralReport(period)
    
    // Crear dashboard en Metabase
    await createMetabaseDashboard('general', reportData)
    
    // Generar Excel
    await generateExcelReport(reportData, 'general')
    
    // Generar PowerPoint
    await generatePowerPointReport(reportData, 'general')
    
    alert('Reporte general generado exitosamente')
  }

  const generateFoundationReport = async () => {
    if (!selectedFoundation) {
      alert('Por favor selecciona una fundación')
      return
    }

    // Generar reporte específico de fundación
    const reportData = await reportesService.getFoundationReport(selectedFoundation, period)
    
    // Crear dashboard en Metabase
    await createMetabaseDashboard('foundation', reportData)
    
    // Generar Excel
    await generateExcelReport(reportData, 'foundation')
    
    // Generar PowerPoint
    await generatePowerPointReport(reportData, 'foundation')
    
    const foundationName = reportData.foundation?.nombre || 'la fundación seleccionada'
    alert(`Reporte de ${foundationName} generado exitosamente`)
  }

  const createMetabaseDashboard = async (type: string, data: any) => {
    try {
      console.log('Creando dashboard de Metabase...')
      
      // Convertir datos al formato esperado
      const generationData: ReportGenerationData = {
        type: type as 'general' | 'foundation',
        period: data.period,
        kpis: data.kpis,
        foundation: data.foundation,
        totalBeneficiarios: data.totalBeneficiarios,
        proyectosActivos: data.proyectosActivos,
        metricasPorEje: data.metricasPorEje
      }
      
      const dashboardUrl = reportGenerator.generateMetabaseDashboard(generationData)
      
      // Abrir el dashboard en una nueva ventana
      window.open(dashboardUrl, '_blank')
      
      console.log('✅ Dashboard de Metabase abierto:', dashboardUrl)
      return dashboardUrl
    } catch (error) {
      console.error('Error creando dashboard:', error)
      const fallbackUrl = 'http://localhost:3030/dashboard/1-fundacion-favorita-general'
      window.open(fallbackUrl, '_blank')
      return fallbackUrl
    }
  }

  const generateExcelReport = async (data: ReportData, type: string) => {
    try {
      console.log('Generando Excel con datos reales...')
      
      // Convertir datos al formato esperado por el generador
      const generationData: ReportGenerationData = {
        type: type as 'general' | 'foundation',
        period: data.period,
        kpis: data.kpis,
        foundation: data.foundation,
        totalBeneficiarios: data.totalBeneficiarios,
        proyectosActivos: data.proyectosActivos,
        metricasPorEje: data.metricasPorEje
      }
      
      const blob = await reportGenerator.generateExcel(generationData)
      downloadFile(blob, `reporte_${type}_${period}.xlsx`)
      
      console.log('✅ Archivo Excel generado exitosamente')
    } catch (error) {
      console.error('Error generando Excel:', error)
      alert('Error al generar el archivo Excel')
    }
  }

  const generatePowerPointReport = async (data: ReportData, type: string) => {
    try {
      console.log('Generando PowerPoint con datos reales...')
      
      // Convertir datos al formato esperado por el generador
      const generationData: ReportGenerationData = {
        type: type as 'general' | 'foundation',
        period: data.period,
        kpis: data.kpis,
        foundation: data.foundation,
        totalBeneficiarios: data.totalBeneficiarios,
        proyectosActivos: data.proyectosActivos,
        metricasPorEje: data.metricasPorEje
      }
      
      const blob = await reportGenerator.generatePowerPoint(generationData)
      downloadFile(blob, `presentacion_${type}_${period}.pptx`)
      
      console.log('✅ Presentación PowerPoint generada exitosamente')
    } catch (error) {
      console.error('Error generando PowerPoint:', error)
      alert('Error al generar la presentación PowerPoint')
    }
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const openMetabaseDashboard = () => {
    // Abrir Metabase en nueva ventana
    window.open('http://localhost:3030/dashboard', '_blank')
  }

  return (
    <div className="reports-generator">
      <div className="page-header">
        <h1>Generador de Reportes</h1>
        <p>Crea reportes detallados y dashboards interactivos con Metabase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3>Configuración del Reporte</h3>
            
            <div className="form-group">
              <label className="form-label">Tipo de Reporte</label>
              <select 
                className="form-input"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'general' | 'foundation')}
              >
                <option value="general">Reporte General</option>
                <option value="foundation">Reporte por Fundación</option>
              </select>
            </div>

            {reportType === 'foundation' && (
              <div className="form-group">
                <label className="form-label">Fundación</label>
                <select 
                  className="form-input"
                  value={selectedFoundation}
                  onChange={(e) => setSelectedFoundation(e.target.value)}
                >
                  <option value="">Seleccionar fundación</option>
                  {foundations.map(foundation => (
                    <option key={foundation.id} value={foundation.id}>
                      {foundation.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Período</label>
              <input
                type="month"
                className="form-input"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>
          </div>

          {/* Panel de Metabase */}
          <div className="card mt-4">
            <h3>Dashboard Metabase</h3>
            <p className="text-sm text-gray mb-4">
              Visualiza datos en tiempo real con dashboards interactivos
            </p>
            <button
              className="btn btn-secondary w-full"
              onClick={openMetabaseDashboard}
            >
              Abrir Metabase
            </button>
          </div>
        </div>

        {/* Panel de resultados */}
        <div className="lg:col-span-2">
          {showDashboard ? (
            <div className="card">
              <div className="card-header">
                <h3>📊 Dashboard Interactivo - Metabase</h3>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDashboard(false)}
                >
                  Ocultar Dashboard
                </button>
              </div>
              <MetabaseEmbed
                type="dashboard"
                dashboardId={reportType === 'general' ? 1 : 2}
                params={{
                  period: period,
                  foundation_id: selectedFoundation || 'all'
                }}
              />
            </div>
          ) : (
            <>
              <div className="card">
                <h3>Tipos de Reportes Disponibles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="report-type-card">
                    <div className="report-icon">📊</div>
                    <h4>Reporte General</h4>
                    <p>Dashboard completo con KPIs de todas las fundaciones</p>
                    <ul className="feature-list">
                      <li>✅ Gráficos estadísticos por eje</li>
                      <li>✅ Comparativas entre fundaciones</li>
                      <li>✅ Exportación a Excel</li>
                      <li>✅ Presentación PowerPoint</li>
                    </ul>
                  </div>

                  <div className="report-type-card">
                    <div className="report-icon">🏢</div>
                    <h4>Reporte por Fundación</h4>
                    <p>Análisis detallado de una fundación específica</p>
                    <ul className="feature-list">
                      <li>✅ KPIs detallados por mes</li>
                      <li>✅ Evidencias fotográficas</li>
                      <li>✅ Seguimiento de objetivos</li>
                      <li>✅ Dashboard personalizado</li>
                    </ul>
                  </div>
                </div>
                
                {period && (
                  <div className="mt-4">
                    <button
                      className="btn btn-info w-full"
                      onClick={() => setShowDashboard(true)}
                    >
                      🔍 Ver Dashboard Interactivo en Metabase
                    </button>
                  </div>
                )}
              </div>

              {/* Preview de métricas */}
              <div className="card mt-4">
                <h3>Vista Previa de Métricas</h3>
                <div className="metrics-preview">
                  <div className="metric-card">
                    <div className="metric-value">187</div>
                    <div className="metric-label">Total Beneficiarios</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">15</div>
                    <div className="metric-label">Proyectos Activos</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">8</div>
                    <div className="metric-label">KPIs Monitoreados</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">3</div>
                    <div className="metric-label">Fundaciones</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}