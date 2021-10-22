/*
  Warnings:

  - You are about to drop the column `order_id` on the `request_notes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[incart_id]` on the table `request_notes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "request_notes" DROP CONSTRAINT "request_notes_order_id_fkey";

-- DropIndex
DROP INDEX "request_notes_order_id_unique";

-- AlterTable
ALTER TABLE "request_notes" DROP COLUMN "order_id",
ADD COLUMN     "incart_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "request_notes_incart_id_unique" ON "request_notes"("incart_id");

-- AddForeignKey
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_incart_id_fkey" FOREIGN KEY ("incart_id") REFERENCES "incarts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
