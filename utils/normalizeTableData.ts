// utils/normalizeTableData.ts
import { Staff, TableStaff } from "@/utils/services/staff";
import { TableMedicalRecord } from "@/utils/services/medicalRecord";

/**
 * Adds an `index` and ensures default values for optional fields,
 * including `created_at` for TableStaff.
 */
export function normalizeStaffData(staff: Staff[]): TableStaff[] {
  return staff.map((s, index) => ({
    ...s,
    index,
    phone: s.phone ?? "",
    img: s.img ?? "",
    colorCode: s.colorCode ?? "#ccc",
    created_at: s.created_at ? new Date(s.created_at) : new Date(),
  }));
}

/**
 * Adds an `index` and ensures default values for optional fields
 * in medical records, including patient image/color and arrays.
 */
export function normalizeMedicalRecordsData(records: any[]): TableMedicalRecord[] {
  return records.map((r, index) => {
    // Get the first doctor's name if diagnosis exists, otherwise fallback to "N/A"
    const doctor_name = r.diagnosis?.[0]?.doctor?.name ?? "N/A";

    return {
      ...r,
      index,
      doctor_name,
      patient: {
        ...r.patient,
        img: r.patient?.img ?? "",
        colorCode: r.patient?.colorCode ?? "#ccc",
      },
      diagnosis: r.diagnosis ?? [],
      lab_test: r.lab_test ?? [],
    };
  });
}