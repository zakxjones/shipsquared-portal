import { PlatformService, PlatformOrder, PlatformConfig } from './types';

export class ShopifyService implements PlatformService {
  private config: PlatformConfig;
  private baseUrl: string;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.baseUrl = `https://${config.storeName}/admin/api/2024-01`;
  }

  private getHeaders() {
    return {
      'X-Shopify-Access-Token': this.config.accessToken,
      'Content-Type': 'application/json',
    };
  }

  async getOrders(params: {
    limit?: number;
    status?: string;
    startDate?: string;
  } = {}): Promise<PlatformOrder[]> {
    return this.getOrdersGraphQL(params);
  }

  private async getOrdersGraphQL(params: {
    limit?: number;
    status?: string;
    startDate?: string;
  } = {}): Promise<PlatformOrder[]> {
    const limit = params.limit || 50;
    let filters = [];
    if (params.status) filters.push(`displayFinancialStatus:${params.status}`);
    if (params.startDate) filters.push(`created_at:>='${params.startDate}'`);
    const filterString = filters.length > 0 ? `query: \"${filters.join(' ')}\"` : '';

    const query = `{
      orders(first: ${limit}, reverse: true${filterString ? ', ' + filterString : ''}) {
        edges {
          node {
            id
            name
            createdAt
            totalPriceSet { shopMoney { amount currencyCode } }
            displayFinancialStatus
            displayFulfillmentStatus
            customer { firstName lastName }
            shippingAddress { name }
            billingAddress { name }
          }
        }
      }
    }`;

    const response = await fetch(`https://${this.config.storeName}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': this.config.accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify GraphQL API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const orders = data.data.orders.edges.map((edge: any) => edge.node);
    return orders.map((order: any) => {
      const customerName =
        order.shippingAddress?.name ||
        order.billingAddress?.name ||
        `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();
      return {
        id: order.id,
        orderNumber: order.name,
        total: parseFloat(order.totalPriceSet.shopMoney.amount),
        currency: order.totalPriceSet.shopMoney.currencyCode,
        status: this.mapOrderStatus(order.displayFinancialStatus),
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        items: [],
        shippingMethod: undefined,
        createdAt: order.createdAt,
        updatedAt: order.createdAt,
        customerName: customerName,
        paymentStatus: order.displayFinancialStatus,
        fulfillmentStatus: order.displayFulfillmentStatus,
      };
    });
  }

  async getOrder(orderId: string): Promise<PlatformOrder> {
    const response = await fetch(
      `${this.baseUrl}/orders/${orderId}.json`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOrder(data.order);
  }

  private transformOrders(orders: any[]): PlatformOrder[] {
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): PlatformOrder {
    return {
      id: order.id.toString(),
      orderNumber: order.order_number ? order.order_number.toString() : order.id.toString(),
      total: parseFloat(order.total_price),
      currency: order.currency,
      status: this.mapOrderStatus(order.financial_status),
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      items: order.line_items,
      shippingMethod: order.shipping_lines[0]?.title,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      customerName:
        order.shipping_address?.name ||
        order.billing_address?.name ||
        (order.customer ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() : ''),
      paymentStatus: order.financial_status,
      fulfillmentStatus: order.fulfillment_status,
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'pending',
      'authorized': 'processing',
      'partially_paid': 'processing',
      'paid': 'processing',
      'partially_refunded': 'processing',
      'refunded': 'cancelled',
      'voided': 'cancelled',
    };
    return statusMap[status] || status.toLowerCase();
  }

  async getFulfillments(orderId: string): Promise<any[]> {
    const response = await fetch(
      `https://${this.config.storeName}/admin/api/2024-01/orders/${orderId.replace('gid://shopify/Order/', '')}/fulfillments.json`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch fulfillments');
    const data = await response.json();
    return data.fulfillments || [];
  }
} 