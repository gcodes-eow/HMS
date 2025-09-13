// utils/services/doctor.ts
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

// ✅ Enums & runtime types from Prisma
import { Gender, AppointmentStatus } from "@prisma/client";

// ✅ Shared structural types only from dataTypes
import {
  DashboardAppointment as SharedDashboardAppointment,
  Rating as SharedRating,
  Doctor as SharedDoctor,
  Rating as SharedRatingType,
} from "@/types/dataTypes";


// ---------------------------
// Types
// ---------------------------
export interface ServiceResponse<T> {
  success: boolean;
  error: boolean;
  status: number;
  message?: string;
  data?: T | null;
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
}

// Doctor type with relations manually typed
export type DoctorWithRelations = SharedDoctor & {
  working_days?: { day: string; start_time: string; close_time: string }[];
  appointments?: SharedDashboardAppointment[];
};

// Appointment type with patient + doctor relations
export type AppointmentWithRelations = SharedDashboardAppointment & {
  hasConflict?: boolean;
  doctorConflict?: boolean;
};

// Rating type with patient info
export type RatingWithPatient = SharedRatingType & {
  patient: { first_name: string; last_name: string };
};

// Rating summary type
export interface RatingData {
  ratings: SharedRating[] | RatingWithPatient[];
  totalRatings: number;
  averageRating: string;
}

// ---------------------------
// Normalization Helpers
// ---------------------------
function normalizeDoctorAppointment(a: any): SharedDashboardAppointment {
  return {
    id: a.id, // keep as number to match Prisma
    appointment_date: a.appointment_date,
    time: new Date(a.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: a.status as AppointmentStatus,
    type: a.type ?? "GENERAL",
    doctor_id: a.doctor_id,
    patient_id: a.patient_id,
    doctor: {
      ...a.doctor,
      img: a.doctor.img ?? undefined,
      colorCode: a.doctor.colorCode ?? undefined,
    },
    patient: {
      ...a.patient,
      gender: a.patient.gender as Gender,
      img: a.patient.img ?? undefined,
      colorCode: a.patient.colorCode ?? undefined,
    },
  };
}

function normalizeDoctor(d: any): DoctorWithRelations {
  return {
    ...d,
    img: d.img ?? undefined,
    colorCode: d.colorCode ?? undefined,
    appointments: d.appointments?.map(normalizeDoctorAppointment),
  };
}

// ---------------------------
// Doctor Services
// ---------------------------
export async function getDoctors(): Promise<ServiceResponse<DoctorWithRelations[]>> {
  try {
    const data = await db.doctor.findMany({
      include: { working_days: true, appointments: { include: { patient: true, doctor: true } } },
    });

    const normalizedDoctors = data.map(normalizeDoctor);

    return { success: true, error: false, data: normalizedDoctors, status: 200 };
  } catch (error) {
    console.error(error);
    return { success: false, error: true, message: "Internal Server Error", status: 500, data: null };
  }
}

export async function getDoctorById(
  id: string
): Promise<ServiceResponse<DoctorWithRelations & { totalAppointment: number }>> {
  try {
    const [doctor, totalAppointment] = await Promise.all([
      db.doctor.findUnique({
        where: { id },
        include: {
          working_days: true,
          appointments: {
            include: {
              patient: {
                select: { id: true, first_name: true, last_name: true, gender: true, img: true, colorCode: true },
              },
              doctor: { select: { id: true, name: true, specialization: true, img: true, colorCode: true } },
            },
            orderBy: { appointment_date: "desc" },
            take: 10,
          },
        },
      }),
      db.appointment.count({ where: { doctor_id: id } }),
    ]);

    if (!doctor) return { success: false, error: true, message: "Doctor not found", status: 404, data: null };

    const normalizedAppointments: SharedDashboardAppointment[] = doctor.appointments?.map(normalizeDoctorAppointment);

    return {
      success: true,
      error: false,
      status: 200,
      data: { ...normalizeDoctor(doctor), appointments: normalizedAppointments, totalAppointment },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: true, message: "Internal Server Error", status: 500, data: null };
  }
}

export async function getDoctorDashboardStats(): Promise<
  ServiceResponse<{
    totalNurses: number;
    totalPatient: number;
    appointmentCounts: Record<AppointmentStatus | "TODAY", number>;
    last5Records: SharedDashboardAppointment[];
    availableDoctors: DoctorWithRelations[];
    totalAppointment: number;
    monthlyData: any;
  }>
> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: true, message: "Unauthorized", status: 401, data: null };

    const today = daysOfWeek[new Date().getDay()];

    const [totalPatient, totalNurses, appointments, doctors] = await Promise.all([
      db.patient.count(),
      db.staff.count({ where: { role: "NURSE" } }),
      db.appointment.findMany({
        where: { doctor_id: userId },
        include: {
          patient: { select: { id: true, first_name: true, last_name: true, gender: true, img: true, colorCode: true, date_of_birth: true } },
          doctor: { select: { id: true, name: true, specialization: true, img: true, colorCode: true } },
        },
        orderBy: { appointment_date: "desc" },
      }),
      db.doctor.findMany({
        where: { working_days: { some: { day: { equals: today, mode: "insensitive" } } } },
        select: { id: true, name: true, specialization: true, img: true, colorCode: true, working_days: true },
        take: 5,
      }),
    ]);

    const normalizedAppointments: SharedDashboardAppointment[] = appointments.map(normalizeDoctorAppointment);
    const normalizedDoctors: DoctorWithRelations[] = doctors.map(normalizeDoctor);

    const { appointmentCounts, monthlyData } = await processAppointments(normalizedAppointments);

    return {
      success: true,
      error: false,
      status: 200,
      data: {
        totalNurses,
        totalPatient,
        appointmentCounts,
        last5Records: normalizedAppointments.slice(0, 5),
        availableDoctors: normalizedDoctors,
        totalAppointment: normalizedAppointments.length,
        monthlyData,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: true, message: "Internal Server Error", status: 500, data: null };
  }
}

