/*
  Warnings:

  - Added the required column `product_incart` to the `incarts_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incarts_detail" ADD COLUMN     "product_incart" INTEGER NOT NULL;
