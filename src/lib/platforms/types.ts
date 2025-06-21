export interface PlatformOrder {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  status: string;
  shippingAddress: any;
  billingAddress: any;
  items: any[];
  createdAt: string;
  updatedAt: string;
  shippingMethod?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  trackingUrl?: string;
  customerName?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
}

export interface PlatformService {
  getOrders(params?: {
    limit?: number;
    status?: string;
    startDate?: string;
  }): Promise<PlatformOrder[]>;
  getOrder(orderId: string): Promise<PlatformOrder>;
}

export interface PlatformConfig {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  storeName?: string;
  storeId?: string;
  marketplaceId?: string;
  sellerId?: string;
} 