// components/tables/NursePatientListTable.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AddVitalSigns } from "@/components/dialogs/AddVitalSigns";

interface Patient {
  id: string;
  name: string;
  age: number;
  ward: string;
  lastMedication?: string | null;
}

interface Props {
  patients: Patient[];
}

const NursePatientListTable = ({ patients }: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Ward</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Last Medication</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="border-b last:border-none hover:bg-gray-50"
            >
              <td className="px-4 py-2 font-medium">{patient.name}</td>
              <td className="px-4 py-2">{patient.ward}</td>
              <td className="px-4 py-2">{patient.age}</td>
              <td className="px-4 py-2">{patient.lastMedication || "N/A"}</td>
              <td className="px-4 py-2 text-right flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/nurse/patient-management/${patient.id}`}>
                    View
                  </Link>
                </Button>

                {/* Add Vital Signs Dialog */}
                <AddVitalSigns
                  key={patient.id}
                  patientId={patient.id}
                  doctorId="dummy-doctor-id" // Replace with actual doctor ID if needed
                  appointmentId="0" // Optional placeholder, can be updated dynamically
                  onSuccess={() => {}}
                />

                {/* Placeholder Record Medication button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Record medication for ${patient.name}`)}
                >
                  Record Medication
                </Button>
              </td>
            </tr>
          ))}

          {patients.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NursePatientListTable;
