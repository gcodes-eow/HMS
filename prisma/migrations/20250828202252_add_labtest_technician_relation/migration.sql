-- AlterTable
ALTER TABLE "public"."LabTest" ADD COLUMN     "technician_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "public"."Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
