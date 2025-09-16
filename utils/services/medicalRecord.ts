// utils/services/medicalRecord.ts
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface TableMedicalRecord {
  index: number;
  id: string;
  appointment_id: string;
  created_at: Date;
  doctor_name: string; // store doctor name instead of ID
  patient: {
    first_name: string;
    last_name: string;
    date_of_birth?: Date;
    img: string;
    colorCode: string;
    gender: string;
  };
  diagnosis: any[];
  lab_test: any[];
}

interface ServiceResponse<T> {
  success: boolean;
  error?: boolean;
  status: number;
  message?: string;
  data?: T;
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
}

export async function getMedicalRecords({
  page,
  limit,
  search,
}: {
  page: number | string;
  limit?: number | string;
  search?: string;
}): Promise<ServiceResponse<TableMedicalRecord[]>> {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const where: Prisma.MedicalRecordsWhereInput = search
      ? {
          OR: [
            { patient: { first_name: { contains: search, mode: "insensitive" } } },
            { patient: { last_name: { contains: search, mode: "insensitive" } } },
            { patient_id: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [records, totalRecords] = await Promise.all([
      db.medicalRecords.findMany({
        where,
        include: {
          patient: {
            select: {
              first_name: true,
              last_name: true,
              date_of_birth: true,
              img: true,
              colorCode: true,
              gender: true,
            },
          },
          diagnosis: {
            include: {
              doctor: {
                select: { name: true, specialization: true, img: true, colorCode: true },
              },
            },
          },
          lab_test: true,
        },
        skip: SKIP,
        take: LIMIT,
        orderBy: { created_at: "desc" },
      }),
      db.medicalRecords.count({ where }),
    ]);

    const totalPages = Math.ceil(totalRecords / LIMIT);

    // Normalize data to match TableMedicalRecord type
    const normalizedData: TableMedicalRecord[] = records.map((r, index) => ({
      index,
      id: r.id.toString(),                  // convert number -> string
      appointment_id: r.appointment_id.toString(), // convert number -> string
      created_at: new Date(r.created_at),
      doctor_name: r.diagnosis?.[0]?.doctor?.name ?? "-", // first doctor
      patient: {
        first_name: r.patient.first_name,
        last_name: r.patient.last_name,
        date_of_birth: r.patient.date_of_birth ?? undefined,
        img: r.patient.img ?? "",
        colorCode: r.patient.colorCode ?? "#ccc",
        gender: r.patient.gender,
      },
      diagnosis: r.diagnosis ?? [],
      lab_test: r.lab_test ?? [],
    }));

    return {
      success: true,
      data: normalizedData,
      totalRecords,
      totalPages,
      currentPage: PAGE_NUMBER,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
