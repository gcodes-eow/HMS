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
    color_code: string;
    gender: string;
  };
  diagnosis: any[];
  lab_test: any[];
}

export interface TableMedicationRecord {
  id: string;
  medication: string;
  dosage: string;
  administeredAt: Date;
  notes?: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  nurse: {
    name: string;
  };
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
            {
              patient: {
                first_name: { contains: search, mode: "insensitive" },
              },
            },
            {
              patient: {
                last_name: { contains: search, mode: "insensitive" },
              },
            },
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
              color_code: true,
              gender: true,
            },
          },
          diagnosis: {
            include: {
              doctor: {
                select: {
                  name: true,
                  specialization: true,
                  img: true,
                  color_code: true,
                },
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
      id: r.id.toString(),
      appointment_id: r.appointment_id.toString(),
      created_at: new Date(r.created_at),
      doctor_name: r.diagnosis?.[0]?.doctor?.name ?? "-",
      patient: {
        first_name: r.patient.first_name,
        last_name: r.patient.last_name,
        date_of_birth: r.patient.date_of_birth ?? undefined,
        img: r.patient.img ?? "",
        colorCode: r.patient.color_code ?? "#ccc",
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

export async function getMedicationRecords(): Promise<ServiceResponse<TableMedicationRecord[]>> {
  try {
    const data = await db.medicationAdministration.findMany({
      include: {
        patient: { select: { first_name: true, last_name: true } },
        staff: { select: { name: true } }, // replace 'nurse' with 'staff'
      },
      orderBy: { administered_at: "desc" },
    });

    const normalized: TableMedicationRecord[] = data.map((r) => ({
      id: r.id,
      medication: r.medication,
      dosage: r.dosage,
      administeredAt: r.administered_at,
      notes: r.notes ?? undefined,
      patient: {
        first_name: r.patient.first_name,
        last_name: r.patient.last_name,
      },
      nurse: { name: r.staff.name }, // map staff to 'nurse' for frontend
    }));

    return {
      success: true,
      data: normalized,
      status: 200,
      totalRecords: normalized.length,
    };
  } catch (error) {
    console.error("Error fetching medication records:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}
