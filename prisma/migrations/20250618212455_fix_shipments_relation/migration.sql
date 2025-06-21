/*
  Warnings:

  - You are about to drop the column `details` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `eta` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `packingListUrl` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `palletCount` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `shipDate` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `shipTo` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "shippingMethod" TEXT,
    "shippedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shipment" ("createdAt", "id", "shippingMethod") SELECT "createdAt", "id", "shippingMethod" FROM "Shipment";
DROP TABLE "Shipment";
ALTER TABLE "new_Shipment" RENAME TO "Shipment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
