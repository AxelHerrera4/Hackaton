// Servicio de autenticación con datos hardcoded

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    role: 'admin' | 'fundacion';
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('Using hardcoded login validation')
    
    // Usuarios hardcoded para login
    const usuariosHardcoded = [
      {
        id: 1,
        email: 'admin@favorita.com',
        password: '12345678',
        nombre: 'Administrador Sistema',
        role: 'admin' as const
      },
      {
        id: 2,
        email: 'fundacion@esperanza.org',
        password: '12345678',
        nombre: 'Fundación Esperanza',
        role: 'fundacion' as const
      },
      {
        id: 3,
        email: 'contacto@verde.org',
        password: '12345678',
        nombre: 'Fundación Verde',
        role: 'fundacion' as const
      }
    ];
    
    // Buscar usuario
    const usuario = usuariosHardcoded.find(u => u.email === email && u.password === password);
    
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }
    
    // Simular token
    const token = btoa(`${email}:${Date.now()}`);
    
    // Guardar datos en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    
    return {
      access_token: token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        role: usuario.role
      }
    };
  },

  async getProfile() {
    console.log('Using stored user data for profile')
    
    // Obtener datos del localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('No hay sesión activa');
    }
    
    return JSON.parse(userData);
  },

  async register(userData: {
    email: string;
    password: string;
    nombre: string;
    rol: 'admin' | 'fundacion';
  }) {
    console.log('Using hardcoded registration')
    
    // Simular creación de usuario
    const nuevoUsuario = {
      id: Date.now(), // ID único basado en timestamp
      email: userData.email,
      nombre: userData.nombre,
      role: userData.rol
    };
    
    return {
      message: 'Usuario creado exitosamente',
      user: nuevoUsuario
    };
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}