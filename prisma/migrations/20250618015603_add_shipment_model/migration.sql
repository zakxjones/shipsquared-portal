-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "supplier" TEXT,
    "shippingMethod" TEXT,
    "shipTo" TEXT,
    "packingListUrl" TEXT,
    "shipDate" DATETIME,
    "palletCount" INTEGER,
    "eta" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "details" JSONB,
    CONSTRAINT "Shipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
