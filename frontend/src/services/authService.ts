import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

// Configurar axios para incluir el token automáticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    foundationId?: number;
    foundation?: {
      id: number;
      name: string;
    };
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password })
    return response.data
  },

  async getProfile() {
    const response = await axios.get(`${API_URL}/auth/profile`)
    return response.data
  },

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    foundationId?: number;
  }) {
    const response = await axios.post(`${API_URL}/auth/register`, userData)
    return response.data
  }
}