// utils/services/appointment.ts
import db from "@/lib/db";
import { AppointmentStatus as PrismaAppointmentStatus } from "@prisma/client";

// ---------------------------
// Service Response Type
// ---------------------------
export interface ServiceResponse<T> {
  success: boolean;
  error: boolean;
  status: number;
  message?: string;
  data?: T;
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
}

// ---------------------------
// Input for fetching
// ---------------------------
interface AllAppointmentsProps {
  page: number | string;
  limit?: number | string;
  search?: string;
  id?: string;
  status?: AppointmentStatus;
  sort?: "newest" | "oldest";
}

// ---------------------------
// Build query dynamically
// ---------------------------
const buildQuery = (id?: string, search?: string, status?: AppointmentStatus) => {
  const conditions: any[] = [];

  if (search) {
    conditions.push({
      OR: [
        { patient: { first_name: { contains: search, mode: "insensitive" } } },
        { patient: { last_name: { contains: search, mode: "insensitive" } } },
        { doctor: { name: { contains: search, mode: "insensitive" } } },
      ],
    });
  }

  if (id) conditions.push({ OR: [{ patient_id: id }, { doctor_id: id }] });
  if (status) conditions.push({ status });

  return conditions.length ? { AND: conditions } : {};
};

// ---------------------------
// Types
// ---------------------------
export type AppointmentStatus = PrismaAppointmentStatus;

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  img?: string | null;
  colorCode?: string | null;
  date_of_birth?: Date;
  phone?: string;
  address?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  img?: string | null;
  colorCode?: string | null;
}

export interface Appointment {
  id: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  time: string;
  status: AppointmentStatus;
  type?: string;
  reason?: string | null;
  note?: string | null;
  created_at: Date;
  updated_at: Date;
}

export type AppointmentWithRelations = Appointment & {
  patient: Patient;
  doctor: Doctor;
  hasConflict?: boolean;
  doctorConflict?: boolean;
};

// ---------------------------
// Get all appointments
// ---------------------------
export async function getPatientAppointments({
  page,
  limit,
  search,
  id,
  status,
  sort,
}: AllAppointmentsProps): Promise<ServiceResponse<AppointmentWithRelations[]>> {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [appointments, totalRecords] = await Promise.all([
      db.appointment.findMany({
        where: buildQuery(id, search, status),
        skip: SKIP,
        take: LIMIT,
        include: { patient: true, doctor: true },
        orderBy: { appointment_date: sort === "oldest" ? "asc" : "desc" },
      }),
      db.appointment.count({ where: buildQuery(id, search, status) }),
    ]);

    const appointmentsWithConflict: AppointmentWithRelations[] = await Promise.all(
      appointments.map(async (appt) => {
        const overlappingPatient = await db.appointment.findFirst({
          where: {
            patient_id: appt.patient_id,
            appointment_date: appt.appointment_date,
            time: appt.time,
            id: { not: appt.id },
            status: { not: "CANCELLED" },
          },
        });

        const overlappingDoctor = await db.appointment.findFirst({
          where: {
            doctor_id: appt.doctor_id,
            appointment_date: appt.appointment_date,
            time: appt.time,
            id: { not: appt.id },
            status: { not: "CANCELLED" },
          },
        });

        return {
          ...appt,
          hasConflict: !!overlappingPatient,
          doctorConflict: !!overlappingDoctor,
        };
      })
    );

    return {
      success: true,
      error: false,
      data: appointmentsWithConflict,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGE_NUMBER,
      totalRecords,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: true, message: "Internal Server Error", status: 500 };
  }
}

// ---------------------------
// Get appointment by ID
// ---------------------------
export async function getAppointmentById(
  id: number
): Promise<ServiceResponse<AppointmentWithRelations>> {
  try {
    if (!id) return { success: false, error: true, message: "Appointment ID required", status: 400 };

    const data = await db.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });

    if (!data) return { success: false, error: true, message: "Appointment not found", status: 404 };

    const appointment: AppointmentWithRelations = {
      id: data.id,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      appointment_date: data.appointment_date,
      time: data.time,
      status: data.status,
      type: data.type,
      reason: data.reason,
      note: data.note,
      created_at: data.created_at,
      updated_at: data.updated_at,
      patient: {
        ...data.patient,
        phone: data.patient?.phone,
        address: data.patient?.address,
      },
      doctor: data.doctor,
    };

    return { success: true, error: false, data: appointment, status: 200 };
  } catch (error) {
    console.error("getAppointmentById error:", error);
    return { success: false, error: true, message: "Internal Server Error", status: 500 };
  }
}
