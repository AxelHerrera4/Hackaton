export default function AdminPanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
      
      <div className="nav-tabs">
        <button className="nav-tab active">Crear Fundación</button>
        <button className="nav-tab">Gestionar KPIs</button>
        <button className="nav-tab">Reportes</button>
      </div>

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
    </div>
  )
}