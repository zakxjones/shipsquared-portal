import { PlatformService, PlatformOrder, PlatformConfig } from './types';

export class AmazonService implements PlatformService {
  private config: PlatformConfig;
  private region: string;
  private marketplaceId: string;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.region = 'NA'; // North America
    this.marketplaceId = config.marketplaceId || 'ATVPDKIKX0DER'; // US marketplace
  }

  private getApiUrl(endpoint: string) {
    return `https://sellingpartnerapi-${this.region.toLowerCase()}.amazon.com/${endpoint}`;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'x-amz-access-token': this.config.accessToken,
      'Content-Type': 'application/json',
    };
  }

  async getOrders(params: {
    limit?: number;
    status?: string;
    startDate?: string;
  } = {}): Promise<PlatformOrder[]> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('MaxResults', params.limit.toString());
    if (params.status) queryParams.append('OrderStatus', params.status);
    if (params.startDate) queryParams.append('CreatedAfter', params.startDate);
    
    // Add FBM filter
    queryParams.append('FulfillmentChannel', 'MFN'); // MFN = Merchant Fulfilled Network (FBM)

    const response = await fetch(
      this.getApiUrl(`orders/v0/orders?${queryParams.toString()}`),
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Amazon API error: ${response.statusText}`);
    }

    const data = await response.json();
    const orders = data.Orders || [];

    // Fetch tracking information for each order
    const ordersWithTracking = await Promise.all(
      orders.map(async (order: any) => {
        if (order.OrderStatus === 'Shipped') {
          const trackingInfo = await this.getOrderTracking(order.AmazonOrderId);
          return { ...order, trackingInfo };
        }
        return order;
      })
    );

    return this.transformOrders(ordersWithTracking);
  }

  async getOrder(orderId: string): Promise<PlatformOrder> {
    const response = await fetch(
      this.getApiUrl(`orders/v0/orders/${orderId}`),
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Amazon API error: ${response.statusText}`);
    }

    const data = await response.json();
    let order = data;

    // Fetch tracking information if order is shipped
    if (order.OrderStatus === 'Shipped') {
      const trackingInfo = await this.getOrderTracking(orderId);
      order = { ...order, trackingInfo };
    }

    return this.transformOrder(order);
  }

  private async getOrderTracking(orderId: string) {
    try {
      const response = await fetch(
        this.getApiUrl(`orders/v0/orders/${orderId}/tracking`),
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Silently fail for tracking info
      return null;
    }
  }

  private transformOrders(orders: any[]): PlatformOrder[] {
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): PlatformOrder {
    const trackingInfo = order.trackingInfo?.trackingInfo || null;
    
    return {
      id: order.AmazonOrderId,
      orderNumber: order.AmazonOrderId,
      total: parseFloat(order.OrderTotal?.Amount || '0'),
      currency: order.OrderTotal?.CurrencyCode || 'USD',
      status: this.mapOrderStatus(order.OrderStatus),
      shippingAddress: order.ShippingAddress,
      billingAddress: order.BuyerInfo?.BuyerTaxInfo,
      items: order.OrderItems || [],
      createdAt: order.PurchaseDate,
      updatedAt: order.LastUpdateDate,
      shippingMethod: order.ShipmentServiceLevelCategory,
      trackingNumber: trackingInfo?.trackingNumber,
      trackingCarrier: trackingInfo?.carrier,
      trackingUrl: trackingInfo?.trackingUrl,
    };
  }

  private mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'pending',
      'Unshipped': 'processing',
      'PartiallyShipped': 'processing',
      'Shipped': 'shipped',
      'Delivered': 'delivered',
      'Canceled': 'cancelled',
    };
    return statusMap[status] || status.toLowerCase();
  }
} 