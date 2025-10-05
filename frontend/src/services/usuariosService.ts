const API_BASE_URL = '/api';

export interface UsuarioAPI {
  USUARIO_ID: number;
  USUARIO_NOMBREONG: string;
  USUARIO_USER: string;
  USUARIO_CONTRASENA: string;
  USUARI_DESCRIPCION: string;
  role?: 'admin' | 'fundacion';
}

// Datos hardcoded cuando el backend no esté disponible
const usuariosHardcoded: UsuarioAPI[] = [
  {
    USUARIO_ID: 1,
    USUARIO_NOMBREONG: 'Administrador Sistema',
    USUARIO_USER: 'admin@favorita.com',
    USUARIO_CONTRASENA: '12345678',
    USUARI_DESCRIPCION: 'Administrador del sistema',
    role: 'admin'
  },
  {
    USUARIO_ID: 2,
    USUARIO_NOMBREONG: 'Fundación Esperanza',
    USUARIO_USER: 'fundacion@esperanza.org',
    USUARIO_CONTRASENA: '12345678',
    USUARI_DESCRIPCION: 'Fundación dedicada a la educación',
    role: 'fundacion'
  },
  {
    USUARIO_ID: 3,
    USUARIO_NOMBREONG: 'Fundación Verde',
    USUARIO_USER: 'contacto@verde.org',
    USUARIO_CONTRASENA: '12345678',
    USUARI_DESCRIPCION: 'Fundación enfocada en medio ambiente',
    role: 'fundacion'
  }
];

class UsuariosService {
  async getAllUsuarios(): Promise<UsuarioAPI[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for usuarios');
      return usuariosHardcoded;
    }
  }

  async getUsuarioById(id: number): Promise<UsuarioAPI[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/id/${id}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for usuario by id');
      return usuariosHardcoded.filter(user => user.USUARIO_ID === id);
    }
  }

  async createUsuario(usuario: Omit<UsuarioAPI, 'USUARIO_ID'>): Promise<UsuarioAPI> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Backend not available, simulating usuario creation');
      return {
        USUARIO_ID: Math.max(...usuariosHardcoded.map(u => u.USUARIO_ID)) + 1,
        ...usuario
      };
    }
  }

  async loginUsuario(credentials: { user: string; password: string }): Promise<{ user: UsuarioAPI; token: string }> {
    try {
      // Intentar login con el backend (si tiene endpoint de login)
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

  async getFoundations(): Promise<{ id: number; nombre: string; descripcion: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/foundations`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      return response.json();
    } catch (error) {
      console.log('Using hardcoded data for foundations');
      return usuariosHardcoded
        .filter(user => user.role === 'fundacion')
        .map(user => ({
          id: user.USUARIO_ID,
          nombre: user.USUARIO_NOMBREONG,
          descripcion: user.USUARI_DESCRIPCION
        }));
    }
  }
}

export const usuariosService = new UsuariosService();
