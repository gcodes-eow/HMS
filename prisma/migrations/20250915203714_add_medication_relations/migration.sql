-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."AuditLog" ADD COLUMN     "actor_name" TEXT,
ADD COLUMN     "actor_type" TEXT NOT NULL DEFAULT 'SYSTEM',
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."MedicationAdministration" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "nurseId" TEXT NOT NULL,
    "medication" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "administeredAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationAdministration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MedicationAdministration" ADD CONSTRAINT "MedicationAdministration_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicationAdministration" ADD CONSTRAINT "MedicationAdministration_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "public"."Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
