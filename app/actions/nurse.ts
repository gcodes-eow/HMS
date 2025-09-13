"use server";

import db from "@/lib/db";
import { VitalSignsSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";

export async function createVitalSigns(data: any) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const parsed = VitalSignsSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: parsed.error.flatten(),
      };
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

    // Convert medical_id string to number
    const numericMedicalId = Number(medical_id);

    // Check if medical record exists using numeric id
    const medicalRecord = await db.medicalRecords.findUnique({
      where: { id: numericMedicalId },
    });

    if (!medicalRecord) {
      return {
        success: false,
        message: "Medical record not found for this patient",
      };
    }

    // Create the vital signs record
    const vitalSigns = await db.vitalSigns.create({
      data: {
        patient_id,            // string as per model
        medical_id: numericMedicalId,  // number as per model
        body_temperature,
        heartRate,
        systolic,
        diastolic,
        respiratory_rate,
        oxygen_saturation,
        weight,
        height,
      },
    });

    // Optional: create audit log
    await db.auditLog.create({
      data: {
        user_id: userId,
        record_id: vitalSigns.id.toString(),
        action: "CREATE",
        model: "VitalSigns",
        details: `Vital signs recorded for patient_id: ${patient_id}, medical_id: ${numericMedicalId}`,
      },
    });

    return {
      success: true,
      message: "Vital signs recorded successfully",
      data: vitalSigns,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}
