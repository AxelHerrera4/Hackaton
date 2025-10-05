import { useState } from 'react'
import { plantillaService } from '../services/plantillaService'

export default function PlantillaForm() {
  const [form, setForm] = useState({
    USUARIO_ID: '',
    PLANTILLA_NOMBRE: '',
    PLANTILLA_FECHAINICIO: '',
    PLANTILLA_FECHAFIN: '',
    PLANTILLA_PERIODOSUBIRREPORTES: '',
    PLANTILLA_DESCRIPCION: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const payload = {
        ...form,
        USUARIO_ID: Number(form.USUARIO_ID)
      }
      const created = await plantillaService.createPlantilla(payload)
      setMessage('Plantilla creada con ID: ' + (created.PLANTILLA_ID ?? 'desconocido'))
      setForm({
        USUARIO_ID: '',
        PLANTILLA_NOMBRE: '',
        PLANTILLA_FECHAINICIO: '',
        PLANTILLA_FECHAFIN: '',
        PLANTILLA_PERIODOSUBIRREPORTES: '',
        PLANTILLA_DESCRIPCION: ''
      })
    } catch (err: any) {
      setMessage(err?.message || 'Error creando plantilla')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">Usuario (admin) ID</label>
        <input name="USUARIO_ID" value={form.USUARIO_ID} onChange={onChange} className="form-input" placeholder="1" />
      </div>

      <div className="form-group">
        <label className="form-label">Nombre de la Plantilla</label>
        <input name="PLANTILLA_NOMBRE" value={form.PLANTILLA_NOMBRE} onChange={onChange} className="form-input" placeholder="Plantilla Octubre" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Fecha Inicio</label>
          <input type="date" name="PLANTILLA_FECHAINICIO" value={form.PLANTILLA_FECHAINICIO} onChange={onChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Fecha Fin</label>
          <input type="date" name="PLANTILLA_FECHAFIN" value={form.PLANTILLA_FECHAFIN} onChange={onChange} className="form-input" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Periodo para subir reportes</label>
        <select name="PLANTILLA_PERIODOSUBIRREPORTES" value={form.PLANTILLA_PERIODOSUBIRREPORTES} onChange={onChange} className="form-input">
          <option value="">Seleccione...</option>
          <option value="mensual">Mensual (ej. días 1-9)</option>
          <option value="trimestral">Trimestral</option>
          <option value="1-9">1-9</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea name="PLANTILLA_DESCRIPCION" value={form.PLANTILLA_DESCRIPCION} onChange={onChange} className="form-input" />
      </div>

      <div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Plantilla'}</button>
      </div>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  )
}