// ---------------------------
// Rating Service
// ---------------------------
export async function getRatingById(id: string): Promise<ServiceResponse<RatingData>> {
  try {
    const rawRatings = await db.rating.findMany({
      where: { staff_id: id },
      include: {
        patient: { select: { first_name: true, last_name: true } },
      },
    });

    const ratings: RatingWithPatient[] = rawRatings.map(r => ({
      id: r.id.toString(), // ✅ convert number → string
      rating: r.rating,
      comment: r.comment ?? undefined,
      patient: { first_name: r.patient?.first_name ?? "Unknown", last_name: r.patient?.last_name ?? "" },
      createdAt: r.created_at,
    }));

    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? (
            Math.round(
              (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings) * 10
            ) / 10
          ).toFixed(1)
        : "0";

    return { success: true, error: false, status: 200, data: { ratings, totalRatings, averageRating } };
  } catch (error) {
    console.error(error);
    return { success: false, error: true, message: "Internal Server Error", status: 500, data: null };
  }
}

// ---------------------------
// Paginated Doctor List
// ---------------------------
export async function getAllDoctors({
  page,
  limit,
  search,
}: {
  page: number | string;
  limit?: number | string;
  search?: string;
}): Promise<ServiceResponse<DoctorWithRelations[]>> {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [doctors, totalRecords] = await Promise.all([
      db.doctor.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { specialization: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        include: {
          working_days: true,
          appointments: {
            include: { patient: true, doctor: true },
            take: 5,
          },
        },
        skip: SKIP,
        take: LIMIT,
      }),
      db.doctor.count({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { specialization: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      }),
    ]);

    const normalizedDoctors: DoctorWithRelations[] = doctors.map(normalizeDoctor);

    return {
      success: true,
      error: false,
      status: 200,
      data: normalizedDoctors,
      totalRecords,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGE_NUMBER,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: true, message: "Internal Server Error", status: 500, data: null };
  }
}