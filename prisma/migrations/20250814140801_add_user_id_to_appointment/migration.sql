-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "patient_id" DROP NOT NULL;
