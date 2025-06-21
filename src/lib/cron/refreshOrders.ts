import { prisma } from '../prisma';
import { ShopifyService } from '../platforms/shopify';
import { AmazonService } from '../platforms/amazon';
import { EbayService } from '../platforms/ebay';
import { EtsyService } from '../platforms/etsy';
import { TikTokShopService } from '../platforms/tiktok';

const platformServices = {
  shopify: ShopifyService,
  amazon: AmazonService,
  ebay: EbayService,
  etsy: EtsyService,
  tiktok: TikTokShopService,
};

export async function refreshOrders() {
  try {
    // Get all active platform connections
    const connections = await prisma.platformConnection.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    // Process each connection
    for (const connection of connections) {
      try {
        const ServiceClass = platformServices[connection.platform as keyof typeof platformServices];
        if (!ServiceClass) continue;

        const service = new ServiceClass(connection);
        const orders = await service.getOrders({ limit: 100 });

        // Update or create orders
        for (const order of orders) {
          await prisma.order.upsert({
            where: {
              platform_platformOrderId: {
                platform: connection.platform,
                platformOrderId: order.id,
              },
            },
            update: {
              status: order.status,
              total: order.total,
              currency: order.currency,
              shippingAddress: order.shippingAddress,
              billingAddress: order.billingAddress,
              items: order.items,
              shippingMethod: order.shippingMethod,
              trackingNumber: order.trackingNumber,
              trackingCarrier: order.trackingCarrier,
              trackingUrl: order.trackingUrl,
              updatedAt: new Date(),
            },
            create: {
              userId: connection.userId,
              platformConnectionId: connection.id,
              platformOrderId: order.id,
              orderNumber: order.orderNumber,
              platform: connection.platform,
              status: order.status,
              total: order.total,
              currency: order.currency,
              shippingAddress: order.shippingAddress,
              billingAddress: order.billingAddress,
              items: order.items,
              shippingMethod: order.shippingMethod,
              trackingNumber: order.trackingNumber,
              trackingCarrier: order.trackingCarrier,
              trackingUrl: order.trackingUrl,
            },
          });
        }
      } catch (error) {
        console.error(`Error refreshing orders for ${connection.platform}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in refreshOrders job:', error);
  }
} 