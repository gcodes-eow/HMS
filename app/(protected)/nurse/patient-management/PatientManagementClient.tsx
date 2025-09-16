// app/(protected)/nurse/patient-management/PatientManagementClient.tsx
"use client";

import { useState } from "react";
import NursePatientListTable from "@/components/tables/NursePatientListTable";
import SearchInput from "@/components/appointment/SearchInput";

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

const PatientManagementClient = ({ patients }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput
          placeholder="Search patients..."
          value={search}
          onChange={(value: string) => setSearch(value)}
        />
      </div>

      <NursePatientListTable patients={filtered} />
    </div>
  );
};

export default PatientManagementClient;

