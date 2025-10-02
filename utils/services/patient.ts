// utils/services/patient.ts
import db from "@/lib/db";
import { getMonth, format, startOfYear, endOfMonth, isToday } from "date-fns";
import { daysOfWeek } from "..";
import { AppointmentStatus } from "@prisma/client";
import {
  PatientDashboardData,
  FullPatientData,
  AvailableDoctorProps,
  DashboardAppointment,
  DashboardPatient,
  DashboardDoctor,
} from "@/types/dataTypes";

// --------------------- ServiceResponse ---------------------
export interface ServiceResponse<T> {
  success: boolean;
  error: boolean;
  message?: string;
  status: number;
  data: T | null;
}

// --------------------- Get Patient Dashboard Statistics ---------------------
export async function getPatientDashboardStatistics(
  patientId: string
): Promise<ServiceResponse<PatientDashboardData>> {
  try {
    if (!patientId) {
      return {
        success: false,
        error: true,
        message: "No patient ID provided",
        status: 400,
        data: null,
      };
    }

    const patient = await db.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        gender: true,
        img: true,
        color_code: true,
      },
    });

    if (!patient) {
      return {
        success: false,
        error: true,
        message: "Patient not found",
        status: 404,
        data: null,
      };
    }

    const appointmentsRaw = await db.appointment.findMany({
      where: { patient_id: patient.id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
            color_code: true,
          },
        },
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            gender: true,
            img: true,
            color_code: true,
          },
        },
      },
      orderBy: { appointment_date: "desc" },
    });

    const appointments: DashboardAppointment[] = appointmentsRaw.map((a) => ({
      id: a.id,
      patient_id: a.patient_id,
      doctor_id: a.doctor_id,
      appointment_date: a.appointment_date,
      time: a.time,
      status: a.status as AppointmentStatus,
      reason: a.reason,
      note: a.note,
      type: "DASHBOARD",
      patient: {
        ...a.patient,
        img: a.patient.img ?? undefined,
        color_code: a.patient.color_code ?? undefined,
      } as DashboardPatient,
      doctor: {
        ...a.doctor,
        img: a.doctor.img ?? undefined,
        color_code: a.doctor.color_code ?? undefined,
      } as DashboardDoctor,
    }));

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );
    const last5Records = appointments.slice(0, 5);

    const today = daysOfWeek[new Date().getDay()];
    const availableDoctorRaw = await db.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        img: true,
        working_days: true,
        color_code: true,
      },
      where: {
        working_days: { some: { day: { equals: today, mode: "insensitive" } } },
      },
      take: 4,
    });

    const availableDoctors: AvailableDoctorProps = availableDoctorRaw.map(
      (d) => ({
        id: d.id,
        name: d.name,
        specialization: d.specialization,
        img: d.img ?? undefined,
        color_code: d.color_code ?? undefined,
        working_days: d.working_days.map((w) => ({
          day: w.day,
          start_time: w.start_time,
          close_time: w.close_time,
        })),
      })
    );

    return {
      success: true,
      error: false,
      status: 200,
      data: {
        ...patient,
        img: patient.img ?? undefined,
        colorCode: patient.color_code ?? undefined,
        appointmentCounts,
        last5Records,
        totalAppointments: appointments.length,
        availableDoctors,
        monthlyData,
      },
    };
  } catch (error) {
    console.error("getPatientDashboardStatistics error:", error);
    return {
      success: false,
      error: true,
      message: "Internal Server Error",
      status: 500,
      data: null,
    };
  }
}

