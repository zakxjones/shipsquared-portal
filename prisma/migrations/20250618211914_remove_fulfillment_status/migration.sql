/*
  Warnings:

  - You are about to drop the column `fulfillmentStatus` on the `Order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "platformConnectionId" TEXT NOT NULL,
    "platformOrderId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "shippingAddress" JSONB NOT NULL,
    "billingAddress" JSONB NOT NULL,
    "items" JSONB NOT NULL,
    "shippingMethod" TEXT,
    "trackingNumber" TEXT,
    "shipstationOrderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_platformConnectionId_fkey" FOREIGN KEY ("platformConnectionId") REFERENCES "PlatformConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("billingAddress", "createdAt", "currency", "id", "items", "orderNumber", "platform", "platformConnectionId", "platformOrderId", "shippingAddress", "shippingMethod", "shipstationOrderId", "status", "total", "trackingNumber", "updatedAt", "userId") SELECT "billingAddress", "createdAt", "currency", "id", "items", "orderNumber", "platform", "platformConnectionId", "platformOrderId", "shippingAddress", "shippingMethod", "shipstationOrderId", "status", "total", "trackingNumber", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_platform_platformOrderId_key" ON "Order"("platform", "platformOrderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
