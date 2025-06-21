import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const startDate = searchParams.get('dateRange.start');
    const endDate = searchParams.get('dateRange.end');

    const where: any = {};
    if (user.role !== 'admin') {
      where.userId = user.id;
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [shipments, total] = await Promise.all([
      prisma.inboundShipment.findMany({
        where,
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.inboundShipment.count({ where }),
    ]);

    return NextResponse.json({
      shipments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const formData = await req.formData();
  const shipperType = formData.get('type') as string;
  const origin = formData.get('origin') as string;

  let shipmentData: any = {
    userId: user.id,
    shipperType,
    origin: origin === 'Leave blank if unknown' ? null : origin,
  };

  if (shipperType === 'shipsquared') {
    shipmentData.supplier = formData.get('supplier') as string;
    shipmentData.shippingMethod = formData.get('shippingMethod') as string;
    shipmentData.shipTo = formData.get('shipTo') as string;

    if (!shipmentData.supplier || !shipmentData.shippingMethod || !shipmentData.shipTo) {
      return NextResponse.json({ error: 'Missing required fields for ShipSquared Logistics.' }, { status: 400 });
    }
  } else {
    const packingList = formData.get('packingList') as File | null;
    if (packingList) {
      try {
        const bytes = await packingList.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await require('fs').promises.mkdir(uploadDir, { recursive: true });
        
        const fileName = `${Date.now()}_${packingList.name.replace(/\s/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        shipmentData.packingListUrl = `/uploads/${fileName}`;
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        return NextResponse.json({ error: 'Failed to upload packing list.' }, { status: 500 });
      }
    }
    shipmentData.shipDate = formData.get('shipDate') as string;
    shipmentData.palletCount = formData.get('palletCount') as string;
    shipmentData.eta = formData.get('eta') as string;
    shipmentData.trackingNumber = formData.get('trackingNumber') as string;

    if (!shipmentData.shipDate || !shipmentData.palletCount || !shipmentData.eta) {
       return NextResponse.json({ error: 'Missing required fields for manual freight.' }, { status: 400 });
    }
  }

  try {
    const newShipment = await prisma.inboundShipment.create({ data: shipmentData });
    return NextResponse.json({ success: true, shipment: newShipment });
  } catch (error) {
    console.error('Failed to create shipment:', error);
    return NextResponse.json({ error: 'Failed to create shipment.' }, { status: 500 });
  }
} 