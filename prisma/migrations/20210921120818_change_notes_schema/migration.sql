/*
  Warnings:

  - You are about to drop the `DeliveryNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeliveryNote" DROP CONSTRAINT "DeliveryNote_order_id_fkey";

-- DropForeignKey
ALTER TABLE "RequestNote" DROP CONSTRAINT "RequestNote_order_id_fkey";

-- DropTable
DROP TABLE "DeliveryNote";

-- DropTable
DROP TABLE "RequestNote";

-- CreateTable
CREATE TABLE "request_notes" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_notes" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "request_notes_reference_number_key" ON "request_notes"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "request_notes_order_id_unique" ON "request_notes"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_notes_reference_number_key" ON "delivery_notes"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_notes_order_id_unique" ON "delivery_notes"("order_id");

-- AddForeignKey
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
