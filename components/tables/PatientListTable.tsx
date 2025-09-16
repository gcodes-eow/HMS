// components/tables/PatientListTable.tsx
"use client";

import { Table } from "./Table";
import { ProfileImage } from "../ProfileImage";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ActionDialog } from "../ActionDialog";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  gender?: string;
  img?: string;
};

interface Props {
  data: Patient[];
  onDeleted?: () => void; // callback for refreshing after delete
}

const columns = [
  { header: "Name", key: "name" },
  { header: "Phone", key: "phone" },
  { header: "Email", key: "email", className: "hidden md:table-cell" },
  { header: "Actions", key: "actions" },
];

export const PatientListTable = ({ data, onDeleted }: Props) => {
  const renderRow = (patient: Patient) => {
    const name = `${patient.first_name} ${patient.last_name}`;

    return (
      <tr
        key={patient.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        <td className="flex items-center gap-2 py-2 font-medium">
          <ProfileImage
            url={patient.img}
            name={name}
            bgColor="#6b46c1"
            className="bg-violet-600"
          />
          {name}
        </td>
        <td className="py-2">{patient.phone}</td>
        <td className="hidden md:table-cell py-2">
          {patient.email || "-"}
        </td>
        <td className="py-2">
          <div className="flex gap-2">
            {/* View */}
            <Link href={`/record/patients/${patient.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600">
                <Eye size={16} />
              </button>
            </Link>

            {/* Edit */}
            <Link href={`/patient/registration?edit=${patient.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-500 text-white hover:bg-yellow-600">
                <Pencil size={16} />
              </button>
            </Link>

            {/* Delete */}
            <ActionDialog
              type="delete"
              id={String(patient.id)}
              deleteType="patient"
              onDeleted={onDeleted} // refresh after delete
            >
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                <Trash2 size={16} />
              </button>
            </ActionDialog>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="mt-4 bg-white rounded-xl p-4">
      <Table columns={columns} data={data} renderRow={renderRow} />
    </div>
  );
};
