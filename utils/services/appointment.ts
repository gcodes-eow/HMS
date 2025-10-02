// utils/services/appointment.ts
import db from "@/lib/db";
import {
  AppointmentStatus as PrismaAppointmentStatus,
  Patient as PrismaPatient,
  Doctor as PrismaDoctor,
} from "@prisma/client";

// ---------------------------
// Types
// ---------------------------
export type AppointmentStatus = PrismaAppointmentStatus;

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
  patient: PrismaPatient & { img?: string | null; colorCode?: string | null };
  doctor: PrismaDoctor & { img?: string | null; colorCode?: string | null; department?: string | null };
  hasConflict?: boolean;
  doctorConflict?: boolean;
};

export interface ServiceResponse<T> {
  success: boolean;
  error: boolean;
  status: number;
  message?: string;
  data?: T;
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
  limit?: number;
}

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
// Get patient appointments
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
          patient: { ...appt.patient, img: appt.patient.img ?? null, colorCode: appt.patient.color_code ?? null },
          doctor: {
            ...appt.doctor,
            img: appt.doctor.img ?? null,
            colorCode: appt.doctor.color_code ?? null,
            department: appt.doctor.department ?? null,
          },
          hasConflict: !!overlappingPatient,
          doctorConflict: !!overlappingDoctor,
        };
      })
    );

    return {
      success: true,
      error: false,
      status: 200,
      data: appointmentsWithConflict,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGE_NUMBER,
      totalRecords,
      limit: LIMIT,
    };
  } catch (error) {
    console.error("getPatientAppointments error:", error);
    return {
      success: false,
      error: true,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

// ---------------------------
// Get appointment by ID
// ---------------------------
export async function getAppointmentById(
  id: number
): Promise<ServiceResponse<AppointmentWithRelations>> {
  try {
    if (!id) {
      return { success: false, error: true, message: "Appointment ID required", status: 400 };
    }
    const data = await db.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });
    if (!data) {
      return { success: false, error: true, message: "Appointment not found", status: 404 };
    }
    return {
      success: true,
      error: false,
      status: 200,
      data: {
        ...data,
        patient: { ...data.patient, img: data.patient.img ?? null, colorCode: data.patient.color_code ?? null },
        doctor: {
          ...data.doctor,
          img: data.doctor.img ?? null,
          colorCode: data.doctor.color_code ?? null,
          department: data.doctor.department ?? null,
        },
      },
    };
  } catch (error) {
    console.error("getAppointmentById error:", error);
    return { success: false, error: true, message: "Internal Server Error", status: 500 };
  }
}
