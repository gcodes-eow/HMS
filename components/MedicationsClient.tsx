"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MedicationAdministration } from "@/types/dataTypes";
import { MedicationAdministrationTable } from "@/components/tables/MedicationAdministrationTable";
import ToggleMedicationFormButton from "@/components/ToggleMedicationFormButton";
import { AdministerMedicationForm } from "@/components/forms/AdministerMedicationForm";
import { Pagination } from "@/components/Pagination";
import { getAllMedicationAdministrationsPaginated } from "@/utils/services/medicalServices";

interface Props {
  initialRecords: MedicationAdministration[];
  totalRecords: number;
  totalPages: number;
  initialPage: number;
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    gender?: string;
    img?: string;
    colorCode?: string;
  }[];
  staff: { id: string; name: string; role: string }[];
}

export default function MedicationsClient({
  initialRecords,
  totalRecords,
  totalPages,
  initialPage,
  patients,
  staff,
}: Props) {
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<MedicationAdministration[]>(initialRecords);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pages, setPages] = useState(totalPages);

  useEffect(() => {
    const page = Number(searchParams.get("p") ?? 1);
    setCurrentPage(page);
    fetchPage(page);
  }, [searchParams]);

  const fetchPage = async (page: number) => {
    const res = await getAllMedicationAdministrationsPaginated(page, 10);
    setRecords(res.data ?? []);
    setPages(res.totalPages);
  };

  const handleSuccess = (newRecord: MedicationAdministration) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Medication Administration</h1>
        <ToggleMedicationFormButton />
      </div>

      {/* Sliding Form */}
      <div
        id="medication-form"
        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card text-card-foreground shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-50 p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Record Medication</h2>
          <ToggleMedicationFormButton close />
        </div>
        <AdministerMedicationForm patients={patients} staff={staff} onSuccess={handleSuccess} />
      </div>

      {/* Table */}
      <MedicationAdministrationTable records={records} onRefresh={() => fetchPage(currentPage)} />

      {/* Pagination */}
      <Pagination totalRecords={totalRecords} currentPage={currentPage} totalPages={pages} limit={10} />
    </div>
  );
}
