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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user: email,
          password: password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      
      const loginResponse: LoginResponse = {
        access_token: data.token,
        user: {
          id: data.user?.id || 1,
          email: data.user?.email || email,
          nombre: data.user?.nombre || 'Usuario',
          role: data.user?.role || 'admin'
        }
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.user));
      
      return loginResponse;
    } catch (error) {
      throw error;
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token');
      }

      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No hay sesión activa');
      }
      
      return JSON.parse(userData);
    } catch (error) {
      throw new Error('No hay sesión activa');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
