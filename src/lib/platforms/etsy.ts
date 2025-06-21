import { PlatformService, PlatformOrder, PlatformConfig } from './types';

export class EtsyService implements PlatformService {
  private config: PlatformConfig;
  private baseUrl: string;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.baseUrl = 'https://api.etsy.com/v3/application';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'x-api-key': this.config.accessToken,
      'Content-Type': 'application/json',
    };
  }

  async getOrders(params: {
    limit?: number;
    status?: string;
    startDate?: string;
  } = {}): Promise<PlatformOrder[]> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('min_created', params.startDate);

    const response = await fetch(
      `${this.baseUrl}/shops/${this.config.storeId}/receipts?${queryParams.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Etsy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOrders(data.results || []);
  }

  async getOrder(orderId: string): Promise<PlatformOrder> {
    const response = await fetch(
      `${this.baseUrl}/receipts/${orderId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Etsy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOrder(data);
  }

  private transformOrders(orders: any[]): PlatformOrder[] {
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): PlatformOrder {
    return {
      id: order.receipt_id.toString(),
      orderNumber: order.receipt_id.toString(),
      total: parseFloat(order.total_price.amount),
      currency: order.total_price.currency_code,
      status: this.mapOrderStatus(order.status),
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      items: order.transactions || [],
      createdAt: order.created_timestamp,
      updatedAt: order.updated_timestamp,
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'open': 'pending',
      'completed': 'delivered',
      'cancelled': 'cancelled',
      'shipped': 'shipped',
    };
    return statusMap[status] || status.toLowerCase();
  }
} 