/*
  Warnings:

  - You are about to drop the column `email` on the `Shopcart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shopcart" DROP COLUMN "email",
ADD COLUMN     "emailClient" TEXT,
ADD COLUMN     "nameClient" TEXT;
