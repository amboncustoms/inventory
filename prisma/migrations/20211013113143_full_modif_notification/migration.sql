-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('STOCKIN', 'STOCKOUT', 'PROPOSAL', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "notifs" ADD COLUMN     "type" "NotifType";

-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "notif_id" TEXT;

-- CreateTable
CREATE TABLE "adjustment" (
    "id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_category" VARCHAR(255) NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_code" TEXT NOT NULL,
    "note" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adjustment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_notif_id_fkey" FOREIGN KEY ("notif_id") REFERENCES "notifs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
