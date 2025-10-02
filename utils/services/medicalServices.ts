// utils/services/medicalServices.ts
"use server";

import db from "@/lib/db";
import { DiagnosisFormData } from "@/components/dialogs/AddDiagnosis";
import { format } from "date-fns";
import {
  DiagnosisSchema,
  PatientBillSchema,
  PaymentSchema,
} from "@/lib/schema";
import { checkRole } from "@/utils/roles";
import {
  MedicationAdministration,
  ServiceResponse,
  PaginatedResponse,
} from "@/types/dataTypes";

/* ------------------------------------------------------
 * Services CRUD
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

export async function getServiceById(
  id: number
): Promise<ServiceResponse<any>> {
  try {
    const service = await db.services.findUnique({ where: { id } });
    if (!service) {
      return {
        success: false,
        error: true,
        status: 404,
        message: "Service not found",
        data: null,
      };
    }
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

export async function createService(input: {
  service_name: string;
  description?: string;
  price: number;
}) {
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
  } catch (error: any) {
    console.error("Error deleting service:", error);
    if (error.code === "P2003") {
      return {
        success: false,
        error: true,
        status: 400,
        message:
          "Cannot delete service because it is linked to existing patient bills.",
        data: null,
      };
    }
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
 * Vital Signs
 * ---------------------------------------------------- */
export const getVitalSignData = async (id: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const data = await db.vitalSigns.findMany({
    where: {
      patient_id: id,
      created_at: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      created_at: true,
      systolic: true,
      diastolic: true,
      heart_rate: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  // 56 - 60
  const formatVitals = data?.map((record) => ({
    label: format(new Date(record.created_at), "MMM d"),
    systolic: record.systolic,
    diastolic: record.diastolic,
  }));

  const formattedData = data.map((record) => {
    const heartRates = record.heart_rate
      .split("-")
      .map((rate) => parseInt(rate.trim()));

    return {
      label: format(new Date(record.created_at), "MMM d"),
      value1: heartRates[0],
      value2: heartRates[1],
    };
  });

  const totalSystolic = data?.reduce((sum, acc) => sum + acc.systolic, 0);
  const totalDiastolic = data?.reduce((sum, acc) => sum + acc.diastolic, 0);

  const totalValue1 = formattedData?.reduce((sum, acc) => sum + acc.value1, 0);
  const totalValue2 = formattedData?.reduce((sum, acc) => sum + acc.value2, 0);

  const count = data?.length;

  const averageSystolic = totalSystolic / count;
  const averageDiastolic = totalDiastolic / count;

  const averageValue1 = totalValue1 / count;
  const averageValue2 = totalValue2 / count;

  const average = `${averageSystolic.toFixed(2)}/${averageDiastolic.toFixed(
    2
  )} mg/dL`;
  const averageHeartRate = `${averageValue1.toFixed(2)}-${averageValue2.toFixed(
    2
  )} bpm`;

  return {
    data: formatVitals,
    average,
    heartRateData: formattedData,
    averageHeartRate,
  };
};


/* ------------------------------------------------------
 * Diagnosis & Billing
 * ---------------------------------------------------- */
export const addDiagnosis = async (
  data: DiagnosisFormData,
  appointmentId: string
) => {
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
    console.error(error);
    return { success: false, message: "Failed to add diagnosis", status: 500 };
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

      if (!info?.bills?.length) {
        bill_info = await db.payment.create({
          data: {
            appointment_id: Number(data?.appointment_id),
            patient_id: info?.patient_id!,
            bill_date: new Date(),
            payment_date: new Date(),
            discount: 0.0,
            amount_paid: 0.0,
            total_amount: 0.0,
          },
        });
      } else bill_info = info?.bills[0];
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
    console.error(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function generateBill(data: any) {
  try {
    const validatedData = PaymentSchema.parse(data);
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
    console.error(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

/* ------------------------------------------------------
 * Medication administration pagination
 * ---------------------------------------------------- */
export const getAllMedicationAdministrationsPaginated = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<MedicationAdministration>> => {
  const totalRecords = await db.medicationAdministration.count();

  const rawData = await db.medicationAdministration.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { administered_at: "desc" },
    include: {
      patient: { select: { first_name: true, last_name: true } },
      staff: { select: { name: true, role: true } },
    },
  });

  const data: MedicationAdministration[] = rawData.map((d) => ({
    id: d.id,
    patientId: d.patient_id,
    staffId: d.staff_id,
    doctorId: d.doctor_id ?? undefined,
    patientName: `${d.patient.first_name} ${d.patient.last_name}`,
    staffName: d.staff.name,
    staffRole: d.staff.role,
    medication: d.medication,
    dosage: d.dosage,
    administeredAt: d.administered_at,
    notes: d.notes ?? undefined,
  }));

  return {
    success: true,
    error: false,
    status: 200,
    data,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
    currentPage: page,
    limit,
  };
};