// --------------------- Get Patient by ID ---------------------
export async function getPatientById(id: string) {
  try {
    const patient = await db.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return {
        success: false,
        message: "Patient data not found",
        status: 200,
        data: null,
      };
    }

    return { success: true, data: patient, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

// --------------------- Get Full Patient Data ---------------------
export async function getPatientFullDataById(
  patientId: string
): Promise<ServiceResponse<FullPatientData>> {
  try {
    if (!patientId) {
      return {
        success: false,
        error: true,
        message: "Patient ID is required",
        status: 400,
        data: null,
      };
    }

    const patientData = await db.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        date_of_birth: true,
        gender: true,
        phone: true,
        email: true,
        marital_status: true,
        address: true,
        emergency_contact_name: true,
        emergency_contact_number: true,
        relation: true,
        blood_group: true,
        allergies: true,
        medical_conditions: true,
        medical_history: true,
        insurance_provider: true,
        insurance_number: true,
        privacy_consent: true,
        service_consent: true,
        medical_consent: true,
        img: true,
        color_code: true,
        created_at: true,
        updated_at: true,
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
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
            color_code: true,
          },
        },
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            gender: true,
            img: true,
            color_code: true,
          },
        },
      },
      orderBy: { appointment_date: "desc" },
    });

    const appointments: DashboardAppointment[] = appointmentsRaw.map((a) => ({
      id: a.id,
      patient_id: a.patient_id,
      doctor_id: a.doctor_id,
      appointment_date: a.appointment_date,
      time: a.time,
      status: a.status as AppointmentStatus,
      reason: a.reason,
      note: a.note,
      type: "DASHBOARD",
      patient: {
        ...a.patient,
        img: a.patient.img ?? undefined,
        color_code: a.patient.color_code ?? undefined,
      } as DashboardPatient,
      doctor: {
        ...a.doctor,
        img: a.doctor.img ?? undefined,
        color_code: a.doctor.color_code ?? undefined,
      } as DashboardDoctor,
    }));

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );
    const last5Records = appointments.slice(0, 5);
    const lastVisit = appointments[0]?.appointment_date ?? undefined;

    const today = daysOfWeek[new Date().getDay()];
    const availableDoctorRaw = await db.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        img: true,
        working_days: true,
        color_code: true,
      },
      where: {
        working_days: { some: { day: { equals: today, mode: "insensitive" } } },
      },
      take: 4,
    });

    const availableDoctors: AvailableDoctorProps = availableDoctorRaw.map(
      (d) => ({
        id: d.id,
        name: d.name,
        specialization: d.specialization,
        img: d.img ?? undefined,
        color_code: d.color_code ?? undefined,
        working_days: d.working_days.map((w) => ({
          day: w.day,
          start_time: w.start_time,
          close_time: w.close_time,
        })),
      })
    );

    return {
      success: true,
      error: false,
      status: 200,
      data: {
        ...patientData,
        email: patientData.email ?? undefined,
        phone: patientData.phone ?? undefined,
        marital_status: patientData.marital_status ?? undefined,
        address: patientData.address ?? undefined,
        emergency_contact_name: patientData.emergency_contact_name ?? undefined,
        emergency_contact_number:
          patientData.emergency_contact_number ?? undefined,
        relation: patientData.relation ?? undefined,
        blood_group: patientData.blood_group ?? undefined,
        allergies: patientData.allergies ?? undefined,
        medical_conditions: patientData.medical_conditions ?? undefined,
        medical_history: patientData.medical_history ?? undefined,
        insurance_provider: patientData.insurance_provider ?? undefined,
        insurance_number: patientData.insurance_number ?? undefined,
        img: patientData.img ?? undefined,
        colorCode: patientData.color_code ?? undefined,
        appointmentCounts,
        last5Records,
        totalAppointments: appointments.length,
        availableDoctors,
        monthlyData,
        lastVisit,
      },
    };
  } catch (error) {
    console.error("getPatientFullDataById error:", error);
    return {
      success: false,
      error: true,
      message: "Internal Server Error",
      status: 500,
      data: null,
    };
  }
}

// --------------------- Process Appointments ---------------------
interface MonthlyData {
  name: string;
  appointment: number;
  completed: number;
}

export const processAppointments = async (
  appointments: DashboardAppointment[]
): Promise<{
  appointmentCounts: Record<AppointmentStatus | "TODAY", number>;
  monthlyData: MonthlyData[];
}> => {
  const thisYear = new Date().getFullYear();
  const monthlyData: MonthlyData[] = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, i) => ({
      name: format(new Date(thisYear, i), "MMM"),
      appointment: 0,
      completed: 0,
    })
  );

  const appointmentCounts = appointments.reduce<
    Record<AppointmentStatus | "TODAY", number>
  >((acc, appt) => {
    const status = appt.status as AppointmentStatus;
    const appointmentDate = new Date(appt.appointment_date);
    const monthIndex = getMonth(appointmentDate);

    if (
      appointmentDate >= startOfYear(new Date()) &&
      appointmentDate <= endOfMonth(new Date())
    ) {
      monthlyData[monthIndex].appointment += 1;
      if (status === "COMPLETED") monthlyData[monthIndex].completed += 1;
    }

    if (isToday(appointmentDate)) acc["TODAY"] = (acc["TODAY"] || 0) + 1;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, Object.fromEntries([...Object.values(AppointmentStatus), "TODAY"].map((k) => [k, 0])) as Record<AppointmentStatus | "TODAY", number>);

  return { appointmentCounts, monthlyData };
};
