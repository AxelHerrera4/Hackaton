import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Configurar axios para incluir el token automáticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reportsService = {
  async createReport(reportData: {
    projectId: number;
    foundationId: number;
    periodYear: number;
    periodMonth: number;
    data: Record<string, number>;
  }) {
    const response = await axios.post(`${API_URL}/reports`, reportData);
    return response.data;
  },

  async getReports(foundationId?: number, status?: string) {
    const params = new URLSearchParams();
    if (foundationId) params.append('foundationId', foundationId.toString());
    if (status) params.append('status', status);
    
    const response = await axios.get(`${API_URL}/reports?${params.toString()}`);
    return response;
  },

  async getReport(id: number) {
    const response = await axios.get(`${API_URL}/reports/${id}`);
    return response.data;
  },

  async updateReport(id: number, data: any) {
    const response = await axios.patch(`${API_URL}/reports/${id}`, data);
    return response.data;
  },

  async reviewReport(id: number, approved: boolean, rejectionReason?: string) {
    const response = await axios.post(`${API_URL}/reports/${id}/review`, {
      approved,
      rejectionReason
    });
    return response.data;
  },

  async getPendingReports() {
    const response = await axios.get(`${API_URL}/reports/pending`);
    return response;
  },

  async getApprovedReports() {
    const response = await axios.get(`${API_URL}/reports/approved`);
    return response;
  },

  async getProjects() {
    const response = await axios.get(`${API_URL}/projects`);
    return response;
  },

  async getIndicators() {
    const response = await axios.get(`${API_URL}/indicators/approved`);
    return response;
  }
};