/*
  Warnings:

  - The values [CONFIRMED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cancelled_by` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Patient` table. All the data in the column will be lost.
  - Made the column `patient_id` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AppointmentStatus_new" AS ENUM ('PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED');
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" TYPE "public"."AppointmentStatus_new" USING ("status"::text::"public"."AppointmentStatus_new");
ALTER TYPE "public"."AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "public"."AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "public"."Patient_user_id_key";

-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "cancelled_by",
DROP COLUMN "user_id",
ALTER COLUMN "patient_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "user_id";
