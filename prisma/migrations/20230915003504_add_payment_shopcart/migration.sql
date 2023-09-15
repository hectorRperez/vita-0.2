/*
  Warnings:

  - You are about to drop the column `emailClient` on the `Shopcart` table. All the data in the column will be lost.
  - You are about to drop the column `nameClient` on the `Shopcart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shopcart" DROP COLUMN "emailClient",
DROP COLUMN "nameClient";

-- CreateTable
CREATE TABLE "PaymentShopcart" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "shopcartId" UUID NOT NULL,

    CONSTRAINT "PaymentShopcart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentShopcart" ADD CONSTRAINT "PaymentShopcart_shopcartId_fkey" FOREIGN KEY ("shopcartId") REFERENCES "Shopcart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
