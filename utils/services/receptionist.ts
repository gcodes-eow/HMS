// utils/services/receptionist.ts
import db from "@/lib/db";
import { getMonth, format, startOfYear, endOfMonth } from "date-fns";
import { daysOfWeek } from "..";

type AppointmentStatus = "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

interface Appointment {
  status: AppointmentStatus;
  appointment_date: Date;
}

function isValidStatus(status: string): status is AppointmentStatus {
  return ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].includes(status);
}

const initializeMonthlyData = () => {
  const this_year = new Date().getFullYear();
  return Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, index) => ({
      name: format(new Date(this_year, index), "MMM"),
      appointment: 0,
      completed: 0,
    })
  );
};

export const processAppointments = async (appointments: Appointment[]) => {
  const monthlyData = initializeMonthlyData();

  const appointmentCounts = appointments.reduce<Record<AppointmentStatus, number>>(
    (acc, appointment) => {
      const status = appointment.status;
      const appointmentDate = appointment?.appointment_date;
      const monthIndex = getMonth(appointmentDate);

      if (
        appointmentDate >= startOfYear(new Date()) &&
        appointmentDate <= endOfMonth(new Date())
      ) {
        monthlyData[monthIndex].appointment += 1;

        if (status === "COMPLETED") {
          monthlyData[monthIndex].completed += 1;
        }
      }

      if (isValidStatus(status)) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    { PENDING: 0, SCHEDULED: 0, COMPLETED: 0, CANCELLED: 0 }
  );

  return { appointmentCounts, monthlyData };
};

export async function getReceptionistDashboardStatistics() {
  try {
    const today = daysOfWeek[new Date().getDay()];

    // All appointments for dashboard stats
    const appointments = await db.appointment.findMany({
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            img: true,
            specialization: true,
            colorCode: true,
          },
        },
        patient: {
          select: {
            first_name: true,
            last_name: true,
            gender: true,
            date_of_birth: true,
            img: true,
            colorCode: true,
          },
        },
      },
      orderBy: { appointment_date: "desc" },
    });

    const { appointmentCounts, monthlyData } = await processAppointments(appointments);

    const last5Appointments = appointments.slice(0, 5);

    const availableDoctors = await db.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        img: true,
        working_days: true,
        colorCode: true,
      },
      where: {
        working_days: {
          some: {
            day: { equals: today, mode: "insensitive" },
          },
        },
      },
      take: 4,
    });

    const totalPatients = await db.patient.count();

    // FIX: use payment model for total billing
    const totalBilling = await db.payment.aggregate({
      _sum: { amount_paid: true }, // or total_amount if you want total billed
    });

    return {
      success: true,
      appointmentCounts,
      totalPatients,
      totalAppointments: appointments.length,
      totalBilling: totalBilling._sum.amount_paid || 0,
      monthlyData,
      last5Appointments,
      availableDoctors: {
        total: availableDoctors.length,
        doctors: availableDoctors,
      },
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching receptionist dashboard stats:", error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
