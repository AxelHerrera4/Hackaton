import { useState } from 'react'
import PlantillaForm from './PlantillaForm'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'fundacion'|'kpis'|'reportes'|'plantilla'>('fundacion')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
      
      {/* Botón desplegable de formularios */}
      <div className="mb-6">
        <button
          onClick={() => setShowFormularios(!showFormularios)}
          className="btn btn-primary flex items-center gap-2"
        >
          Gestionar Formularios y Registros
          <svg
            className={`w-4 h-4 transition-transform ${showFormularios ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Menú desplegable de Formularios */}
        {showFormularios && (
          <div className="mt-3 card p-4 bg-white shadow-lg transition-all duration-200 ease-in-out transform hover:shadow-xl">
            <h3 className="font-semibold mb-3 text-gray-700">Gestión de Ejes e Indicadores:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/admin/ejes/nuevo')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-blue-50 transition-all"
              >
                <span className="text-2xl">📝</span>
                <div>
                  <div className="font-semibold">Crear Eje</div>
                  <div className="text-sm text-gray-500">Agregar nuevo eje temático</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/indicadores/nuevo')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-blue-50 transition-all"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">Crear Indicador</div>
                  <div className="text-sm text-gray-500">Agregar nuevo indicador</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/ejes')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-green-50 transition-all"
              >
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold">Ver Ejes</div>
                  <div className="text-sm text-gray-500">Lista de ejes registrados</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/indicadores')}
                className="btn btn-outline text-left flex items-center gap-3 p-4 hover:bg-green-50 transition-all"
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
        <button className={`nav-tab ${activeTab === 'fundacion' ? 'active' : ''}`} onClick={() => setActiveTab('fundacion')}>Crear Fundación</button>
        <button className={`nav-tab ${activeTab === 'kpis' ? 'active' : ''}`} onClick={() => setActiveTab('kpis')}>Gestionar KPIs</button>
        <button className={`nav-tab ${activeTab === 'reportes' ? 'active' : ''}`} onClick={() => setActiveTab('reportes')}>Reportes</button>
        <button className={`nav-tab ${activeTab === 'plantilla' ? 'active' : ''}`} onClick={() => setActiveTab('plantilla')}>Crear Plantilla</button>
      </div>

      {activeTab === 'fundacion' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Crear Nueva Fundación</h3>
          </div>
          
          <form>
            <div className="form-group">
              <label className="form-label">Nombre de la Fundación</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Fundación Ejemplo"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email de Contacto</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="contacto@fundacion.org"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre del Líder</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Juan Pérez"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email del Líder</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="lider@fundacion.org"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Crear Fundación y Usuario Líder
            </button>
          </form>
        </div>
      )}

      {activeTab === 'kpis' && (
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">KPIs Personalizados Pendientes</h3>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Fundación</th>
                  <th>KPI</th>
                  <th>Eje</th>
                  <th>Justificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fundación Esperanza</td>
                  <td>Huertos urbanos implementados</td>
                  <td>Ambiente</td>
                  <td>Medición específica para nuestro proyecto</td>
                  <td>
                    <button className="btn btn-primary btn-sm mr-2">Aprobar</button>
                    <button className="btn btn-secondary btn-sm">Rechazar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reportes' && (
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">Reportes</h3>
          </div>
          <div className="card-body">Aquí puede gestionar reportes</div>
        </div>
      )}

      {activeTab === 'plantilla' && (
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">Crear Plantilla de Reporte</h3>
          </div>

          <div className="card-body">
            <PlantillaForm />
          </div>
        </div>
      )}
    </div>
  )
}