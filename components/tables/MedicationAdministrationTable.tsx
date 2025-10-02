// components/tables/MedicationAdministrationTable.tsx
"use client";

import { MedicationAdministration } from "@/types/dataTypes";
import { Button } from "@/components/ui/Button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ViewMedication } from "@/components/dialogs/ViewMedication";
import { EditMedication } from "@/components/dialogs/EditMedication";
import { ActionDialog } from "@/components/ActionDialog";

interface Props {
  records: MedicationAdministration[];
  onRefresh: () => void;
}

export function MedicationAdministrationTable({ records, onRefresh }: Props) {
  if (!records.length) {
    return <p className="text-gray-500">No medication records found.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Patient</th>
            <th className="p-3 text-left">Staff</th>
            <th className="p-3 text-left">Medication</th>
            <th className="p-3 text-left">Dosage</th>
            <th className="p-3 text-left">Administered At</th>
            <th className="p-3 text-left">Notes</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.patientName}</td>
              <td className="p-3">
                {r.staffName} ({r.staffRole})
              </td>
              <td className="p-3">{r.medication}</td>
              <td className="p-3">{r.dosage}</td>
              <td className="p-3">
                {new Date(r.administeredAt).toLocaleString()}
              </td>
              <td className="p-3">{r.notes ?? "-"}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <ViewMedication
                    medicationId={r.id}
                    trigger={
                      <Button className="w-7 h-7 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                        <Eye size={16} />
                      </Button>
                    }
                  />
                  <EditMedication
                    medicationId={r.id}
                    onUpdated={onRefresh}
                    trigger={
                      <Button className="w-7 h-7 rounded-full bg-yellow-500 text-white hover:bg-yellow-600">
                        <Pencil size={16} />
                      </Button>
                    }
                  />
                  <ActionDialog
                    type="delete"
                    id={String(r.id)}
                    deleteType="medication"
                    onDeleted={onRefresh}
                  >
                    <Button className="w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600">
                      <Trash2 size={16} />
                    </Button>
                  </ActionDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
