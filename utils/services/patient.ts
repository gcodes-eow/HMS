// utils/services/patient.ts
import db from "@/lib/db";
import { getMonth, format, startOfYear, endOfMonth, isToday } from "date-fns";
import { daysOfWeek } from "..";
import { Gender, AppointmentStatus } from "@prisma/client";

import {
  PatientDashboardData,
  AvailableDoctorProps,
  DashboardAppointment,
  DashboardPatient,
  DashboardDoctor,
} from "@/types/dataTypes";

// --------------------- Shared Types ---------------------
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

// Type for a Patient row from Prisma
export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date;
  gender?: Gender;
  phone?: string;
  email?: string | null;
  marital_status?: string;
  address?: string;
  emergency_contact_name?: string | null;
  emergency_contact_number?: string | null;
  relation?: string | null;
  blood_group?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  medical_history?: string | null;
  insurance_provider?: string | null;
  insurance_number?: string | null;
  privacy_consent?: boolean;
  service_consent?: boolean;
  medical_consent?: boolean;
  img?: string | null;
  colorCode?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

interface MonthlyData {
  name: string;
  appointment: number;
  completed: number;
}

// --------------------- Process Appointments ---------------------
export const processAppointments = async (
  appointments: DashboardAppointment[]
): Promise<{
  appointmentCounts: Record<AppointmentStatus | "TODAY", number>;
  monthlyData: MonthlyData[];
}> => {
  const thisYear = new Date().getFullYear();
  const monthlyData: MonthlyData[] = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, index: number) => ({
      name: format(new Date(thisYear, index), "MMM"),
      appointment: 0,
      completed: 0,
    })
  );

  const appointmentCounts = appointments.reduce<Record<AppointmentStatus | "TODAY", number>>(
    (acc, appointment: DashboardAppointment) => {
      const status = appointment.status as AppointmentStatus;
      const appointmentDate = new Date(appointment.appointment_date);
      const monthIndex = getMonth(appointmentDate);

      if (appointmentDate >= startOfYear(new Date()) && appointmentDate <= endOfMonth(new Date())) {
        monthlyData[monthIndex].appointment += 1;
        if (status === "COMPLETED") monthlyData[monthIndex].completed += 1;
      }

      if (isToday(appointmentDate)) {
        acc["TODAY"] = (acc["TODAY"] || 0) + 1;
      }

      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    // Initialize only the keys from AppointmentStatus + "TODAY"
    Object.fromEntries(
      [...Object.values(AppointmentStatus), "TODAY"].map((key) => [key, 0])
    ) as Record<AppointmentStatus | "TODAY", number>
  );

  return { appointmentCounts, monthlyData };
};

// --------------------- Dashboard Statistics ---------------------
export async function getPatientDashboardStatistics(
  id: string
): Promise<ServiceResponse<PatientDashboardData>> {
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        message: "Patient ID is required",
        status: 400,
        data: null,
      };
    }

    const patientData = await db.patient.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        gender: true,
        img: true,
        colorCode: true,
      },
    });

    if (!patientData) {
      return {
        success: false,
        error: true,
        message: "Patient not found",
        status: 404,
        data: null,
      };
    }

    const appointmentsRaw = await db.appointment.findMany({
      where: { patient_id: patientData.id },
      include: {
        doctor: { select: { id: true, name: true, img: true, specialization: true, colorCode: true } },
        patient: { select: { id: true, first_name: true, last_name: true, gender: true, img: true, colorCode: true } },
      },
      orderBy: { appointment_date: "desc" },
    });

    const appointments: DashboardAppointment[] = appointmentsRaw.map(
      (a: typeof appointmentsRaw[number]): DashboardAppointment => ({
        id: a.id,
        patient_id: a.patient_id,
        doctor_id: a.doctor_id,
        appointment_date: a.appointment_date,
        time: a.time,
        status: a.status as AppointmentStatus,
        reason: a.reason,
        patient: {
          ...a.patient,
          img: a.patient.img ?? undefined,
          colorCode: a.patient.colorCode ?? undefined,
        } as DashboardPatient,
        doctor: {
          ...a.doctor,
          img: a.doctor.img ?? undefined,
          colorCode: a.doctor.colorCode ?? undefined,
        } as DashboardDoctor,
        type: "DASHBOARD",
      })
    );

    const { appointmentCounts, monthlyData } = await processAppointments(appointments);
    const last5Records = appointments.slice(0, 5);

    const today = daysOfWeek[new Date().getDay()];
    const availableDoctorRaw = await db.doctor.findMany({
      select: { id: true, name: true, specialization: true, img: true, working_days: true, colorCode: true },
      where: { working_days: { some: { day: { equals: today, mode: "insensitive" } } } },
      take: 4,
    });

    const availableDoctor: AvailableDoctorProps = availableDoctorRaw.map(
      (d: typeof availableDoctorRaw[number]) => ({
        id: d.id,
        name: d.name,
        specialization: d.specialization,
        img: d.img ?? undefined,
        colorCode: d.colorCode ?? undefined,
        working_days: d.working_days.map(
          (w: typeof d.working_days[number]) => ({ day: w.day, start_time: w.start_time, close_time: w.close_time })
        ),
      })
    );

    return {
      success: true,
      error: false,
      status: 200,
      data: {
        ...patientData,
        img: patientData.img ?? undefined,
        colorCode: patientData.colorCode ?? undefined,
        appointmentCounts,
        last5Records,
        totalAppointments: appointments.length,
        availableDoctor,
        monthlyData,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: true, message: "Internal Server Error", status: 500, data: null };
  }
}
