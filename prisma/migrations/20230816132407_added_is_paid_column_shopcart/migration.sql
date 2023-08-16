-- AlterTable
ALTER TABLE "Shopcart" ADD COLUMN     "email" TEXT,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;
