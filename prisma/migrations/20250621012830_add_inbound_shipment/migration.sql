-- AlterTable
ALTER TABLE "User" ADD COLUMN "shipstationStoreId" TEXT;

-- CreateTable
CREATE TABLE "InboundShipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "shipperType" TEXT NOT NULL,
    "origin" TEXT,
    "supplier" TEXT,
    "shippingMethod" TEXT,
    "shipTo" TEXT,
    "packingListUrl" TEXT,
    "shipDate" TEXT,
    "palletCount" TEXT,
    "eta" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    CONSTRAINT "InboundShipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
