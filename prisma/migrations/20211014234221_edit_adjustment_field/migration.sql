/*
  Warnings:

  - Added the required column `adjust_quantity` to the `adjustment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adjustment" ADD COLUMN     "adjust_quantity" INTEGER NOT NULL;
