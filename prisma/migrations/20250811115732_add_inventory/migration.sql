-- CreateEnum
CREATE TYPE "public"."InventoryCategory" AS ENUM ('MEDICATION', 'CONSUMABLE', 'EQUIPMENT', 'OTHER');

-- AlterTable
ALTER TABLE "public"."PharmacistRecord" ADD COLUMN     "inventory_item_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."Inventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."InventoryCategory" NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "reorder_level" INTEGER NOT NULL DEFAULT 10,
    "cost_price" DOUBLE PRECISION NOT NULL,
    "selling_price" DOUBLE PRECISION,
    "batch_number" TEXT,
    "expiry_date" TIMESTAMP(3),
    "supplier" TEXT,
    "last_restocked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "added_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PharmacistRecord" ADD CONSTRAINT "PharmacistRecord_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventory" ADD CONSTRAINT "Inventory_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "public"."Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
