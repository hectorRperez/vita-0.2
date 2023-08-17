/*
  Warnings:

  - A unique constraint covering the columns `[paymentSessionId]` on the table `Shopcart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Shopcart" ADD COLUMN     "paymentSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Shopcart_paymentSessionId_key" ON "Shopcart"("paymentSessionId");
