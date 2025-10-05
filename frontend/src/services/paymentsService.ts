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

export const paymentsService = {
  async createPaymentRequest(paymentData: {
    reportId: number;
    amount: number;
    currency?: string;
  }) {
    const response = await axios.post(`${API_URL}/payments`, paymentData);
    return response.data;
  },

  async getPayments(status?: string) {
    const params = status ? `?status=${status}` : '';
    const response = await axios.get(`${API_URL}/payments${params}`);
    return response;
  },

  async getPayment(id: number) {
    const response = await axios.get(`${API_URL}/payments/${id}`);
    return response.data;
  },

  async generatePaymentLink(paymentId: number) {
    const response = await axios.post(`${API_URL}/payments/${paymentId}/generate-link`);
    return response.data;
  },

  async getPendingPayments() {
    const response = await axios.get(`${API_URL}/payments/pending`);
    return response;
  },

  async getGeneratedPayments() {
    const response = await axios.get(`${API_URL}/payments/generated`);
    return response;
  }
};