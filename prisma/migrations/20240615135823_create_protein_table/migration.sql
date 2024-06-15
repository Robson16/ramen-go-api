-- CreateTable
CREATE TABLE "proteins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "image_inactive_id" TEXT NOT NULL,
    "image_active_id" TEXT NOT NULL,

    CONSTRAINT "proteins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proteins_name_key" ON "proteins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "proteins_image_inactive_id_key" ON "proteins"("image_inactive_id");

-- CreateIndex
CREATE UNIQUE INDEX "proteins_image_active_id_key" ON "proteins"("image_active_id");

-- AddForeignKey
ALTER TABLE "proteins" ADD CONSTRAINT "proteins_image_inactive_id_fkey" FOREIGN KEY ("image_inactive_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proteins" ADD CONSTRAINT "proteins_image_active_id_fkey" FOREIGN KEY ("image_active_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
