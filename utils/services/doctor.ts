// utils/services/doctor.ts
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";
import type { DashboardAppointment } from "@/types/dataTypes";
import type { Doctor, ServiceResponse } from "@/types/dataTypes";

export async function getDoctors(): Promise<ServiceResponse<Doctor[]>> {
  try {
    const doctors = await db.doctor.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
        license_number: true,
        phone: true,
        address: true,
        department: true,
        img: true,
        color_code: true,
        availability_status: true,
        type: true,
        created_at: true,
        updated_at: true,
      },
    });

    const normalized: Doctor[] = doctors.map((d) => ({
      ...d,
      img: d.img ?? null,
      colorCode: d.color_code ?? null,
      department: d.department ?? null,
    }));

    return {
      success: true,
      error: false,
      status: 200,
      data: normalized, // never undefined
      totalRecords: normalized.length,
    };
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return {
      success: false,
      error: true,
      status: 500,
      message: "Failed to fetch doctors",
      data: [], // force empty array instead of null or undefined
      totalRecords: 0,
    };
  }
}

export async function getDoctorDashboardStats() {
  try {
    const { userId } = await auth();
    const today = daysOfWeek[new Date().getDay()];

    const [totalPatient, totalNurses, appointments, doctors] =
      await Promise.all([
        db.patient.count(),
        db.staff.count({ where: { role: "NURSE" } }),
        db.appointment.findMany({
          where: { doctor_id: userId!, appointment_date: { lte: new Date() } },
          include: {
            patient: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                gender: true,
                date_of_birth: true,
                color_code: true,
                img: true,
              },
            },
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
                img: true,
                color_code: true,
              },
            },
          },
          orderBy: { appointment_date: "desc" },
        }),
        db.doctor.findMany({
          where: { working_days: { some: { day: { equals: today, mode: "insensitive" } } } },
          select: { id: true, name: true, specialization: true, img: true, color_code: true, working_days: true },
          take: 5,
        }),
      ]);

    const normalizedAppointments: DashboardAppointment[] = appointments.map((appt) => ({
      ...appt,
      patient: {
        ...appt.patient,
        img: appt.patient.img ?? undefined,
        colorCode: appt.patient.color_code ?? undefined,
      },
      doctor: {
        ...appt.doctor,
        img: appt.doctor.img ?? undefined,
        colorCode: appt.doctor.color_code ?? undefined,
      },
    }));

    const normalizedDoctors = doctors.map((doc) => ({
      ...doc,
      img: doc.img ?? undefined,
      colorCode: doc.color_code ?? undefined,
    }));

    const { appointmentCounts, monthlyData } = await processAppointments(normalizedAppointments);

    return {
      success: true,
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
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Internal Server Error", status: 500 };
  }
}

export async function getDoctorById(id: string) {
  try {
    const [doctor, totalAppointment] = await Promise.all([
      db.doctor.findUnique({
        where: { id },
        include: {
          working_days: true,
          appointments: {
            include: {
              patient: { select: { id: true, first_name: true, last_name: true, gender: true, img: true, color_code: true } },
              doctor: { select: { name: true, specialization: true, img: true, color_code: true } },
            },
            orderBy: { appointment_date: "desc" },
            take: 10,
          },
        },
      }),
      db.appointment.count({ where: { doctor_id: id } }),
    ]);

    if (!doctor) return { success: false, message: "Doctor not found", status: 404 };

    const normalizedDoctor = {
      ...doctor,
      img: doctor.img ?? undefined,
      colorCode: doctor.color_code ?? undefined,
      appointments: doctor.appointments.map((appt) => ({
        ...appt,
        patient: { ...appt.patient, img: appt.patient.img ?? undefined, colorCode: appt.patient.color_code ?? undefined },
        doctor: { ...appt.doctor, img: appt.doctor.img ?? undefined, colorCode: appt.doctor.color_code ?? undefined },
      })),
    };

    return { success: true, data: normalizedDoctor, totalAppointment };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getRatingById(id: string) {
  try {
    const data = await db.rating.findMany({
      where: { staff_id: id },
      include: { patient: { select: { last_name: true, first_name: true } } },
    });

    const totalRatings = data?.length ?? 0;
    const sumRatings = data?.reduce((sum, el) => sum + el.rating, 0) ?? 0;
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return {
      totalRatings,
      averageRating: (Math.round(averageRating * 10) / 10).toFixed(1),
      ratings: data,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getAllDoctors({ page, limit, search }: { page: number | string; limit?: number | string; search?: string }) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [doctors, totalRecords] = await Promise.all([
      db.doctor.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { specialization: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        include: { working_days: true },
        skip: SKIP,
        take: LIMIT,
      }),
      db.doctor.count(),
    ]);

    const normalizedDoctors = doctors.map((doc) => ({
      ...doc,
      img: doc.img ?? undefined,
      colorCode: doc.color_code ?? undefined,
    }));

    return {
      success: true,
      data: normalizedDoctors,
      totalRecords,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGE_NUMBER,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
