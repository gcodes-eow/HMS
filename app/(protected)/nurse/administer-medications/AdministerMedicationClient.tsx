// app/(protected)/nurse/administer-medications/AdministerMedicationClient.tsx
"use client";

import { useState } from "react";
import { AdministerMedicationForm } from "@/components/forms/AdministerMedicationForm";
import { MedicationAdministration } from "@prisma/client";
import { MedicationAdministrationTable } from "@/components/tables/MedicationAdministrationTable";

interface MedicationWithRelations extends MedicationAdministration {
  nurse: { name: string | null };
  patient: { first_name: string; last_name: string };
}

interface Props {
  patients: { id: string; first_name: string; last_name: string }[];
  medications: MedicationWithRelations[];
  totalRecords: number;
  currentPage: number;
  limit: number;
}

export default function AdministerMedicationClient({
  patients,
  medications,
  totalRecords,
  currentPage,
  limit,
}: Props) {
  // Convert any `null` values from Prisma to `undefined`
  const sanitizeMedications = (data: MedicationWithRelations[]) =>
    data.map((m) => ({
      ...m,
      notes: m.notes ?? undefined,
    }));

  const [medicationData, setMedicationData] = useState(
    sanitizeMedications(medications)
  );

  const handleNewMedication = (newRecord: MedicationWithRelations) => {
    setMedicationData((prev) => [
      {
        ...newRecord,
        notes: newRecord.notes ?? undefined,
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-8">
      <AdministerMedicationForm
        patients={patients}
        onSuccess={handleNewMedication}
      />
      <MedicationAdministrationTable
        data={medicationData}
        totalRecords={totalRecords}
        currentPage={currentPage}
        limit={limit}
      />
    </div>
  );
}
