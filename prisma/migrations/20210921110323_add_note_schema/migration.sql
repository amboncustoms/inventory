-- DropForeignKey
ALTER TABLE "proposals" DROP CONSTRAINT "proposals_user_id_fkey";

-- AlterTable
ALTER TABLE "proposals" ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RequestNote" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryNote" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestNote_reference_number_key" ON "RequestNote"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "RequestNote_order_id_unique" ON "RequestNote"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryNote_reference_number_key" ON "DeliveryNote"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryNote_order_id_unique" ON "DeliveryNote"("order_id");

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestNote" ADD CONSTRAINT "RequestNote_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryNote" ADD CONSTRAINT "DeliveryNote_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
