import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

interface PatchParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: PatchParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { status, notes, trackingNumber } = body;
  const isAdmin = session.user.role === 'admin';

  try {
    const shipment = await prisma.inboundShipment.findUnique({ where: { id } });
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // A non-admin can only update their own shipment's tracking number
    if (!isAdmin && shipment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let dataToUpdate: any = {};

    if (isAdmin) {
      if (status) dataToUpdate.status = status;
      if (notes !== undefined) dataToUpdate.notes = notes;
    }

    if (trackingNumber !== undefined) {
      dataToUpdate.trackingNumber = trackingNumber;
    }
    
    // Prevent non-admins from updating anything other than tracking
    if (!isAdmin && Object.keys(dataToUpdate).some(key => key !== 'trackingNumber')) {
        return NextResponse.json({ error: 'You can only update the tracking number.' }, { status: 403 });
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
    }

    const updatedShipment = await prisma.inboundShipment.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedShipment);
  } catch (error: any) {
    console.error(`Error updating shipment ${id}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Shipment not found.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update shipment.' }, { status: 500 });
  }
} 