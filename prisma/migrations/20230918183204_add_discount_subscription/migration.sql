-- CreateTable
CREATE TABLE "DiscountSubscription" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DiscountSubscription_pkey" PRIMARY KEY ("id")
);
