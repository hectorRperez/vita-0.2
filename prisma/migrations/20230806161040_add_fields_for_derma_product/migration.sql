/*
  Warnings:

  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "dimensions" VARCHAR(25),
ADD COLUMN     "sizes" VARCHAR(25)[] DEFAULT ARRAY['1.0 fl. oz/30 ml']::VARCHAR(25)[],
ADD COLUMN     "weight" VARCHAR(25);
