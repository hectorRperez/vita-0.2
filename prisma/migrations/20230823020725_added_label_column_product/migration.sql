-- CreateEnum
CREATE TYPE "ProductLabel" AS ENUM ('SALE', 'NEW', 'SOLD_OUT');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "label" "ProductLabel" NOT NULL DEFAULT 'NEW';
