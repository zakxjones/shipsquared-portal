import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Call ShipStation API and import data
  // For now, return a mock summary
  return NextResponse.json({
    success: true,
    importedOrders: 23,
    importedShipments: 15,
    message: 'Imported 23 orders and 15 shipments from ShipStation.'
  });
} 