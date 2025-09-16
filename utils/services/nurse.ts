// utils/services/nurse.ts
import db from "@/lib/db";

/**
 * Create a new medication administration record
 */
export async function createMedicationRecord(data: {
  patientId: string;
  nurseId: string;
  medication: string;
  dosage: string;
  administeredAt: Date;
  notes?: string;
}) {
  return db.medicationAdministration.create({ data });
}

/**
 * Get all medications administered to a specific patient
 */
export async function getMedicationsForPatient(patientId: string) {
  return db.medicationAdministration.findMany({
    where: { patientId },
    orderBy: { administeredAt: "desc" },
    include: {
      nurse: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

/**
 * Get all patients assigned to a specific nurse
 * Use medicationRecords relation instead of `assignedNurseId`
 */
export async function getPatientsAssignedToNurse(nurseId: string) {
  return db.patient.findMany({
    where: { medicationRecords: { some: { nurseId } } },
    include: {
      medical: { orderBy: { created_at: "desc" }, take: 1 }, // latest medical record
    },
  });
}

/**
 * Normalized wrapper for nurse patient management
 * Returns patients with last medication info
 */
export async function getNursePatients(nurseId: string) {
  const patients = await getPatientsAssignedToNurse(nurseId);

  return patients.map((p) => {
    const age = p.date_of_birth
      ? Math.floor(
          (Date.now() - new Date(p.date_of_birth).getTime()) / 31557600000
        )
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
