-- DropForeignKey
ALTER TABLE "incarts_detail" DROP CONSTRAINT "incarts_detail_incart_id_fkey";

-- AlterTable
ALTER TABLE "incarts_detail" ALTER COLUMN "incart_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "incarts_detail" ADD CONSTRAINT "incarts_detail_incart_id_fkey" FOREIGN KEY ("incart_id") REFERENCES "incarts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
