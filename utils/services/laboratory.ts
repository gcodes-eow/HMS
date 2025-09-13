// utils/services/laboratory.ts
import db from "@/lib/db";
import { LabTest } from "@/types/dataTypes";

export interface LabTestFilters {
  status?: string;
  patient_id?: string;
  technician_id?: string;
  service_id?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================
// Dashboard statistics
// ==========================
export async function getLabStats() {
  try {
    const [total, completed, pending, inProgress] = await Promise.all([
      db.labTest.count(),
      db.labTest.count({ where: { status: "COMPLETED" } }),
      db.labTest.count({ where: { status: "PENDING" } }),
      db.labTest.count({ where: { status: "IN_PROGRESS" } }),
    ]);
    return { total, completed, pending, inProgress };
  } catch (error) {
    console.error("❌ Error fetching lab stats:", error);
    return { total: 0, completed: 0, pending: 0, inProgress: 0 };
  }
}

// ==========================
// Helper to map Prisma LabTest to frontend LabTest type
// ==========================
function mapLabTest(lt: any): LabTest {
  return {
    id: lt.id,
    test_date: lt.test_date,
    result: lt.result ?? undefined,
    status: lt.status,
    service_id: lt.service_id ?? undefined,
    services: lt.services
      ? { id: lt.services.id, service_name: lt.services.service_name }
      : undefined,
    technician: lt.technician
      ? { id: lt.technician.id, name: lt.technician.name }
      : null,
    medical_record: {
      id: lt.medical_record.id,
      patient: lt.medical_record.patient,
    },
  };
}

// ==========================
// Recent Lab Tests
// ==========================
export async function getRecentLabTests(limit = 5): Promise<LabTest[]> {
  try {
    const raw = await db.labTest.findMany({
      take: limit,
      orderBy: { test_date: "desc" },
      include: {
        services: true,
        medical_record: { include: { patient: true } },
        technician: true,
      },
    });
    return raw.map(mapLabTest);
  } catch (error) {
    console.error("❌ Error fetching recent lab tests:", error);
    return [];
  }
}

// ==========================
// Patient Lab Tests
// ==========================
export async function getPatientLabTests(patientId: string): Promise<LabTest[]> {
  try {
    const raw = await db.labTest.findMany({
      where: { medical_record: { patient_id: patientId } },
      orderBy: { test_date: "desc" },
      include: {
        services: true,
        technician: true,
        medical_record: { include: { patient: true } },
      },
    });
    return raw.map(mapLabTest);
  } catch (error) {
    console.error(`❌ Error fetching lab tests for patient ${patientId}:`, error);
    return [];
  }
}

// ==========================
// Technician Lab Tests
// ==========================
export async function getTechnicianLabTests(technicianId: string): Promise<LabTest[]> {
  try {
    const raw = await db.labTest.findMany({
      where: { technician_id: technicianId },
      orderBy: { test_date: "desc" },
      include: {
        services: true,
        medical_record: { include: { patient: true } },
        technician: true,
      },
    });
    return raw.map(mapLabTest);
  } catch (error) {
    console.error(`❌ Error fetching lab tests for technician ${technicianId}:`, error);
    return [];
  }
}

// ==========================
// Paginated Lab Tests
// ==========================
export async function getAllLabTestsPaginated(
  page = 1,
  limit = 10,
  filters: LabTestFilters = {}
): Promise<{
  data: LabTest[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}> {
  try {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.patient_id) where.medical_record = { patient_id: filters.patient_id };
    if (filters.technician_id) where.technician_id = filters.technician_id;
    if (filters.service_id) where.service_id = Number(filters.service_id);

    if (filters.startDate || filters.endDate) {
      where.test_date = {};
      if (filters.startDate) where.test_date.gte = new Date(filters.startDate);
      if (filters.endDate) where.test_date.lte = new Date(filters.endDate);
    }

    const totalRecords = await db.labTest.count({ where });

    const raw = await db.labTest.findMany({
      where,
      orderBy: { test_date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        services: true,
        technician: true,
        medical_record: { include: { patient: true } },
      },
    });

    const labTests = raw.map(mapLabTest);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: labTests,
      totalRecords,
      totalPages,
      currentPage: page,
      limit,
    };
  } catch (error) {
    console.error("❌ Error fetching paginated lab tests:", error);
    return { data: [], totalRecords: 0, totalPages: 0, currentPage: page, limit };
  }
}
