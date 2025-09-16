// app/(protected)/record/medical-records/page.tsx
import { ActionDialog } from "@/components/ActionDialog";
import { ViewAction } from "@/components/ActionOptions";
import { Pagination } from "@/components/Pagination";
import { ProfileImage } from "@/components/ProfileImage";
import SearchInput from "@/components/appointment/SearchInput";
import { Table } from "@/components/tables/Table";
import { Button } from "@/components/ui/Button";
import { SearchParamsProps } from "@/types";
import { checkRole } from "@/utils/roles";
import { DATA_LIMIT } from "@/utils/settings";
import { getMedicalRecords, TableMedicalRecord } from "@/utils/services/medicalRecord";
import { format } from "date-fns";
import { BriefcaseBusiness } from "lucide-react";
import { normalizeMedicalRecordsData } from "@/utils/normalizeTableData";
import React from "react";

const columns = [
  { header: "No", key: "no" },
  { header: "Info", key: "name" },
  { header: "Date & Time", key: "medical_date", className: "hidden md:table-cell" },
  { header: "Doctor", key: "doctor", className: "hidden 2xl:table-cell" },
  { header: "Diagnosis", key: "diagnosis", className: "hidden lg:table-cell" },
  { header: "Lab Test", key: "lab_test", className: "hidden 2xl:table-cell" },
  { header: "Action", key: "action" },
];

const MedicalRecordsPage = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;

  const { data, totalPages, totalRecords, currentPage } = await getMedicalRecords({ page, search: searchQuery });
  if (!data) return null;

  const isAdmin = await checkRole("ADMIN");

  const normalizedData: TableMedicalRecord[] = normalizeMedicalRecordsData(data);

  const renderRow = (item: TableMedicalRecord) => {
    const name = `${item.patient.first_name} ${item.patient.last_name}`;

    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50">
        <td className="flex items-center gap-4 p-4">
          <ProfileImage
            url={item.patient.img}
            name={name}
            bgColor={item.patient.colorCode}
            textClassName="text-black"
          />
          <div>
            <h3 className="uppercase">{name}</h3>
            <span className="text-sm capitalize">{item.patient.gender}</span>
          </div>
        </td>
        <td className="hidden md:table-cell">{format(item.created_at, "yyyy-MM-dd HH:mm:ss")}</td>
        <td className="hidden 2xl:table-cell">{item.doctor_name}</td> {/* updated to doctor_name */}
        <td className="hidden lg:table-cell">
          {item.diagnosis.length ? item.diagnosis.length : <span className="text-gray-400 italic">No diagnosis found</span>}
        </td>
        <td className="hidden xl:table-cell">
          {item.lab_test.length ? item.lab_test.length : <span className="text-gray-400 italic">No lab found</span>}
        </td>
        <td>
          <div className="flex items-center gap-2">
            <ViewAction href={`/appointments/${item.appointment_id}`} />
            {isAdmin && (
              <ActionDialog type="delete" id={item.id} deleteType="medicalRecord">
                <Button variant="destructive" size="sm">Delete</Button>
              </ActionDialog>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <BriefcaseBusiness size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecords}</p>
          <span className="text-gray-600 text-sm xl:text-base">total records</span>
        </div>
        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
        </div>
      </div>

      <div className="mt-4">
        <Table columns={columns} data={normalizedData} renderRow={renderRow} />
        <Pagination
          totalPages={totalPages ?? 1}
          currentPage={currentPage ?? 1}
          totalRecords={totalRecords ?? 0}
          limit={DATA_LIMIT}
        />
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
