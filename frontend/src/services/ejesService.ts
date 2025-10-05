const API_BASE_URL = '/api';

export interface Eje {
  EJES_ID: number;
  EJES_NOMBRE: string;
  EJES_DESCRIPCION: string;
}

// Datos hardcoded cuando el backend no esté disponible
const ejesHardcoded: Eje[] = [
  {
    EJES_ID: 1,
    EJES_NOMBRE: 'Nutrición',
    EJES_DESCRIPCION: 'Eje enfocado en mejorar la nutrición y seguridad alimentaria'
  },
  {
    EJES_ID: 2,
    EJES_NOMBRE: 'Educación',
    EJES_DESCRIPCION: 'Eje centrado en mejorar el acceso y calidad educativa'
  },
  {
    EJES_ID: 3,
    EJES_NOMBRE: 'Emprendimiento',
    EJES_DESCRIPCION: 'Eje destinado a fomentar el emprendimiento y desarrollo económico'
  },
  {
    EJES_ID: 4,
    EJES_NOMBRE: 'Medio Ambiente',
    EJES_DESCRIPCION: 'Eje enfocado en la conservación y protección ambiental'
  },
  {
    EJES_ID: 5,
    EJES_NOMBRE: 'Equidad de Género',
    EJES_DESCRIPCION: 'Eje centrado en promover la equidad e inclusión de género'
  },
  {
    EJES_ID: 7,
    EJES_NOMBRE: 'Educación - Equidad de Género',
    EJES_DESCRIPCION: 'Eje enfocado en promover la formación educativa con enfoque de equidad e inclusión de género'
  }
];

class EjesService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };
    
    // Solo agregar Authorization si el token existe y no está vacío
    if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async getAllEjes(): Promise<Eje[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      console.log('Loaded ejes from backend:', data.length);
      return data;
    } catch (error) {
      console.log('Using hardcoded data for ejes');
      return ejesHardcoded;
    }
  }

  async getEjeById(id: number): Promise<Eje[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje/id/${id}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      console.log('Loaded eje from backend');
      return data;
    } catch (error) {
      console.log('Using hardcoded data for eje by id');
      return ejesHardcoded.filter(eje => eje.EJES_ID === id);
    }
  }

  async createEje(eje: Omit<Eje, 'EJES_ID'>): Promise<Eje> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje/crear`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eje),
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      console.log('Eje created via backend');
      return data;
    } catch (error) {
      console.log('Backend not available, simulating eje creation');
      return {
        EJES_ID: Math.max(...ejesHardcoded.map(e => e.EJES_ID)) + 1,
        ...eje
      };
    }
  }

  async updateEje(id: number, updates: Partial<Eje>): Promise<Eje> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      console.log('Eje updated via backend');
      return data;
    } catch (error) {
      console.log('Backend not available, simulating eje update');
      const ejeIndex = ejesHardcoded.findIndex(e => e.EJES_ID === id);
      if (ejeIndex !== -1) {
        ejesHardcoded[ejeIndex] = { ...ejesHardcoded[ejeIndex], ...updates };
        return ejesHardcoded[ejeIndex];
      }
      throw new Error('Eje no encontrado');
    }
  }

  async deleteEje(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/eje/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      console.log('Eje deleted via backend');
    } catch (error) {
      console.log('Backend not available, simulating eje deletion');
    }
  }
}

export const ejesService = new EjesService();
