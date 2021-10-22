-- AlterTable
ALTER TABLE "adjustment" ADD COLUMN     "notif_id" TEXT;

-- AddForeignKey
ALTER TABLE "adjustment" ADD CONSTRAINT "adjustment_notif_id_fkey" FOREIGN KEY ("notif_id") REFERENCES "notifs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
