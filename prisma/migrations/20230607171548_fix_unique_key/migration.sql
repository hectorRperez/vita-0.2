/*
  Warnings:

  - A unique constraint covering the columns `[carId,productId]` on the table `ShopcartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShopcartItem_id_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ShopcartItem_carId_productId_key" ON "ShopcartItem"("carId", "productId");
