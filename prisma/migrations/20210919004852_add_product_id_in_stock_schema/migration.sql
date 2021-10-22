/*
  Warnings:

  - You are about to drop the column `name` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `product_code` on the `stocks` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `stocks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_product_code_fkey";

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "name",
DROP COLUMN "product_code",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
