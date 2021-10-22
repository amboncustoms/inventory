/*
  Warnings:

  - You are about to drop the column `product_category` on the `adjustment` table. All the data in the column will be lost.
  - You are about to drop the column `product_code` on the `adjustment` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `adjustment` table. All the data in the column will be lost.
  - You are about to drop the column `product_quantity` on the `adjustment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id]` on the table `adjustment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "adjustment" DROP COLUMN "product_category",
DROP COLUMN "product_code",
DROP COLUMN "product_name",
DROP COLUMN "product_quantity",
ADD COLUMN     "product_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "adjustment_product_id_key" ON "adjustment"("product_id");

-- AddForeignKey
ALTER TABLE "adjustment" ADD CONSTRAINT "adjustment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
