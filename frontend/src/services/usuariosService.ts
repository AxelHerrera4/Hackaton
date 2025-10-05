const API_BASE_URL = '/api';

export interface UsuarioAPI {
  USUARIO_ID: number;
  USUARIO_NOMBREONG: string;
  USUARIO_USER: string;
  USUARIO_CONTRASENA: string;
  USUARI_DESCRIPCION: string;
  USUARIO_ROLE?: 'admin' | 'fundacion' | 'ong';
}

// Datos hardcoded como fallback
const usuariosHardcoded: UsuarioAPI[] = [
  {
    USUARIO_ID: 1,
    USUARIO_NOMBREONG: 'Administrador Sistema',
    USUARIO_USER: 'admin@favorita.com',
    USUARIO_CONTRASENA: '12345678',
    USUARI_DESCRIPCION: 'Administrador del sistema',
    USUARIO_ROLE: 'admin'
  },
  {
    USUARIO_ID: 2,
    USUARIO_NOMBREONG: 'Fundación Esperanza',
    USUARIO_USER: 'fundacion@esperanza.org',
    USUARIO_CONTRASENA: '12345678',
    USUARI_DESCRIPCION: 'Fundación dedicada a la educación',
    USUARIO_ROLE: 'fundacion'
  },
  {
    USUARIO_ID: 3,
    USUARIO_NOMBREONG: 'Fundación Verde',
    USUARIO_USER: 'contacto@verde.org',
    USUARIO_CONTRASENA: '12345678',
    USUARI_DESCRIPCION: 'Fundación enfocada en medio ambiente',
    USUARIO_ROLE: 'fundacion'
  }
];

class UsuariosService {
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

  async getAllUsuarios(): Promise<UsuarioAPI[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      console.log('Loaded users from backend:', data.length);
      return data;
    } catch (error) {
      console.log('Using hardcoded data for usuarios');
      return usuariosHardcoded;
    }
  }

  async getUsuarioById(id: number): Promise<UsuarioAPI | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/id/${id}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.log('Using hardcoded data for usuario by id');
      return usuariosHardcoded.find(user => user.USUARIO_ID === id) || null;
    }
  }

  async createUsuario(usuario: Omit<UsuarioAPI, 'USUARIO_ID'>): Promise<UsuarioAPI> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/crear`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(usuario),
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      console.log('User created via backend');
      return data;
    } catch (error) {
      console.log('Backend not available, simulating usuario creation');
      return {
        USUARIO_ID: Math.max(...usuariosHardcoded.map(u => u.USUARIO_ID)) + 1,
        ...usuario
      };
    }
  }

  async updateUsuario(id: number, updates: Partial<UsuarioAPI>): Promise<UsuarioAPI> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const data = await response.json();
      console.log('User updated via backend');
      return data;
    } catch (error) {
      console.log('Backend not available, simulating usuario update');
      const userIndex = usuariosHardcoded.findIndex(u => u.USUARIO_ID === id);
      if (userIndex !== -1) {
        usuariosHardcoded[userIndex] = { ...usuariosHardcoded[userIndex], ...updates };
        return usuariosHardcoded[userIndex];
      }
      throw new Error('Usuario no encontrado');
    }
  }

  async deleteUsuario(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      console.log('User deleted via backend');
      return true;
    } catch (error) {
      console.log('Backend not available, simulating usuario deletion');
      const userIndex = usuariosHardcoded.findIndex(u => u.USUARIO_ID === id);
      if (userIndex !== -1) {
        usuariosHardcoded.splice(userIndex, 1);
        return true;
      }
      return false;
    }
  }

  async getFoundations(): Promise<{ id: number; nombre: string; descripcion: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/foundations`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        // Si no hay endpoint específico, obtener todos y filtrar
        const allUsers = await this.getAllUsuarios();
        return allUsers
          .filter(user => user.USUARIO_ROLE === 'fundacion' || user.USUARIO_ROLE === 'ong')
          .map(user => ({
            id: user.USUARIO_ID,
            nombre: user.USUARIO_NOMBREONG,
            descripcion: user.USUARI_DESCRIPCION
          }));
      }
      
      const data = await response.json();
      console.log('Loaded foundations from backend');
      return data;
    } catch (error) {
      console.log('Using hardcoded data for foundations');
      return usuariosHardcoded
        .filter(user => user.USUARIO_ROLE === 'fundacion' || user.USUARIO_ROLE === 'ong')
        .map(user => ({
          id: user.USUARIO_ID,
          nombre: user.USUARIO_NOMBREONG,
          descripcion: user.USUARI_DESCRIPCION
        }));
    }
  }

  async loginUsuario(credentials: { user: string; password: string }): Promise<{ user: UsuarioAPI; token: string }> {
    try {
      // Usar el authService en lugar de login directo
      const usuarios = await this.getAllUsuarios();
      const usuario = usuarios.find(u => u.USUARIO_USER === credentials.user && u.USUARIO_CONTRASENA === credentials.password);
      
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      return {
        user: usuario,
        token: `token-${usuario.USUARIO_ID}-${Date.now()}`
      };
    } catch (error) {
      console.log('Using hardcoded login simulation');
      const usuario = usuariosHardcoded.find(u => 
        u.USUARIO_USER === credentials.user && u.USUARIO_CONTRASENA === credentials.password
      );
      
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      return {
        user: usuario,
        token: `token-${usuario.USUARIO_ID}-${Date.now()}`
      };
    }
  }
}

export const usuariosService = new UsuariosService();
