// actions/medicalServices.ts
"use server";

import db from "@/lib/db";
import { checkRole } from "@/utils/roles";
import { DiagnosisFormData } from "@/components/dialogs/AddDiagnosis";
import {
  DiagnosisSchema,
  PatientBillSchema,
  PaymentSchema,
  MedicationAdministrationSchema,
  MedicationAdministrationInput,
} from "@/lib/schema";
import { MedicationAdministration } from "@/types/dataTypes";

/* ------------------------------------------------------
 * Service Response Interface
 * ---------------------------------------------------- */
export interface ServiceResponse<T> {
  success: boolean;
  error: boolean;
  status: number;
  message?: string;
  data?: T | null;
  totalRecords?: number;
}

/* ------------------------------------------------------
 * Service Actions
 * ---------------------------------------------------- */
export async function getServices(): Promise<ServiceResponse<any[]>> {
  try {
    const services = await db.services.findMany({ orderBy: { id: "asc" } });
    return {
      success: true,
      error: false,
      status: 200,
      data: services,
      totalRecords: services.length,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to fetch services",
      data: null,
    };
  }
}

export async function getServiceById(id: number): Promise<ServiceResponse<any>> {
  try {
    const service = await db.services.findUnique({ where: { id } });
    if (!service)
      return {
        success: false,
        error: true,
        status: 404,
        message: "Service not found",
        data: null,
      };
    return { success: true, error: false, status: 200, data: service };
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to fetch service",
      data: null,
    };
  }
}

export async function createService(input: { service_name: string; description?: string; price: number }) {
  try {
    const service = await db.services.create({
      data: {
        service_name: input.service_name,
        description: input.description ?? "",
        price: input.price,
      },
    });
    return {
      success: true,
      error: false,
      status: 201,
      message: "Service created successfully",
      data: service,
    };
  } catch (error) {
    console.error("Error creating service:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to create service",
      data: null,
    };
  }
}

export async function updateService(
  id: number,
  input: { service_name?: string; description?: string; price?: number }
) {
  try {
    const service = await db.services.update({ where: { id }, data: input });
    return {
      success: true,
      error: false,
      status: 200,
      message: "Service updated successfully",
      data: service,
    };
  } catch (error) {
    console.error("Error updating service:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to update service",
      data: null,
    };
  }
}

export async function deleteService(id: number) {
  try {
    await db.services.delete({ where: { id } });
    return {
      success: true,
      error: false,
      status: 200,
      message: "Service deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting service:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to delete service",
      data: null,
    };
  }
}

/* ------------------------------------------------------
 * Diagnosis & Billing Actions
 * ---------------------------------------------------- */
export const addDiagnosis = async (data: DiagnosisFormData, appointmentId: string) => {
  try {
    const validatedData = DiagnosisSchema.parse(data);
    let medicalRecord = null;

    if (!validatedData.medical_id) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          doctor_id: validatedData.doctor_id,
          appointment_id: Number(appointmentId),
        },
      });
    }

    const med_id = validatedData.medical_id || medicalRecord?.id;
    await db.diagnosis.create({
      data: { ...validatedData, medical_id: Number(med_id) },
    });

    return {
      success: true,
      message: "Diagnosis added successfully",
      status: 201,
    };
  } catch (error) {
    console.log(error);
    return { error: "Failed to add diagnosis" };
  }
};

