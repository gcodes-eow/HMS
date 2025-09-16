// actions/nurse.ts
"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { MedicationAdministrationSchema } from "@/lib/schema";
import { z } from "zod";

// ==========================
// Validation Schemas
// ==========================
const VitalSignsSchema = z.object({
  patient_id: z.string().min(1),
  medical_id: z.string().min(1),
  body_temperature: z.number(),
  heartRate: z.number(),
  systolic: z.number(),
  diastolic: z.number(),
  respiratory_rate: z.number(),
  oxygen_saturation: z.number(),
  weight: z.number(),
  height: z.number(),
});

// ==========================
// Server Actions
// ==========================

export async function administerMedication(formData: unknown) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const parsed = MedicationAdministrationSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, message: "Invalid form data", errors: parsed.error.flatten() };
    }

    const { patientId, medication, dosage, administeredAt, notes } = parsed.data;

    const record = await db.medicationAdministration.create({
      data: {
        patientId,
        nurseId: userId,
        medication,
        dosage,
        administeredAt,
        notes,
      },
    });

    await db.auditLog.create({
      data: {
        user_id: userId,
        record_id: record.id.toString(),
        action: "CREATE",
        model: "MedicationAdministration",
        details: `Medication ${medication} (${dosage}) administered to patient ${patientId}`,
        actor_type: "STAFF",
      },
    });

    return { success: true, message: "Medication recorded successfully", data: record };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function updateVitals(data: unknown) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const parsed = VitalSignsSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Invalid form data", errors: parsed.error.flatten() };
    }

    const {
      patient_id,
      medical_id,
      body_temperature,
      heartRate,
      systolic,
      diastolic,
      respiratory_rate,
      oxygen_saturation,
      weight,
      height,
    } = parsed.data;

    const numericMedicalId = Number(medical_id);

    const medicalRecord = await db.medicalRecords.findUnique({
      where: { id: numericMedicalId },
    });

    if (!medicalRecord) {
      return { success: false, message: "Medical record not found for this patient" };
    }

    const vitalSigns = await db.vitalSigns.create({
      data: {
        patient_id,
        medical_id: numericMedicalId,
        body_temperature,
        heartRate: heartRate.toString(),
        systolic,
        diastolic,
        respiratory_rate,
        oxygen_saturation,
        weight,
        height,
      },
    });

    await db.auditLog.create({
      data: {
        user_id: userId,
        record_id: vitalSigns.id.toString(),
        action: "CREATE",
        model: "VitalSigns",
        details: `Vital signs recorded for patient_id: ${patient_id}, medical_id: ${numericMedicalId}`,
        actor_type: "STAFF",
      },
    });

    return { success: true, message: "Vital signs recorded successfully", data: vitalSigns };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
}

/**
 * Fetch patients assigned to a nurse
 * NOTE: Assumes that nurse assignment is stored in `StaffAssignment` table
 */
export async function getNursePatients(nurseId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    // Example: Fetch patients through MedicationAdministration or StaffAssignment
    const patients = await db.patient.findMany({
      where: {
        medicationRecords: { some: { nurseId } }, // filter patients who have this nurse in medicationRecords
      },
      include: {
        medical: { orderBy: { created_at: "desc" }, take: 1 }, // last medical record
      },
    });

    return {
      success: true,
      data: patients.map((p) => {
        const age = p.date_of_birth
          ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / 31557600000)
          : 0;
        const lastRecord = p.medical?.[0] ?? null;

        return {
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          age,
          ward: p.address ?? "N/A",
          lastMedication: lastRecord?.treatment_plan ?? null,
        };
      }),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
}
