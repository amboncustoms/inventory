/*
  Warnings:

  - The `allow_add_to_cart` column on the `rules` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Rules" AS ENUM ('ALLOW', 'PREVENT');

-- AlterTable
ALTER TABLE "rules" DROP COLUMN "allow_add_to_cart",
ADD COLUMN     "allow_add_to_cart" "Rules" DEFAULT E'ALLOW';
