"use server";

import db from "@/lib/db";
import { DiagnosisFormData } from "@/components/dialogs/AddDiagnosis";
import {
  DiagnosisSchema,
  PatientBillSchema,
  PaymentSchema,
} from "@/lib/schema";
import { checkRole } from "@/utils/roles";

/* ------------------------------------------------------
 * Shared Types
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
 * Services CRUD
 * ---------------------------------------------------- */
export async function getServices(): Promise<ServiceResponse<any[]>> {
  try {
    const services = await db.services.findMany({
      orderBy: { id: "asc" },
    });
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
      data: {
        ...validatedData,
        medical_id: Number(med_id),
      },
    });

    return {
      success: true,
      message: "Diagnosis added successfully",
      status: 201,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to add diagnosis",
      status: 500,
    };
  }
};

export async function addNewBill(data: any) {
  try {
    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");

    if (!isAdmin && !isDoctor) {
      return {
        success: false,
        msg: "You are not authorized to add a bill",
      };
    }

    const isValidData = PatientBillSchema.safeParse(data);
    const validatedData = isValidData.data;
    let bill_info = null;

    if (!data?.bill_id || data?.bill_id === "undefined") {
      const info = await db.appointment.findUnique({
        where: { id: Number(data?.appointment_id)! },
        select: {
          id: true,
          patient_id: true,
          bills: {
            where: { appointment_id: Number(data?.appointment_id) },
          },
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
      } else {
        bill_info = info?.bills[0];
      }
    } else {
      bill_info = { id: data?.bill_id };
    }

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

    return {
      success: true,
      error: false,
      msg: `Bill added successfully`,
    };
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

    return {
      success: true,
      error: false,
      msg: `Bill generated successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
