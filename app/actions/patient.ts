// app/actions/patient.ts
"use server";

import db from "@/lib/db";
import { PatientFormSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

function normalizeEmpty(value: string | undefined): string | null {
  return value && value.trim() !== "" ? value : null;
}

export async function updatePatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);
    if (!validateData.success) {
      return { success: false, error: true, msg: "Provide all required fields", status: 400 };
    }

    const patientData = validateData.data;
    const client = await clerkClient();
    const isValidPid = typeof pid === "string" && pid.trim() !== "";

    if (!isValidPid) {
      return { success: false, error: true, msg: "Invalid patient ID", status: 400 };
    }

    await client.users.updateUser(pid, {
      firstName: patientData.first_name,
      lastName: patientData.last_name,
    });

    await db.patient.update({
      where: { id: pid },
      data: {
        id: pid,
        email: patientData.email?.trim() || `${Date.now()}@example.com`,
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        date_of_birth: patientData.date_of_birth,
        gender: patientData.gender,
        phone: patientData.phone,
        address: patientData.address,
        marital_status: patientData.marital_status,
        blood_group: normalizeEmpty(patientData.blood_group),
        allergies: normalizeEmpty(patientData.allergies),
        medical_conditions: normalizeEmpty(patientData.medical_conditions),
        medical_history: normalizeEmpty(patientData.medical_history),
        insurance_provider: normalizeEmpty(patientData.insurance_provider),
        insurance_number: normalizeEmpty(patientData.insurance_number),
        emergency_contact_name: normalizeEmpty(patientData.emergency_contact_name),
        emergency_contact_number: normalizeEmpty(patientData.emergency_contact_number),
        relation: patientData.relation || "other",
        img: normalizeEmpty(patientData.img),
        privacy_consent: patientData.privacy_consent,
        service_consent: patientData.service_consent,
        medical_consent: patientData.medical_consent,
      },
    });

    return {
      success: true,
      error: false,
      msg: "Patient info updated successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: true,
      msg: error?.message || "Something went wrong while updating patient.",
      status: 500,
    };
  }
}

export async function createNewPatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);
    if (!validateData.success) {
      return { success: false, error: true, msg: "Provide all required fields", status: 400 };
    }

    const patientData = validateData.data;
    const client = await clerkClient();

    let patient_id = pid;
    const isCreatingNew = pid === "new-patient";
    const isValidPid = typeof pid === "string" && pid.trim() !== "";

    if (isCreatingNew) {
      const safeEmail = patientData.email?.trim() || `${Date.now()}@example.com`;
      const safePassword = `${patientData.phone}@Temp123`;
      const safeUsername = `${patientData.first_name.toLowerCase()}${Date.now()}`;

      const user = await client.users.createUser({
        emailAddress: [safeEmail],
        password: safePassword,
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        username: safeUsername,
        publicMetadata: { role: "patient" },
      });

      patient_id = user.id;
    } else if (isValidPid) {
      await client.users.updateUser(pid, {
        publicMetadata: { role: "patient" },
      });
    } else {
      return { success: false, error: true, msg: "Invalid or missing patient ID", status: 400 };
    }

    await db.patient.create({
      data: {
        id: patient_id,
        email: patientData.email?.trim() || `${Date.now()}@example.com`,
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        date_of_birth: patientData.date_of_birth,
        gender: patientData.gender,
        phone: patientData.phone,
        address: patientData.address,
        marital_status: patientData.marital_status,
        blood_group: normalizeEmpty(patientData.blood_group),
        allergies: normalizeEmpty(patientData.allergies),
        medical_conditions: normalizeEmpty(patientData.medical_conditions),
        medical_history: normalizeEmpty(patientData.medical_history),
        insurance_provider: normalizeEmpty(patientData.insurance_provider),
        insurance_number: normalizeEmpty(patientData.insurance_number),
        emergency_contact_name: normalizeEmpty(patientData.emergency_contact_name),
        emergency_contact_number: normalizeEmpty(patientData.emergency_contact_number),
        relation: patientData.relation ?? null,
        img: normalizeEmpty(patientData.img),
        privacy_consent: patientData.privacy_consent,
        service_consent: patientData.service_consent,
        medical_consent: patientData.medical_consent,
      },
    });

    return { success: true, error: false, msg: "Patient created successfully", status: 201 };
  } catch (error: any) {
    console.error("Clerk error:", error?.errors || error);
    return {
      success: false,
      error: true,
      msg: error?.message || "Something went wrong while creating patient.",
      status: 500,
    };
  }
}

export async function deletePatient(id: string) {
  try {
    if (!id || typeof id !== "string") {
      return { success: false, error: true, message: "Invalid patient ID", status: 400 };
    }

    const client = await clerkClient();

    // Remove patient record
    await db.patient.delete({ where: { id } });

    // Also delete the associated Clerk user
    await client.users.deleteUser(id);

    return {
      success: true,
      error: false,
      message: "Patient deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Delete patient error:", error);
    return {
      success: false,
      error: true,
      message: error?.message || "Something went wrong while deleting patient.",
      status: 500,
    };
  }
}
