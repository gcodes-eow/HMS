// app/actions/patient.ts
"use server";

import db from "@/lib/db";
import { PatientFormSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { Patient, ServiceResponse } from "@/types/dataTypes";

function normalizeEmpty(value: string | undefined): string | null {
  return value && value.trim() !== "" ? value : null;
}

export async function updatePatient(data: any, pid: string): Promise<ServiceResponse<null>> {
  try {
    const validateData = PatientFormSchema.safeParse(data);
    if (!validateData.success) {
      return { success: false, error: true, message: "Provide all required fields", status: 400, data: null };
    }

    const patientData = validateData.data;
    const client = await clerkClient();
    if (!pid || pid.trim() === "") {
      return { success: false, error: true, message: "Invalid patient ID", status: 400, data: null };
    }

    await client.users.updateUser(pid, {
      firstName: patientData.first_name,
      lastName: patientData.last_name,
    });

    await db.patient.update({
      where: { id: pid },
      data: {
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

    return { success: true, error: false, message: "Patient info updated successfully", status: 200, data: null };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, message: error?.message || "Something went wrong while updating patient.", status: 500, data: null };
  }
}

export async function createNewPatient(data: any, pid: string): Promise<ServiceResponse<null>> {
  try {
    const validateData = PatientFormSchema.safeParse(data);
    if (!validateData.success) {
      return { success: false, error: true, message: "Provide all required fields", status: 400, data: null };
    }

    const patientData = validateData.data;
    const client = await clerkClient();

    let patient_id = pid;
    const isCreatingNew = pid === "new-patient";

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
    } else if (pid && pid.trim() !== "") {
      await client.users.updateUser(pid, { publicMetadata: { role: "patient" } });
    } else {
      return { success: false, error: true, message: "Invalid or missing patient ID", status: 400, data: null };
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

    return { success: true, error: false, message: "Patient created successfully", status: 201, data: null };
  } catch (error: any) {
    console.error("Clerk error:", error?.errors || error);
    return { success: false, error: true, message: error?.message || "Something went wrong while creating patient.", status: 500, data: null };
  }
}

// --------------------- Get all patients ---------------------
export async function getAllPatients(): Promise<ServiceResponse<Patient[]>> {
  try {
    const patients = await db.patient.findMany({
      orderBy: { first_name: "asc" },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        date_of_birth: true,
        gender: true,
        phone: true,
        email: true,
        marital_status: true,
        address: true,
        emergency_contact_name: true,
        emergency_contact_number: true,
        relation: true,
        blood_group: true,
        allergies: true,
        medical_conditions: true,
        medical_history: true,
        insurance_provider: true,
        insurance_number: true,
        privacy_consent: true,
        service_consent: true,
        medical_consent: true,
        img: true,
        color_code: true,
        created_at: true,
        updated_at: true,
      },
    });

    const normalized: Patient[] = patients.map((p) => ({
      ...p,
      email: p.email ?? undefined,
      phone: p.phone ?? undefined,
      emergency_contact_name: p.emergency_contact_name ?? undefined,
      emergency_contact_number: p.emergency_contact_number ?? undefined,
      relation: p.relation ?? undefined,
      blood_group: p.blood_group ?? undefined,
      allergies: p.allergies ?? undefined,
      medical_conditions: p.medical_conditions ?? undefined,
      medical_history: p.medical_history ?? undefined,
      insurance_provider: p.insurance_provider ?? undefined,
      insurance_number: p.insurance_number ?? undefined,
      img: p.img ?? null,
      color_code: p.color_code ?? null,
    }));

    return {
      success: true,
      error: false,
      status: 200,
      data: normalized, // ✅ always an array
      totalRecords: normalized.length,
    };
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to fetch patients",
      data: [], // ✅ never null
      totalRecords: 0,
    };
  }
}


export async function deletePatient(id: string): Promise<ServiceResponse<null>> {
  try {
    if (!id || typeof id !== "string") {
      return { success: false, error: true, message: "Invalid patient ID", status: 400, data: null };
    }

    const client = await clerkClient();

    await db.patient.delete({ where: { id } });
    await client.users.deleteUser(id);

    return { success: true, error: false, message: "Patient deleted successfully", status: 200, data: null };
  } catch (error: any) {
    console.error("Delete patient error:", error);
    return { success: false, error: true, message: error?.message || "Something went wrong while deleting patient.", status: 500, data: null };
  }
}
