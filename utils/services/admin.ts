// utils/services/admin.ts
import db from "@/lib/db";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";
import {
  DashboardAppointment,
  AvailableDoctorProps,
  AppointmentsChartProps,
} from "@/types/dataTypes";

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

export interface DashboardData {
  totalPatient: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentCounts: Record<string, number>;
  availableDoctors: AvailableDoctorProps;
  monthlyData: AppointmentsChartProps;
  last5Records: DashboardAppointment[];
}

/**
 * =============================
 * 📊 Dashboard Stats
 * =============================
 */
export async function getAdminDashboardStats(): Promise<
  ServiceResponse<DashboardData>
> {
  try {
    const todayIndex = new Date().getDay();
    const today = daysOfWeek[todayIndex];

    const [totalPatient, totalDoctors, appointmentsRaw, doctorsRaw] =
      await Promise.all([
        db.patient.count(),
        db.doctor.count(),
        db.appointment.findMany({
          include: {
            patient: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                gender: true,
                img: true,
                colorCode: true,
              },
            },
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
                img: true,
                colorCode: true,
              },
            },
          },
          orderBy: { appointment_date: "desc" },
        }),
        db.doctor.findMany({
          where: {
            working_days: {
              some: { day: { equals: today, mode: "insensitive" } },
            },
          },
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
            colorCode: true,
            working_days: true,
          },
          take: 5,
        }),
      ]);

    // ✅ Derive the element type of the Prisma response
    type AppointmentRaw = Awaited<typeof appointmentsRaw>[number];
    type DoctorRaw = Awaited<typeof doctorsRaw>[number];
    type WorkingDayRaw = DoctorRaw["working_days"][number];

    const appointments: DashboardAppointment[] = appointmentsRaw.map(
      (a: AppointmentRaw): DashboardAppointment => ({
        id: a.id,
        patient_id: a.patient_id,
        doctor_id: a.doctor_id,
        appointment_date: a.appointment_date,
        time: a.time,
        status: a.status,
        type: a.type,
        reason: (a as any).reason ?? null, // TODO: adjust if reason is in your schema
        patient: {
          ...a.patient,
          img: a.patient.img ?? undefined,
          colorCode: a.patient.colorCode ?? undefined,
        },
        doctor: {
          ...a.doctor,
          img: a.doctor.img ?? undefined,
          colorCode: a.doctor.colorCode ?? undefined,
        },
      })
    );

    const doctors: AvailableDoctorProps = doctorsRaw.map(
      (d: DoctorRaw) => ({
        ...d,
        img: d.img ?? undefined,
        colorCode: d.colorCode ?? undefined,
        working_days: d.working_days.map((w: WorkingDayRaw) => ({
          day: w.day,
          start_time: w.start_time,
          close_time: w.close_time,
        })),
      })
    );

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );
    const last5Records = appointments.slice(0, 5);

    return {
      success: true,
      error: false,
      status: 200,
      data: {
        totalPatient,
        totalDoctors,
        totalAppointments: appointments.length,
        appointmentCounts,
        availableDoctors: doctors,
        monthlyData,
        last5Records,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Internal Server Error",
      data: null,
    };
  }
}
