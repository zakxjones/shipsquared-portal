import { PlatformService, PlatformOrder, PlatformConfig } from './types';

export class EbayService implements PlatformService {
  private config: PlatformConfig;
  private baseUrl: string;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.baseUrl = 'https://api.ebay.com/sell/fulfillment/v1';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
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
    if (params.status) queryParams.append('orderStatus', params.status);
    if (params.startDate) queryParams.append('creationDateFrom', params.startDate);

    const response = await fetch(
      `${this.baseUrl}/order?${queryParams.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOrders(data.orders || []);
  }

  async getOrder(orderId: string): Promise<PlatformOrder> {
    const response = await fetch(
      `${this.baseUrl}/order/${orderId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOrder(data);
  }

  private transformOrders(orders: any[]): PlatformOrder[] {
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): PlatformOrder {
    return {
      id: order.orderId,
      orderNumber: order.orderId,
      total: parseFloat(order.pricingSummary.total.value),
      currency: order.pricingSummary.total.currency,
      status: this.mapOrderStatus(order.orderStatus),
      shippingAddress: order.fulfillmentStartInstructions?.[0]?.shippingStep?.shipTo,
      billingAddress: order.buyer.buyerRegistrationAddress,
      items: order.lineItems || [],
      createdAt: order.creationDate,
      updatedAt: order.lastModifiedDate,
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'pending',
      'IN_PROGRESS': 'processing',
      'SHIPPED': 'shipped',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled',
    };
    return statusMap[status] || status.toLowerCase();
  }
} 