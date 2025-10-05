const API_BASE_URL = '/api'

export interface PlantillaPayload {
  USUARIO_ID: number;
  PLANTILLA_NOMBRE: string;
  PLANTILLA_FECHAINICIO: string;
  PLANTILLA_FECHAFIN: string;
  PLANTILLA_PERIODOSUBIRREPORTES: string;
  PLANTILLA_DESCRIPCION?: string;
}

export interface PlantillaResponse extends PlantillaPayload {
  PLANTILLA_ID?: number;
}

class PlantillaService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    const headers: { [k: string]: string } = { 'Content-Type': 'application/json' }
    if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  async createPlantilla(payload: PlantillaPayload): Promise<PlantillaResponse> {
    const response = await fetch(`${API_BASE_URL}/plantilla/crear`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error creating plantilla' }))
      throw new Error(err.message || 'Error creating plantilla')
    }

    return response.json()
  }
}

export const plantillaService = new PlantillaService()
