import { useState, useEffect } from 'react'
import { indicadoresService } from '../services/indicadoresService'
interface Indicador {
  INDICADORES_ID: number;
  EJES_ID: number;
  INDICADORES_NOMBRE: string;
  INDICADORES_DESCRIPCION: string;
  INDICADORES_VALOR: string;
  eje?: {
    EJES_NOMBRE: string;
  };
}
interface KPIEntry {
  indicadorId: number;
  valor: string;
  evidencias: string[];
  mes: string;
  observaciones?: string;
}
interface KPIFormProps {
  userId: number;
  userRole: string;
}
export default function KPIForm({ userId, userRole }: KPIFormProps) {
  const [indicadores, setIndicadores] = useState<Indicador[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [kpiEntries, setKpiEntries] = useState<{ [key: number]: KPIEntry }>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    loadIndicadores()
    // Establecer el mes actual como predeterminado
    const currentMonth = new Date().toISOString().slice(0, 7)
    setSelectedMonth(currentMonth)
  }, [])
  // Cargar KPIs previamente guardados cuando cambia el mes
  useEffect(() => {
    if (selectedMonth && userId) {
      loadPreviousKPIs()
    }
  }, [selectedMonth, userId])
  const loadPreviousKPIs = async () => {
    try {
      const savedKPIs = await indicadoresService.getKPIMensual(userId, selectedMonth)
      if (savedKPIs.length > 0) {
        // Actualizar el estado con los datos guardados
        setKpiEntries(prev => {
          const updatedEntries = { ...prev }
          savedKPIs.forEach((savedKPI: any) => {
            if (updatedEntries[savedKPI.indicadorId]) {
              updatedEntries[savedKPI.indicadorId] = {
                ...updatedEntries[savedKPI.indicadorId],
                valor: savedKPI.valor || '',
                evidencias: savedKPI.evidencias || [],
                observaciones: savedKPI.observaciones || ''
              }
            }
          })
          return updatedEntries
        })
      }
    } catch (error) {
    }
  }
  const loadIndicadores = async () => {
    setLoading(true)
    try {
      const data = await indicadoresService.getAllIndicadores()
      setIndicadores(data)
      // Inicializar entradas de KPI
      const initialEntries: { [key: number]: KPIEntry } = {}
      data.forEach(indicador => {
        initialEntries[indicador.INDICADORES_ID] = {
          indicadorId: indicador.INDICADORES_ID,
          valor: '',
          evidencias: [],
          mes: selectedMonth,
          observaciones: ''
        }
      })
      setKpiEntries(initialEntries)
    } catch (error) {
      console.error('Error loading indicadores:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleValueChange = (indicadorId: number, field: keyof KPIEntry, value: any) => {
    setKpiEntries(prev => ({
      ...prev,
      [indicadorId]: {
        ...prev[indicadorId],
        [field]: value,
        mes: selectedMonth
      }
    }))
  }
  const addEvidencia = (indicadorId: number) => {
    const nuevaEvidencia = prompt('Ingresa el enlace de Google Drive:')
    if (nuevaEvidencia && nuevaEvidencia.trim()) {
      handleValueChange(indicadorId, 'evidencias', [
        ...kpiEntries[indicadorId].evidencias,
        nuevaEvidencia.trim()
      ])
    }
  }
  const removeEvidencia = (indicadorId: number, index: number) => {
    const nuevasEvidencias = kpiEntries[indicadorId].evidencias.filter((_, i) => i !== index)
    handleValueChange(indicadorId, 'evidencias', nuevasEvidencias)
  }
  const validateGoogleDriveLink = (url: string): boolean => {
    return url.includes('drive.google.com') || url.includes('docs.google.com')
  }
  const saveKPIs = async () => {
    if (!selectedMonth) {
      alert('Por favor selecciona un mes')
      return
    }
    const entriesWithValues = Object.values(kpiEntries).filter(entry => 
      entry.valor.trim() !== '' || entry.evidencias.length > 0
    )
    if (entriesWithValues.length === 0) {
      alert('Por favor completa al menos un KPI')
      return
    }
    // Validar enlaces de Google Drive
    const invalidLinks = entriesWithValues.some(entry =>
      entry.evidencias.some(evidencia => !validateGoogleDriveLink(evidencia))
    )
    if (invalidLinks) {
      alert('Todos los enlaces de evidencia deben ser de Google Drive')
      return
    }
    setSaving(true)
    try {
      // Enviar cada KPI al backend usando el servicio
      for (const entry of entriesWithValues) {
        const indicador = indicadores.find(i => i.INDICADORES_ID === entry.indicadorId)
        await indicadoresService.registrarKPIMensual({
          indicadorId: entry.indicadorId,
          valor: entry.valor,
          mes: entry.mes,
          evidencias: entry.evidencias,
          observaciones: entry.observaciones,
          usuarioId: userId,
          reporteId: 1, // Por ahora usar reporte fijo
          ejeId: indicador?.EJES_ID || 1
        })
      }
      alert(`✅ ${entriesWithValues.length} KPIs guardados exitosamente para ${selectedMonth}`)
      // Limpiar formulario para permitir nuevos registros
      setKpiEntries(prev => {
        const newEntries = { ...prev }
        Object.keys(newEntries).forEach(key => {
          newEntries[Number(key)] = {
            ...newEntries[Number(key)],
            valor: '',
            evidencias: [],
            observaciones: ''
          }
        })
        return newEntries
      })
    } catch (error) {
      console.error('❌ Error saving KPIs:', error)
      alert('Error al guardar los KPIs. Por favor intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }
  if (userRole !== 'lider' && userRole !== 'fundacion') {
    return (
      <div className="access-denied">
        <h2>Acceso Denegado</h2>
        <p>Solo los líderes de fundación pueden acceder a esta sección.</p>
      </div>
    )
  }
  return (
    <div className="kpi-form">
      <div className="page-header">
        <h1>Registro de KPIs Mensuales</h1>
        <p>Completa los indicadores de tu fundación y agrega evidencias fotográficas</p>
      </div>
      <div className="form-controls mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Mes de Reporte</label>
            <input
              type="month"
              className="form-input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              max={new Date().toISOString().slice(0, 7)}
            />
            <small className="text-gray">
              Se cargarán automáticamente los datos guardados para este mes
            </small>
          </div>
          <div className="kpi-status">
            <label className="form-label">Estado del Reporte</label>
            <div className="status-info">
              {Object.values(kpiEntries).filter(entry => entry.valor.trim() !== '').length > 0 ? (
                <span className="status-badge status-progress">
                  📝 En progreso ({Object.values(kpiEntries).filter(entry => entry.valor.trim() !== '').length}/{indicadores.length} completados)
                </span>
              ) : (
                <span className="status-badge status-pending">
                  ⏳ Pendiente de completar
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando indicadores...</p>
        </div>
      ) : (
        <div className="kpi-entries">
          {indicadores.map(indicador => (
            <div key={indicador.INDICADORES_ID} className="kpi-card">
              <div className="kpi-header">
                <h3>{indicador.INDICADORES_NOMBRE}</h3>
                <span className="eje-badge">
                  {indicador.eje?.EJES_NOMBRE || `Eje ${indicador.EJES_ID}`}
                </span>
              </div>
              <p className="kpi-description">{indicador.INDICADORES_DESCRIPCION}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Valor Alcanzado</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: 25 escuelas, 150 personas, 12.5 toneladas"
                    value={kpiEntries[indicador.INDICADORES_ID]?.valor || ''}
                    onChange={(e) => handleValueChange(indicador.INDICADORES_ID, 'valor', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Comentarios adicionales sobre este indicador"
                    value={kpiEntries[indicador.INDICADORES_ID]?.observaciones || ''}
                    onChange={(e) => handleValueChange(indicador.INDICADORES_ID, 'observaciones', e.target.value)}
                  />
                </div>
              </div>
              <div className="evidencias-section">
                <div className="evidencias-header">
                  <label className="form-label">Evidencias Fotográficas (Google Drive)</label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => addEvidencia(indicador.INDICADORES_ID)}
                  >
                    + Agregar Evidencia
                  </button>
                </div>
                <div className="evidencias-list">
                  {kpiEntries[indicador.INDICADORES_ID]?.evidencias.map((evidencia, index) => (
                    <div key={index} className="evidencia-item">
                      <div className="evidencia-content">
                        <span className="evidencia-icon">📁</span>
                        <a 
                          href={evidencia} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="evidencia-link"
                        >
                          {evidencia.length > 50 ? `${evidencia.substring(0, 47)}...` : evidencia}
                        </a>
                      </div>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeEvidencia(indicador.INDICADORES_ID, index)}
                        title="Eliminar evidencia"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {kpiEntries[indicador.INDICADORES_ID]?.evidencias.length === 0 && (
                  <div className="no-evidencias">
                    <p className="text-gray text-sm">
                      No hay evidencias agregadas. Las fotos de beneficiarios ayudan a validar el impacto.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="form-actions">
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={saveKPIs}
            disabled={saving || loading || !selectedMonth}
          >
            {saving ? '💾 Guardando...' : '💾 Guardar KPIs'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={loadPreviousKPIs}
            disabled={loading || !selectedMonth}
          >
            🔄 Recargar Datos Guardados
          </button>
          <button
            className="btn btn-info"
            onClick={() => {
              const monthName = new Date(selectedMonth + '-01').toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long' 
              })
              alert(`📊 Ver historial de KPIs para ${monthName}\n\n(Funcionalidad en desarrollo)`)
            }}
            disabled={!selectedMonth}
          >
            📊 Ver Historial
          </button>
        </div>
        <div className="save-status mt-4">
          <div className="help-text">
            <p className="text-sm text-gray">
              💡 <strong>Estado de guardado:</strong>
            </p>
            <ul className="text-sm text-gray">
              <li>• Los datos se guardan automáticamente en la base de datos</li>
              <li>• Puedes editar y guardar múltiples veces hasta el cierre del mes</li>
              <li>• Las evidencias deben ser enlaces públicos de Google Drive</li>
              <li>• {Object.values(kpiEntries).filter(entry => entry.valor.trim() !== '').length} de {indicadores.length} indicadores completados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
