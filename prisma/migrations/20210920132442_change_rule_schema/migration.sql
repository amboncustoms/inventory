-- DropForeignKey
ALTER TABLE "rules" DROP CONSTRAINT "rules_user_id_fkey";

-- AlterTable
ALTER TABLE "rules" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
