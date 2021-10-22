/*
  Warnings:

  - You are about to drop the column `product_id` on the `incarts_detail` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `incarts_detail` table. All the data in the column will be lost.
  - Added the required column `product_category` to the `incarts_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_code` to the `incarts_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `incarts_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_quantity` to the `incarts_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incarts_detail" DROP COLUMN "product_id",
DROP COLUMN "quantity",
ADD COLUMN     "product_category" VARCHAR(255) NOT NULL,
ADD COLUMN     "product_code" TEXT NOT NULL,
ADD COLUMN     "product_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "product_quantity" INTEGER NOT NULL;
