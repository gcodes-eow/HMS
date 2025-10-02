// utils/services/nurse.ts
import db from "@/lib/db";

export interface MedicationRecordInput {
  patientId: string;
  staffId: string;       // Prisma field is staffId
  medication: string;
  dosage: string;
  administeredAt: Date;
  notes?: string;
}

/**
 * Create a new medication administration record
 */
export async function createMedicationRecord(data: MedicationRecordInput) {
  return db.medicationAdministration.create({
    data: {
      patient_id: data.patientId,
      staff_id: data.staffId,        // Prisma expects staffId
      medication: data.medication,
      dosage: data.dosage,
      administered_at: data.administeredAt,
      notes: data.notes,
    },
  });
}

/**
 * Medication record returned to the frontend
 * Maps the staff relation to `nurse` for clarity
 */
export interface MedicationRecordWithNurse {
  id: string;
  patientId: string;
  doctorId: string | null;
  staffId: string;
  nurse: { id: string; name: string; email: string };
  medication: string;
  dosage: string;
  notes: string | null;
  administeredAt: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get all medications administered to a specific patient
 */
export async function getMedicationsForPatient(
  patient_id: string
): Promise<MedicationRecordWithNurse[]> {
  const records = await db.medicationAdministration.findMany({
    where: { patient_id },
    orderBy: { administered_at: "desc" },
    include: {
      staff: {
        select: { id: true, name: true, email: true }, // Prisma relation is `staff`
      },
    },
  });

  // Map `staff` to `nurse` for frontend consistency
  return records.map(r => ({
    ...r,
    id: r.id.toString(),
    nurse: r.staff ?? { id: "", name: "Unknown", email: "" },
  }));
}

/**
 * Get all patients assigned to a specific nurse
 */
export async function getPatientsAssignedToNurse(staffId: string) {
  return db.patient.findMany({
    where: { medicationRecords: { some: { staffId } } },
    include: {
      medical: { orderBy: { created_at: "desc" }, take: 1 }, // latest medical record
    },
  });
}

/**
 * Normalized wrapper for nurse patient management
 * Returns patients with last medication info
 */
export async function getNursePatients(staffId: string) {
  const patients = await getPatientsAssignedToNurse(staffId);

  return patients.map((p) => {
    const age = p.date_of_birth
      ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / 31557600000)
      : 0;
    const lastRecord = p.medical?.[0] ?? null;

    return {
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      age,
      ward: p.address ?? "N/A",
      lastMedication: lastRecord?.treatment_plan ?? null,
    };
  });
}
