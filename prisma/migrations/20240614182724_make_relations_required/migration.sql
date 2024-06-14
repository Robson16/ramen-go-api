/*
  Warnings:

  - Made the column `image_active_id` on table `broths` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_inactive_id` on table `broths` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "broths" DROP CONSTRAINT "broths_image_active_id_fkey";

-- DropForeignKey
ALTER TABLE "broths" DROP CONSTRAINT "broths_image_inactive_id_fkey";

-- AlterTable
ALTER TABLE "broths" ALTER COLUMN "image_active_id" SET NOT NULL,
ALTER COLUMN "image_inactive_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "broths" ADD CONSTRAINT "broths_image_inactive_id_fkey" FOREIGN KEY ("image_inactive_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broths" ADD CONSTRAINT "broths_image_active_id_fkey" FOREIGN KEY ("image_active_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
