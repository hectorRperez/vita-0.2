-- CreateTable
CREATE TABLE "Shopcart" (
    "id" UUID NOT NULL,
    "sessionId" TEXT,
    "userId" UUID,

    CONSTRAINT "Shopcart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopcartItem" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "carId" UUID NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "ShopcartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shopcart_sessionId_key" ON "Shopcart"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Shopcart_userId_key" ON "Shopcart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopcartItem_id_productId_key" ON "ShopcartItem"("id", "productId");

-- AddForeignKey
ALTER TABLE "Shopcart" ADD CONSTRAINT "Shopcart_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shopcart" ADD CONSTRAINT "Shopcart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopcartItem" ADD CONSTRAINT "ShopcartItem_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Shopcart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopcartItem" ADD CONSTRAINT "ShopcartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
