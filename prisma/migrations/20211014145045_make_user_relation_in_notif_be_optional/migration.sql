-- DropForeignKey
ALTER TABLE "notifs" DROP CONSTRAINT "notifs_user_id_fkey";

-- AlterTable
ALTER TABLE "notifs" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "notifs" ADD CONSTRAINT "notifs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
