/*
  Warnings:

  - Added the required column `size` to the `ShopcartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShopcartItem" ADD COLUMN     "size" VARCHAR(20) NOT NULL;