export async function addNewBill(data: any) {
  try {
    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");
    if (!isAdmin && !isDoctor)
      return { success: false, msg: "You are not authorized to add a bill" };

    const isValidData = PatientBillSchema.safeParse(data);
    const validatedData = isValidData.data;
    let bill_info = null;

    if (!data?.bill_id || data?.bill_id === "undefined") {
      const info = await db.appointment.findUnique({
        where: { id: Number(data?.appointment_id)! },
        select: {
          id: true,
          patient_id: true,
          bills: { where: { appointment_id: Number(data?.appointment_id) } },
        },
      });
      bill_info = !info?.bills?.length
        ? await db.payment.create({
            data: {
              appointment_id: Number(data?.appointment_id),
              patient_id: info?.patient_id!,
              bill_date: new Date(),
              payment_date: new Date(),
              discount: 0.0,
              amount_paid: 0.0,
              total_amount: 0.0,
            },
          })
        : info?.bills[0];
    } else bill_info = { id: data?.bill_id };

    await db.patientBills.create({
      data: {
        bill_id: Number(bill_info?.id),
        service_id: Number(validatedData?.service_id),
        service_date: new Date(validatedData?.service_date!),
        quantity: Number(validatedData?.quantity),
        unit_cost: Number(validatedData?.unit_cost),
        total_cost: Number(validatedData?.total_cost),
      },
    });

    return { success: true, error: false, msg: `Bill added successfully` };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function generateBill(data: any) {
  try {
    const isValidData = PaymentSchema.safeParse(data);
    const validatedData = isValidData.data;
    const discountAmount =
      (Number(validatedData?.discount) / 100) *
      Number(validatedData?.total_amount);

    const res = await db.payment.update({
      data: {
        bill_date: validatedData?.bill_date,
        discount: discountAmount,
        total_amount: Number(validatedData?.total_amount)!,
      },
      where: { id: Number(validatedData?.id) },
    });

    await db.appointment.update({
      data: { status: "COMPLETED" },
      where: { id: res.appointment_id },
    });

    return { success: true, error: false, msg: `Bill generated successfully` };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

/* ------------------------------------------------------
 * Medication Administration Actions
 * ---------------------------------------------------- */
export async function createMedicationAdministration(
  input: MedicationAdministrationInput
): Promise<ServiceResponse<MedicationAdministration>> {
  try {
    const validated = MedicationAdministrationSchema.parse(input);

    const record = await db.medicationAdministration.create({
      data: {
        patientId: validated.patientId,
        staffId: validated.staffId,
        doctorId: validated.doctorId ?? null,
        medication: validated.medication,
        dosage: validated.dosage,
        administeredAt: validated.administeredAt,
        notes: validated.notes ?? null,
      },
      include: {
        patient: { select: { first_name: true, last_name: true } },
        staff: { select: { name: true, role: true } },
      },
    });

    return {
      success: true,
      error: false,
      status: 201,
      message: "Medication recorded successfully",
      data: {
        id: record.id,
        patientId: record.patientId,
        staffId: record.staffId,
        doctorId: record.doctorId ?? undefined,
        patientName: `${record.patient.first_name} ${record.patient.last_name}`,
        staffName: record.staff.name,
        staffRole: record.staff.role,
        medication: record.medication,
        dosage: record.dosage,
        administeredAt: record.administeredAt,
        notes: record.notes ?? undefined,
      },
    };
  } catch (error) {
    console.error("Error creating medication:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to record medication",
      data: null,
    };
  }
}

export async function updateMedicationAdministration(
  id: string,
  input: Partial<MedicationAdministrationInput>
): Promise<ServiceResponse<MedicationAdministration>> {
  try {
    const validated = MedicationAdministrationSchema.partial().parse(input);

    const updated = await db.medicationAdministration.update({
      where: { id },
      data: {
        medication: validated.medication,
        dosage: validated.dosage,
        administeredAt: validated.administeredAt,
        notes: validated.notes,
      },
      include: {
        patient: { select: { first_name: true, last_name: true } },
        staff: { select: { name: true, role: true } },
      },
    });

    return {
      success: true,
      error: false,
      status: 200,
      message: "Medication updated successfully",
      data: {
        id: updated.id,
        patientId: updated.patientId,
        staffId: updated.staffId,
        doctorId: updated.doctorId ?? undefined,
        patientName: `${updated.patient.first_name} ${updated.patient.last_name}`,
        staffName: updated.staff.name,
        staffRole: updated.staff.role,
        medication: updated.medication,
        dosage: updated.dosage,
        administeredAt: updated.administeredAt,
        notes: updated.notes ?? undefined,
      },
    };
  } catch (error) {
    console.error("Error updating medication:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to update medication",
      data: null,
    };
  }
}

export async function getAllMedicationAdministrations(): Promise<ServiceResponse<MedicationAdministration[]>> {
  try {
    const data = await db.medicationAdministration.findMany({
      include: {
        patient: { select: { id: true, first_name: true, last_name: true } },
        staff: { select: { id: true, name: true, role: true } },
      },
      orderBy: { administeredAt: "desc" },
    });

    const records: MedicationAdministration[] = data.map((r) => ({
      id: r.id,
      patientId: r.patientId,
      staffId: r.staffId,
      doctorId: r.doctorId ?? undefined,
      patientName: `${r.patient.first_name} ${r.patient.last_name}`,
      staffName: r.staff.name,
      staffRole: r.staff.role,
      medication: r.medication,
      dosage: r.dosage,
      administeredAt: r.administeredAt,
      notes: r.notes ?? undefined,
    }));

    return {
      success: true,
      error: false,
      status: 200,
      data: records,
      totalRecords: records.length,
    };
  } catch (error) {
    console.error("Error fetching medications:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to fetch medications",
      data: null,
    };
  }
}

export async function getMedicationById(id: string): Promise<ServiceResponse<MedicationAdministration>> {
  try {
    const data = await db.medicationAdministration.findUnique({
      where: { id },
      include: {
        patient: { select: { first_name: true, last_name: true } },
        staff: { select: { name: true, role: true } },
      },
    });

    if (!data)
      return {
        success: false,
        error: true,
        status: 404,
        message: "Medication record not found",
        data: null,
      };

    return {
      success: true,
      error: false,
      status: 200,
      data: {
        id: data.id,
        patientId: data.patientId,
        staffId: data.staffId,
        doctorId: data.doctorId ?? undefined,
        patientName: `${data.patient.first_name} ${data.patient.last_name}`,
        staffName: data.staff.name,
        staffRole: data.staff.role,
        medication: data.medication,
        dosage: data.dosage,
        administeredAt: data.administeredAt,
        notes: data.notes ?? undefined,
      },
    };
  } catch (error) {
    console.error("Error fetching medication:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to fetch medication",
      data: null,
    };
  }
}

export async function deleteMedication(id: string) {
  try {
    await db.medicationAdministration.delete({ where: { id } });
    return {
      success: true,
      error: false,
      status: 200,
      message: "Medication deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting medication:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to delete medication",
    };
  }
}

/* ------------------------------------------------------
 * Aliases for backward compatibility with client imports
 * ---------------------------------------------------- */
export const fetchServices = getServices;
export const fetchServiceById = getServiceById;
export const addService = createService;
export const editService = updateService;
export const removeService = deleteService;
