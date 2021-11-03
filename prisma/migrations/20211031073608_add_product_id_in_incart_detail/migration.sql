/*
  Warnings:

  - Added the required column `product_id` to the `incarts_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incarts_detail" ADD COLUMN     "product_id" TEXT NOT NULL;
