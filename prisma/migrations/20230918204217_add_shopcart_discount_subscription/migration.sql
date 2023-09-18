-- CreateTable
CREATE TABLE "ShopcartDiscountSubscription" (
    "id" UUID NOT NULL,
    "shopcartId" UUID NOT NULL,
    "discountSubscriptionId" UUID NOT NULL,

    CONSTRAINT "ShopcartDiscountSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopcartDiscountSubscription_shopcartId_discountSubscriptio_key" ON "ShopcartDiscountSubscription"("shopcartId", "discountSubscriptionId");

-- AddForeignKey
ALTER TABLE "ShopcartDiscountSubscription" ADD CONSTRAINT "ShopcartDiscountSubscription_shopcartId_fkey" FOREIGN KEY ("shopcartId") REFERENCES "Shopcart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopcartDiscountSubscription" ADD CONSTRAINT "ShopcartDiscountSubscription_discountSubscriptionId_fkey" FOREIGN KEY ("discountSubscriptionId") REFERENCES "DiscountSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
