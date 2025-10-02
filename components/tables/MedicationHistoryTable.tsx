"use client";

import { format } from "date-fns";

interface MedicationRecord {
  id: string;
  medication: string;
  dosage: string;
  administeredAt: Date;
  notes?: string | null;
  nurse: {
    id: string;
    name: string;
    email: string;
  };
}

interface Props {
  records: MedicationRecord[];
}

const MedicationHistoryTable = ({ records }: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border dark:border-border-dark">
      <table className="w-full text-left text-sm bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark">
        <thead className="bg-muted dark:bg-muted-dark text-muted-foreground dark:text-muted-foreground-dark">
          <tr>
            <th className="px-4 py-2">Medication</th>
            <th className="px-4 py-2">Dosage</th>
            <th className="px-4 py-2">Administered At</th>
            <th className="px-4 py-2">Nurse</th>
            <th className="px-4 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-border dark:border-border-dark hover:bg-accent dark:hover:bg-accent-dark"
            >
              <td className="px-4 py-2 font-medium">{record.medication}</td>
              <td className="px-4 py-2">{record.dosage}</td>
              <td className="px-4 py-2">{format(new Date(record.administeredAt), "PPpp")}</td>
              <td className="px-4 py-2">{record.nurse?.name || "Unknown"}</td>
              <td className="px-4 py-2">
                {record.notes || <span className="text-muted-foreground dark:text-muted-foreground-dark">—</span>}
              </td>
            </tr>
          ))}

          {records.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground dark:text-muted-foreground-dark">
                No medications recorded for this patient.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationHistoryTable;
