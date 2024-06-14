/*
  Warnings:

  - A unique constraint covering the columns `[image_inactive_id]` on the table `broths` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_active_id]` on the table `broths` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "broths" ADD COLUMN     "image_active_id" TEXT,
ADD COLUMN     "image_inactive_id" TEXT;

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "broths_image_inactive_id_key" ON "broths"("image_inactive_id");

-- CreateIndex
CREATE UNIQUE INDEX "broths_image_active_id_key" ON "broths"("image_active_id");

-- AddForeignKey
ALTER TABLE "broths" ADD CONSTRAINT "broths_image_inactive_id_fkey" FOREIGN KEY ("image_inactive_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broths" ADD CONSTRAINT "broths_image_active_id_fkey" FOREIGN KEY ("image_active_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
