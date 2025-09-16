// app/actions/laboratory.ts
"use server";

import db from "@/lib/db";
import {
  CreateLabTestSchema,
  UpdateLabTestSchema,
  CreateLabTestInput,
  UpdateLabTestInput,
} from "@/lib/schema";
import { revalidatePath } from "next/cache";
import type { LabTest } from "@/types/dataTypes";

export interface ActionResponse<T = any> {
  success: boolean;
  error?: boolean;
  message?: string;
  data?: T;
}

// ==========================
// Helper: normalize optional fields
// ==========================
function normalizeLabTest(labTest: any): LabTest {
  return {
    ...labTest,
    units: labTest.units ?? "",
    reference_range: labTest.reference_range ?? "",
    notes: labTest.notes ?? "",
  };
}

// ==========================
// Create Lab Test
// ==========================
export async function createLabTest(input: CreateLabTestInput): Promise<ActionResponse<LabTest>> {
  try {
    const parsed = CreateLabTestSchema.parse(input);

    const service = await db.services.findUnique({ where: { id: Number(parsed.service_id) } });
    if (!service) return { success: false, error: true, message: "Selected service not found" };

    const staff = await db.staff.findUnique({ where: { id: parsed.technician_id } });
    if (!staff) return { success: false, error: true, message: "No matching Staff record for this technician" };

    const appointment = await db.appointment.findFirst({
      where: { patient_id: parsed.patient_id },
      orderBy: { appointment_date: "desc" },
    });
    if (!appointment) return { success: false, error: true, message: "No appointment found for this patient" };

    let record = await db.medicalRecords.findFirst({
      where: { patient_id: parsed.patient_id, appointment_id: appointment.id },
    });

    if (!record) {
      record = await db.medicalRecords.create({
        data: {
          patient_id: parsed.patient_id,
          appointment_id: appointment.id,
          doctor_id: staff.id,
        },
      });
    }

    const labTestRaw = await db.labTest.create({
      data: {
        record_id: record.id,
        service_id: Number(parsed.service_id),
        test_date: parsed.test_date,
        result: parsed.result,
        units: parsed.units,
        reference_range: parsed.reference_range,
        status: parsed.status ?? "COMPLETED",
        notes: parsed.notes || "",
        technician_id: staff.id,
      },
      include: {
        medical_record: { include: { patient: true } },
        services: true,
        technician: true,
      },
    });

    revalidatePath("/laboratory");
    return { success: true, message: "Lab test recorded successfully", data: normalizeLabTest(labTestRaw) };
  } catch (error) {
    console.error("createLabTest error:", error);
    return { success: false, error: true, message: "Failed to create lab test" };
  }
}

// ==========================
// Update Lab Test
// ==========================
export async function updateLabTest(id: number, input: UpdateLabTestInput): Promise<ActionResponse<LabTest>> {
  try {
    const parsed = UpdateLabTestSchema.parse(input);

    const updateData: any = { ...parsed };
    if (updateData.service_id) updateData.service_id = Number(updateData.service_id);

    const labTestRaw = await db.labTest.update({
      where: { id },
      data: updateData,
      include: {
        medical_record: { include: { patient: true } },
        services: true,
        technician: true,
      },
    });

    revalidatePath("/laboratory");
    return { success: true, message: "Lab test updated successfully", data: normalizeLabTest(labTestRaw) };
  } catch (error) {
    console.error("updateLabTest error:", error);
    return { success: false, error: true, message: "Failed to update lab test" };
  }
}

// ==========================
// Delete Lab Test
// ==========================
export async function deleteLabTest(id: number): Promise<ActionResponse> {
  try {
    await db.labTest.delete({ where: { id } });
    revalidatePath("/laboratory");
    return { success: true, message: "Lab test deleted successfully" };
  } catch (error) {
    console.error("deleteLabTest error:", error);
    return { success: false, error: true, message: "Failed to delete lab test" };
  }
}

// ==========================
// Get Lab Test by ID
// ==========================
export async function getLabTestById(id: number): Promise<ActionResponse<LabTest>> {
  try {
    const labTestRaw = await db.labTest.findUnique({
      where: { id },
      include: {
        services: true,
        technician: true,
        medical_record: { include: { patient: true } },
      },
    });

    if (!labTestRaw) return { success: false, error: true, message: "Lab test not found" };

    return { success: true, data: normalizeLabTest(labTestRaw) };
  } catch (error) {
    console.error("getLabTestById error:", error);
    return { success: false, error: true, message: "Failed to fetch lab test" };
  }
}

// ==========================
// Get All Lab Tests (Paginated & Filtered)
// ==========================
export interface LabTestFilters {
  status?: string;
  patient_id?: string;
  technician_id?: string;
  service_id?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAllLabTestsPaginated(
  page = 1,
  limit = 10,
  filters: LabTestFilters = {}
): Promise<ActionResponse<{ data: LabTest[]; totalRecords: number; totalPages: number; currentPage: number; limit: number }>> {
  try {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.patient_id) where.medical_record = { patient_id: filters.patient_id };
    if (filters.technician_id) where.technician_id = filters.technician_id;
    if (filters.service_id) where.service_id = Number(filters.service_id);

    if (filters.startDate || filters.endDate) {
      where.test_date = {};
      if (filters.startDate) where.test_date.gte = new Date(filters.startDate);
      if (filters.endDate) where.test_date.lte = new Date(filters.endDate);
    }

    const totalRecords = await db.labTest.count({ where });

    const labTestsRaw = await db.labTest.findMany({
      where,
      orderBy: { test_date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        services: true,
        technician: true,
        medical_record: { include: { patient: true } },
      },
    });

    const labTests = labTestsRaw.map(normalizeLabTest);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      success: true,
      data: { data: labTests, totalRecords, totalPages, currentPage: page, limit },
    };
  } catch (error) {
    console.error("getAllLabTestsPaginated error:", error);
    return { success: false, error: true, message: "Failed to fetch lab tests" };
  }
}
