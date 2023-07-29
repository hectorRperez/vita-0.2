-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "caution" TEXT,
ADD COLUMN     "howUse" TEXT,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "keyBenefits" TEXT,
ADD COLUMN     "size" VARCHAR(25) NOT NULL DEFAULT '1.0 fl. oz/30 ml';
