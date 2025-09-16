// components/tables/MedicationAdministrationTable.tsx
"use client";

import { Pagination } from "@/components/Pagination";
import { MedicationAdministration } from "@/types/dataTypes";

interface Props {
  data: (MedicationAdministration & {
    nurse: { name: string | null };
    patient: { first_name: string; last_name: string };
  })[];
  totalRecords: number;
  currentPage: number;
  limit: number;
}

export function MedicationAdministrationTable({
  data,
  totalRecords,
  currentPage,
  limit,
}: Props) {
  if (data.length === 0) {
    return <p className="text-gray-600">No medication records found.</p>;
  }

  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className="border rounded-lg shadow">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Patient</th>
            <th className="border p-2 text-left">Medication</th>
            <th className="border p-2 text-left">Dosage</th>
            <th className="border p-2 text-left">Nurse</th>
            <th className="border p-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((med) => (
            <tr key={med.id} className="hover:bg-gray-50">
              <td className="border p-2">{new Date(med.administeredAt).toLocaleString()}</td>
              <td className="border p-2">{med.patient.first_name} {med.patient.last_name}</td>
              <td className="border p-2">{med.medication}</td>
              <td className="border p-2">{med.dosage}</td>
              <td className="border p-2">{med.nurse?.name ?? "N/A"}</td>
              <td className="border p-2">{med.notes ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalRecords={totalRecords}
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
      />
    </div>
  );
}
