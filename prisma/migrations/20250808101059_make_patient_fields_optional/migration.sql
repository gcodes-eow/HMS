-- AlterTable
ALTER TABLE "public"."Patient" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "emergency_contact_name" DROP NOT NULL,
ALTER COLUMN "emergency_contact_number" DROP NOT NULL,
ALTER COLUMN "relation" DROP NOT NULL;
