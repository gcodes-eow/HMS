/*
  Warnings:

  - The `status` column on the `LabTest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."LabTestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."LabTest" DROP COLUMN "status",
ADD COLUMN     "status" "public"."LabTestStatus" NOT NULL DEFAULT 'PENDING';
