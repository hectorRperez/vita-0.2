-- CreateEnum
CREATE TYPE "CategoryTemplate" AS ENUM ('TEMPLATE_ONE', 'TEMPLATE_TWO');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "template" "CategoryTemplate" NOT NULL DEFAULT 'TEMPLATE_ONE';
