import { useState, useEffect } from 'react'
import { reportesService } from '../services/reportesService'
import { usuariosService } from '../services/usuariosService'
import { ejesService } from '../services/ejesService'
import { indicadoresService } from '../services/indicadoresService'

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
  foundation: Foundation;
  kpis: KPIData[];
  period: string;
  totalBeneficiarios: number;
  proyectosActivos: number;
}

export default function ReportsGenerator() {
  const [foundations, setFoundations] = useState<Foundation[]>([])
  const [selectedFoundation, setSelectedFoundation] = useState<string>('')
  const [reportType, setReportType] = useState<'general' | 'foundation'>('general')
  const [period, setPeriod] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)

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
    const metabaseUrl = await createMetabaseDashboard('general', reportData)
    
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
    const metabaseUrl = await createMetabaseDashboard('foundation', reportData)
    
    // Generar Excel
    await generateExcelReport(reportData, 'foundation')
    
    // Generar PowerPoint
    await generatePowerPointReport(reportData, 'foundation')
    
    alert(`Reporte de ${reportData.foundation.nombre} generado exitosamente`)
  }

  const createMetabaseDashboard = async (type: string, data: any) => {
    // Aquí se integrará con Metabase para crear dashboards automáticamente
    const metabaseConfig = {
      url: 'http://localhost:3030', // URL de Metabase
      dashboardType: type,
      data: data,
      period: period
    }
    
    return await reportesService.createMetabaseDashboard(metabaseConfig)
  }

  const generateExcelReport = async (data: ReportData, type: string) => {
    // Generar archivo Excel con gráficos
    const excelData = {
      type,
      data,
      period,
      charts: true,
      includeEvidence: true
    }
    
    const blob = await reportesService.generateExcelReport(excelData)
    downloadFile(blob, `reporte_${type}_${period}.xlsx`)
  }

  const generatePowerPointReport = async (data: ReportData, type: string) => {
    // Generar presentación PowerPoint
    const pptData = {
      type,
      data,
      period,
      includeCharts: true,
      includeFoundationLogo: true
    }
    
    const blob = await reportesService.generatePowerPointReport(pptData)
    downloadFile(blob, `presentacion_${type}_${period}.pptx`)
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
        </div>
      </div>
    </div>
  )
}