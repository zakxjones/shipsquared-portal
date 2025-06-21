import { PlatformConnection } from '@prisma/client';

interface ShopifyOrder {
  id: number;
  order_number: string;
  total_price: string;
  currency: string;
  shipping_address: any;
  billing_address: any;
  line_items: any[];
  shipping_lines: any[];
  created_at: string;
  updated_at: string;
}

export class ShopifyService {
  private accessToken: string;
  private shopName: string;

  constructor(connection: PlatformConnection) {
    this.accessToken = connection.accessToken;
    this.shopName = connection.storeName || '';
  }

  private getApiUrl(endpoint: string) {
    return `https://${this.shopName}/admin/api/2024-01/${endpoint}`;
  }

  private getHeaders() {
    return {
      'X-Shopify-Access-Token': this.accessToken,
      'Content-Type': 'application/json',
    };
  }

  async getOrders(params: {
    limit?: number;
    status?: string;
    created_at_min?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.created_at_min) queryParams.append('created_at_min', params.created_at_min);

    const response = await fetch(
      this.getApiUrl(`orders.json?${queryParams.toString()}`),
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.orders as ShopifyOrder[];
  }

  async getOrder(orderId: string) {
    const response = await fetch(
      this.getApiUrl(`orders/${orderId}.json`),
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.order as ShopifyOrder;
  }
} 