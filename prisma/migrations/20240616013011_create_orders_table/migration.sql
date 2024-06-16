-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "broth_id" TEXT NOT NULL,
    "protein_id" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_broth_id_fkey" FOREIGN KEY ("broth_id") REFERENCES "broths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_protein_id_fkey" FOREIGN KEY ("protein_id") REFERENCES "proteins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
