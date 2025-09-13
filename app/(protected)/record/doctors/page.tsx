// app/(protected)/record/doctors/page.tsx
import { ActionDialog } from "@/components/ActionDialog";
import { ViewAction } from "@/components/ActionOptions";
import { Pagination } from "@/components/Pagination";
import { ProfileImage } from "@/components/ProfileImage";
import { Table } from "@/components/tables/Table";
import { SearchParamsProps } from "@/types";
import { checkRole } from "@/utils/roles";
import { DATA_LIMIT } from "@/utils/settings";
import { getAllDoctors } from "@/utils/services/doctor";
import { Doctor } from "@prisma/client";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { DoctorsToolbar } from "@/components/filters/DoctorsToolbar";

const columns = [
  { header: "Info", key: "name" },
  { header: "License #", key: "license", className: "hidden md:table-cell" },
  { header: "Phone", key: "contact", className: "hidden md:table-cell" },
  { header: "Email", key: "email", className: "hidden lg:table-cell" },
  { header: "Joined Date", key: "created_at", className: "hidden xl:table-cell" },
  { header: "Actions", key: "action" },
];

const DoctorsList = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;

  const { data, totalPages, totalRecords, currentPage } = await getAllDoctors({
    page,
    search: searchQuery,
  });

  if (!data) return null;
  const isAdmin = await checkRole("ADMIN");

  const renderRow = (item: Doctor) => (
    <tr
      key={item?.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
    >
      <td className="flex items-center gap-4 p-4">
        <ProfileImage
          url={item?.img!}
          name={item?.name}
          bgColor={item?.colorCode!}
          textClassName="text-black"
        />
        <div>
          <h3 className="uppercase">{item?.name}</h3>
          <span className="text-sm capitalize">{item?.specialization}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">{item?.license_number}</td>
      <td className="hidden md:table-cell">{item?.phone}</td>
      <td className="hidden lg:table-cell">{item?.email}</td>
      <td className="hidden xl:table-cell">
        {format(item?.created_at, "yyyy-MM-dd")}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <ViewAction href={`doctors/${item?.id}`} />
          {isAdmin && (
            <ActionDialog type="delete" id={item?.id} deleteType="doctor" />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <Users size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecords ?? 0}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total doctors
          </span>
        </div>

        {/* ✅ Use Toolbar */}
        <DoctorsToolbar isAdmin={isAdmin} />
      </div>

      <div className="mt-4">
        <Table columns={columns} data={data} renderRow={renderRow} />

        {totalPages && (
          <Pagination
            totalPages={totalPages ?? 1}
            currentPage={currentPage ?? 1}
            totalRecords={totalRecords ?? 0}
            limit={DATA_LIMIT}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
