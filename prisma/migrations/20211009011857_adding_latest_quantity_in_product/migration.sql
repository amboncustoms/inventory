/*
  Warnings:

  - Added the required column `latest_quantity` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "latest_quantity" INTEGER NOT NULL;
