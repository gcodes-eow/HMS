/*
  Warnings:

  - The primary key for the `MedicationAdministration` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MedicationAdministration_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MedicationAdministration_id_seq";
