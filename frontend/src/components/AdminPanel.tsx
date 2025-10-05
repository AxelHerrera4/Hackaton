import { useState } from 'react'
import PlantillaForm from './PlantillaForm'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'fundacion'|'kpis'|'reportes'|'plantilla'>('fundacion')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
      
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