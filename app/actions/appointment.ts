// app/actions/appointment.ts
"use server";

import db from "@/lib/db";
import { AppointmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AppointmentSchema, VitalSignsSchema } from "@/lib/schema";
import { z } from "zod";

type AppointmentInput = z.infer<typeof AppointmentSchema>;
type VitalSignsInput = z.infer<typeof VitalSignsSchema>;

interface ActionResponse<T = any> {
  success: boolean;
  error?: boolean;
  message?: string;
  msg?: string;
  data?: T;
  hasConflict?: boolean;
  doctorConflict?: boolean;
  patientConflictData?: any | null;
  doctorConflictData?: any | null;
}

// ==========================
// Create Appointment
// ==========================
export async function createAppointment(input: AppointmentInput): Promise<ActionResponse> {
  try {
    const parsed = AppointmentSchema.parse(input);

    const patientConflict = await db.appointment.findFirst({
      where: {
        patient_id: parsed.patient_id,
        appointment_date: new Date(parsed.appointment_date),
        time: parsed.time,
        status: { not: AppointmentStatus.CANCELLED },
      },
      include: { doctor: true, patient: true },
    });

    const doctorConflict = await db.appointment.findFirst({
      where: {
        doctor_id: parsed.doctor_id,
        appointment_date: new Date(parsed.appointment_date),
        time: parsed.time,
        status: { not: AppointmentStatus.CANCELLED },
      },
      include: { doctor: true, patient: true },
    });

    const appointment = await db.appointment.create({
      data: {
        patient_id: parsed.patient_id,
        doctor_id: parsed.doctor_id,
        type: parsed.type,
        appointment_date: new Date(parsed.appointment_date),
        time: parsed.time,
        note: parsed.note ?? null,
        reason: parsed.reason ?? null,
        status: parsed.status ?? AppointmentStatus.SCHEDULED,
      },
    });

    revalidatePath("/record/appointments");

    return {
      success: true,
      data: appointment,
      hasConflict: !!patientConflict,
      doctorConflict: !!doctorConflict,
      patientConflictData: patientConflict,
      doctorConflictData: doctorConflict,
      message:
        patientConflict || doctorConflict
          ? "Appointment created but conflicts detected"
          : "Appointment created successfully",
    };
  } catch (error) {
    console.error("createAppointment error:", error);
    return { success: false, error: true, message: "Failed to create appointment" };
  }
}

// ==========================
// Update Appointment
// ==========================
export async function updateAppointment(id: number, input: Partial<AppointmentInput>): Promise<ActionResponse> {
  try {
    const parsed = AppointmentSchema.partial().parse(input);

    const appointment = await db.appointment.update({
      where: { id },
      data: {
        ...(parsed.patient_id && { patient_id: parsed.patient_id }),
        ...(parsed.doctor_id && { doctor_id: parsed.doctor_id }),
        ...(parsed.type && { type: parsed.type }),
        ...(parsed.appointment_date && { appointment_date: new Date(parsed.appointment_date) }),
        ...(parsed.time && { time: parsed.time }),
        ...(parsed.note && { note: parsed.note }),
        ...(parsed.reason && { reason: parsed.reason }),
        ...(parsed.status && { status: parsed.status }),
      },
    });

    revalidatePath("/record/appointments");

    return { success: true, data: appointment, message: "Appointment updated successfully" };
  } catch (error) {
    console.error("updateAppointment error:", error);
    return { success: false, error: true, message: "Failed to update appointment" };
  }
}

// ==========================
// Delete Appointment
// ==========================
export async function deleteAppointment(id: number): Promise<ActionResponse> {
  try {
    await db.appointment.delete({ where: { id } });
    revalidatePath("/record/appointments");
    return { success: true, message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("deleteAppointment error:", error);
    return { success: false, error: true, message: "Failed to delete appointment" };
  }
}

// ==========================
// Approve / Cancel / Status Change
// ==========================
export async function appointmentAction(
  id: string | number,
  status: AppointmentStatus,
  reason?: string
): Promise<{ success: boolean; error?: boolean; msg: string }> {
  try {
    await db.appointment.update({
      where: { id: Number(id) },
      data: {
        status,
        reason: reason ?? null,
      },
    });

    revalidatePath("/record/appointments");

    return {
      success: true,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.error("appointmentAction error:", error);
    return { success: false, error: true, msg: "Failed to update appointment status" };
  }
}

// ==========================
// Add Vital Signs
// ==========================
export async function addVitalSigns(
  input: VitalSignsInput,
  appointmentId: string,
  doctorId: string
): Promise<{ success: boolean; error?: boolean; msg: string }> {
  try {
    const parsed = VitalSignsSchema.parse(input);

    let medical = parsed.medical_id
      ? await db.medicalRecords.findUnique({ where: { id: Number(parsed.medical_id) } })
      : null;

    if (!medical) {
      medical = await db.medicalRecords.create({
        data: {
          appointment_id: Number(appointmentId),
          patient_id: parsed.patient_id,
          doctor_id: doctorId,
        },
      });
    }

    await db.vitalSigns.create({
      data: {
        patient_id: parsed.patient_id,
        medical_id: medical.id,
        body_temperature: parsed.body_temperature ?? 0,
        systolic: parsed.systolic ?? 0,
        diastolic: parsed.diastolic ?? 0,
        heartRate: parsed.heartRate ?? "0",
        respiratory_rate: parsed.respiratory_rate ?? null,
        oxygen_saturation: parsed.oxygen_saturation ?? null,
        weight: parsed.weight ?? 0,
        height: parsed.height ?? 0,
      },
    });

    revalidatePath(`/record/appointments/${appointmentId}`);

    return { success: true, msg: "Vital signs added successfully" };
  } catch (error) {
    console.error("addVitalSigns error:", error);
    return { success: false, error: true, msg: "Failed to add vital signs" };
  }
}

// ==========================
// Get Appointment with Medical Records
// ==========================
export async function getAppointmentWithMedicalRecordsById(id: number): Promise<ActionResponse> {
  try {
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
        medical: {
          include: {
            vital_signs: true,
            diagnosis: true,
            lab_test: true,
          },
        },
      },
    });

    if (!appointment) {
      return { success: false, error: true, message: "Appointment not found" };
    }

    return { success: true, data: appointment };
  } catch (error) {
    console.error("getAppointmentWithMedicalRecordsById error:", error);
    return { success: false, error: true, message: "Failed to fetch appointment" };
  }
}
