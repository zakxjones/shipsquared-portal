import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { ShopifyService } from '@/lib/platforms/shopify';
import { AmazonService } from '@/lib/platforms/amazon';
import { EbayService } from '@/lib/platforms/ebay';
import { EtsyService } from '@/lib/platforms/etsy';
import { TikTokShopService } from '@/lib/platforms/tiktok';
import { mapOrderForApi } from '@/lib/mapOrderForApi';

const platformServices = {
  shopify: ShopifyService,
  amazon: AmazonService,
  ebay: EbayService,
  etsy: EtsyService,
  tiktok: TikTokShopService,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '50', 10);
    const allowedPerPage = [50, 100, 500];
    const finalPerPage = allowedPerPage.includes(perPage) ? perPage : 50;
    const startDateParam = searchParams.get('startDate');
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        platformConnections: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch new orders from connected platforms (only for recent orders)
    const platformOrders = await Promise.all(
      user.platformConnections.map(async (connection) => {
        try {
          const ServiceClass = platformServices[connection.platform as keyof typeof platformServices];
          if (!ServiceClass) {
            console.log(`No service found for platform: ${connection.platform}`);
            return [];
          }

          // Map PlatformConnection to PlatformConfig
          const config = {
            accessToken: connection.accessToken,
            refreshToken: connection.refreshToken || undefined,
            expiresAt: connection.expiresAt || undefined,
            storeName: connection.storeName || undefined,
          };

          const service = new ServiceClass(config);
          // Only fetch orders from the last 30 days (or startDate)
          const orders = await service.getOrders({ limit: 100, startDate: startDate.toISOString() });

          // Transform and store new orders
          const newOrders = await Promise.all(
            orders.map(async (order) => {
              try {
                // Check if order already exists using the correct unique constraint
                const existingOrder = await prisma.order.findFirst({
                  where: {
                    platform: connection.platform,
                    platformOrderId: order.id,
                  },
                });

                if (!existingOrder) {
                  return await prisma.order.create({
                    data: {
                      userId: user.id,
                      platformConnectionId: connection.id,
                      platformOrderId: order.id,
                      orderNumber: order.orderNumber,
                      platform: connection.platform,
                      status: order.status,
                      total: order.total,
                      currency: order.currency,
                      createdAt: order.createdAt,
                      shippingAddress: order.shippingAddress || {},
                      billingAddress: order.billingAddress || {},
                      items: order.items || [],
                    },
                  });
                }
                // Attach fulfillmentStatus from platform order to existing DB order
                return existingOrder;
              } catch (orderError) {
                console.error(`Error processing order ${order.id}:`, orderError);
              }
            })
          );
          return newOrders;
        } catch (platformError) {
          console.error(`Error fetching orders from platform: ${connection.platform}`, platformError);
          return [];
        }
      })
    );

    // Query all orders for this user from the DB, filtered by startDate, and include shipments
    const where = {
      userId: user.id,
      createdAt: {
        gte: startDate,
      },
    };
    const total = await prisma.order.count({ where });
    const orders = await prisma.order.findMany({
      where,
      orderBy: { orderNumber: 'desc' },
      skip: (page - 1) * finalPerPage,
      take: finalPerPage,
    });

    // Map orders for frontend
    const mappedOrders = orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName || order.shippingAddress?.name || order.billingAddress?.name || '',
      total: order.total,
      currency: order.currency,
      status: order.status,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({
      orders: mappedOrders,
      page,
      perPage: finalPerPage,
      total,
      totalPages: Math.ceil(total / finalPerPage),
      startDate: startDate.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}