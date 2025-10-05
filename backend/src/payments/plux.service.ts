import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface PluxPaymentData {
  amount: number;
  currency: string;
  description: string;
  externalReference: string;
  callbackUrl: string;
}

interface PluxPaymentResponse {
  paymentLink: string;
  paymentId: string;
  status: string;
}

@Injectable()
export class PluxService {
  private readonly baseUrl = 'https://api.plux.ec'; // URL base de Plux
  private readonly clientId = process.env.PLUX_CLIENT_ID;
  private readonly secretKey = process.env.PLUX_SECRET_KEY;
  private readonly businessId = process.env.PLUX_BUSINESS_ID;
  private readonly ruc = process.env.PLUX_RUC;
  private readonly email = process.env.PLUX_EMAIL;

  async createPaymentLink(paymentData: PluxPaymentData): Promise<PluxPaymentResponse> {
    try {
      // Configurar headers para autenticación con Plux
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.secretKey}`,
        'X-Client-Id': this.clientId,
      };

      // Datos para crear el link de pago
      const requestData = {
        business_id: this.businessId,
        ruc: this.ruc,
        email: this.email,
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        description: paymentData.description,
        external_reference: paymentData.externalReference,
        callback_url: paymentData.callbackUrl,
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-cancel`,
        // Configuraciones adicionales
        payment_methods: ['card', 'bank_transfer'],
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      };

      // Por ahora, simular respuesta de Plux para desarrollo
      if (process.env.NODE_ENV === 'development') {
        return this.simulatePluxResponse(paymentData);
      }

      // En producción, hacer llamada real a Plux
      const response = await axios.post(`${this.baseUrl}/payments/create`, requestData, { headers });

      return {
        paymentLink: response.data.payment_link,
        paymentId: response.data.payment_id,
        status: response.data.status,
      };
    } catch (error) {
      console.error('Error creating Plux payment link:', error);
      throw new Error(`Failed to create Plux payment: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const headers = {
        'Authorization': `Bearer ${this.secretKey}`,
        'X-Client-Id': this.clientId,
      };

      if (process.env.NODE_ENV === 'development') {
        return {
          payment_id: paymentId,
          status: 'pending',
          amount: 2500,
          currency: 'USD',
        };
      }

      const response = await axios.get(`${this.baseUrl}/payments/${paymentId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error getting Plux payment status:', error);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  private simulatePluxResponse(paymentData: PluxPaymentData): PluxPaymentResponse {
    const paymentId = `PLUX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentLink = `https://plux.ec/pay/${paymentId}`;

    return {
      paymentLink,
      paymentId,
      status: 'created',
    };
  }

  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    // Implementar verificación de firma del webhook de Plux
    // Por ahora, aceptar todos los webhooks en desarrollo
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // En producción, verificar la firma usando el secret de Plux
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }
}