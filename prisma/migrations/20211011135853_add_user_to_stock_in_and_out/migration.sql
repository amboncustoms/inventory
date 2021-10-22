-- AlterTable
ALTER TABLE "stocks_in" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "stocks_out" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "stocks_in" ADD CONSTRAINT "stocks_in_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks_out" ADD CONSTRAINT "stocks_out_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "delivery_notes_order_id_unique" RENAME TO "delivery_notes_order_id_key";

-- RenameIndex
ALTER INDEX "request_notes_incart_id_unique" RENAME TO "request_notes_incart_id_key";

-- RenameIndex
ALTER INDEX "rules_user_id_unique" RENAME TO "rules_user_id_key";
