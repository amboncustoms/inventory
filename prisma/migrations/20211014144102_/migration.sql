/*
  Warnings:

  - You are about to drop the column `notif_id` on the `proposals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[notif_id]` on the table `adjustment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[proposal_id]` on the table `notifs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PURE';

-- DropForeignKey
ALTER TABLE "proposals" DROP CONSTRAINT "proposals_notif_id_fkey";

-- AlterTable
ALTER TABLE "notifs" ADD COLUMN     "proposal_id" TEXT;

-- AlterTable
ALTER TABLE "proposals" DROP COLUMN "notif_id";

-- CreateIndex
CREATE UNIQUE INDEX "adjustment_notif_id_key" ON "adjustment"("notif_id");

-- CreateIndex
CREATE UNIQUE INDEX "notifs_proposal_id_key" ON "notifs"("proposal_id");

-- AddForeignKey
ALTER TABLE "notifs" ADD CONSTRAINT "notifs_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
