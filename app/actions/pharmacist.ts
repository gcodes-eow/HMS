"use server";

import { z } from "zod";
import db from "@/lib/db";
import { PharmacistSchema } from "@/lib/schema";

type CreatePharmacistRecordSuccess = {
  success: true;
  message: string;
  data: Awaited<ReturnType<typeof db.pharmacistRecord.create>>;
};

type CreatePharmacistRecordFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // flattened Zod errors
};

type CreatePharmacistRecordResult = CreatePharmacistRecordSuccess | CreatePharmacistRecordFailure;

export async function createPharmacistRecord(data: unknown): Promise<CreatePharmacistRecordResult> {
  const parsed = PharmacistSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const record = await db.pharmacistRecord.create({
      data: {
        medication_name: parsed.data.medication_name,
        dosage: parsed.data.dosage,
        quantity: parsed.data.quantity,
        patient_id: parsed.data.patient_id,
        prescription_date: parsed.data.prescription_date,
        pharmacist_notes: parsed.data.pharmacist_notes || null,
      },
    });

    return {
      success: true,
      message: "Medication dispensed successfully",
      data: record,
    };
  } catch (error: unknown) {
    console.error("Error creating pharmacist record:", error);
    return {
      success: false,
      message: "Failed to save pharmacist record",
    };
  }
}
