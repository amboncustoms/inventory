/*
  Warnings:

  - You are about to drop the column `name` on the `stocks_in` table. All the data in the column will be lost.
  - You are about to drop the column `product_code` on the `stocks_in` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `stocks_out` table. All the data in the column will be lost.
  - You are about to drop the column `product_code` on the `stocks_out` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stocks_in" DROP COLUMN "name",
DROP COLUMN "product_code",
ADD COLUMN     "note" VARCHAR(255),
ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "stocks_out" DROP COLUMN "name",
DROP COLUMN "product_code",
ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "stocks_in" ADD CONSTRAINT "stocks_in_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks_out" ADD CONSTRAINT "stocks_out_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
