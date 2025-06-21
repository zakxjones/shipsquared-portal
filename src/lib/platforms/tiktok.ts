import { PlatformService, PlatformOrder, PlatformConfig } from './types';

export class TikTokShopService implements PlatformService {
  private config: PlatformConfig;
  private baseUrl: string;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.baseUrl = 'https://open-api.tiktokshop.com/api';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
      'shop-id': this.config.storeId || '',
    };
  }

  async getOrders(params: {
    limit?: number;
    status?: string;
    startDate?: string;
  } = {}): Promise<PlatformOrder[]> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('page_size', params.limit.toString());
    if (params.status) queryParams.append('order_status', params.status);
    if (params.startDate) queryParams.append('create_time_from', params.startDate);

    const response = await fetch(
      `${this.baseUrl}/orders/search?${queryParams.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`TikTok Shop API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOrders(data.data?.order_list || []);
  }

  async getOrder(orderId: string): Promise<PlatformOrder> {
    const response = await fetch(
      `${this.baseUrl}/orders/detail/query?order_id=${orderId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`TikTok Shop API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOrder(data.data);
  }

  private transformOrders(orders: any[]): PlatformOrder[] {
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): PlatformOrder {
    return {
      id: order.order_id,
      orderNumber: order.order_number,
      total: parseFloat(order.total_amount),
      currency: order.currency,
      status: this.mapOrderStatus(order.order_status),
      shippingAddress: order.recipient_address,
      billingAddress: order.buyer_info,
      items: order.item_list || [],
      createdAt: order.create_time,
      updatedAt: order.update_time,
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'UNPAID': 'pending',
      'AWAITING_SHIPMENT': 'processing',
      'SHIPPED': 'shipped',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled',
    };
    return statusMap[status] || status.toLowerCase();
  }
} 