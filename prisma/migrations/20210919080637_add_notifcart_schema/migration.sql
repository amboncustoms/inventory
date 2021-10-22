/*
  Warnings:

  - You are about to drop the column `notif_id` on the `carts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_notif_id_fkey";

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "notif_id";

-- CreateTable
CREATE TABLE "notifs_cart" (
    "id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_category" VARCHAR(255) NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_code" TEXT NOT NULL,
    "notif_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifs_cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifs_cart" ADD CONSTRAINT "notifs_cart_notif_id_fkey" FOREIGN KEY ("notif_id") REFERENCES "notifs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
