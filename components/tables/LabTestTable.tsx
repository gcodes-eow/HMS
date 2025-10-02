// components/tables/LabTestTable.tsx
"use client";

import React from "react";
import { Table } from "./Table";
import { ProfileImage } from "../ProfileImage";
import { format } from "date-fns";
import { Button } from "../ui/Button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { LabTest } from "@/types/dataTypes";
import { ViewLabTest } from "../dialogs/ViewLabTest";
import { EditLabTest } from "../dialogs/EditLabTest";
import { ActionDialog } from "../ActionDialog";

interface LabTestTableProps {
  data: LabTest[];
  showActions?: boolean;
  sortOrder?: "newest" | "oldest";
  onRefresh?: () => void;
}

const columns = [
  { header: "Patient", key: "patient" },
  { header: "Test", key: "service", className: "hidden md:table-cell" },
  { header: "Date", key: "test_date", className: "hidden md:table-cell" },
  { header: "Result", key: "result", className: "hidden xl:table-cell" },
  { header: "Status", key: "status", className: "hidden xl:table-cell" },
  { header: "Actions", key: "action" },
];

export const LabTestTable: React.FC<LabTestTableProps> = ({
  data,
  showActions = true,
  sortOrder,
  onRefresh,
}) => {
  const formatDateSafe = (dateValue?: string | Date) => {
    if (!dateValue) return "";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortOrder) return 0;
    const dateA = new Date(a.test_date).getTime();
    const dateB = new Date(b.test_date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const renderRow = (item: LabTest) => {
    const patientName = `${item.medical_record.patient.first_name} ${item.medical_record.patient.last_name}`;
    const testName = item.services?.service_name ?? "";

    const statusClasses = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };

    return (
      <tr
        key={item.id}
        className="border-b border-border even:bg-muted text-sm hover:bg-accent dark:border-border-dark dark:even:bg-muted-dark dark:hover:bg-accent-dark dark:text-foreground-dark"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item.medical_record.patient.img ?? undefined}
            name={patientName}
            bgColor={item.medical_record.patient.colorCode ?? undefined}
          />
          <div>
            <h3 className="font-semibold uppercase text-foreground dark:text-foreground-dark">{patientName}</h3>
            {item.medical_record.patient.gender && (
              <span className="text-xs md:text-sm capitalize text-muted-foreground dark:text-muted-foreground-dark">
                {item.medical_record.patient.gender.toLowerCase()}
              </span>
            )}
          </div>
        </td>

        <td className="hidden md:table-cell text-foreground dark:text-foreground-dark">{testName}</td>
        <td className="hidden md:table-cell text-foreground dark:text-foreground-dark">{formatDateSafe(item.test_date)}</td>
        <td className="hidden xl:table-cell truncate max-w-[150px] text-foreground dark:text-foreground-dark">{item.result}</td>
        <td className="hidden xl:table-cell">
          <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[item.status.toLowerCase() as keyof typeof statusClasses] ?? statusClasses.default}`}>
            {item.status}
          </span>
        </td>
        <td>
          {showActions && (
            <div className="flex items-center gap-2">
              <ViewLabTest
                labTestId={item.id}
                trigger={
                  <Button variant="primary" size="sm">
                    <Eye size={16} />
                  </Button>
                }
              />
              <EditLabTest
                labTestId={item.id}
                services={item.services ? [item.services] : []}
                onUpdated={onRefresh}
                trigger={
                  <Button variant="warning" size="sm">
                    <Pencil size={16} />
                  </Button>
                }
              />
              <ActionDialog type="delete" id={String(item.id)} deleteType="labTest" onDeleted={onRefresh}>
                <Button variant="destructive" size="sm">
                  <Trash2 size={16} />
                </Button>
              </ActionDialog>
            </div>
          )}
        </td>
      </tr>
    );
  };

  return <Table columns={columns} renderRow={renderRow} data={sortedData} />;
};
