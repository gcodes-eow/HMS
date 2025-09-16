// components/tables/AppointmentTable.tsx
import React from "react";
import { Table } from "./Table";
import { ProfileImage } from "../ProfileImage";
import { AppointmentStatusIndicator } from "../AppointmentStatusIndicator";
import { ViewAppointment } from "../ViewAppointment";
import { AppointmentActionOptions } from "../AppointmentActions";
import { format } from "date-fns";
import { Appointment, DashboardAppointment, AppointmentStatus } from "@/types/dataTypes";

type AppointmentItem = Appointment | DashboardAppointment;

interface AppointmentTableProps {
  data: AppointmentItem[];
  userId?: string;
  isAdmin?: boolean;
  showActions?: boolean;
  statusFilter?: AppointmentStatus;
  sortOrder?: "newest" | "oldest";
}

const columns = [
  { header: "Info", key: "name" },
  { header: "Date", key: "appointment_date", className: "hidden md:table-cell" },
  { header: "Time", key: "time", className: "hidden md:table-cell" },
  { header: "Doctor", key: "doctor", className: "hidden md:table-cell" },
  { header: "Status", key: "status", className: "hidden xl:table-cell" },
  { header: "Actions", key: "action" },
];

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  data,
  userId,
  isAdmin = false,
  showActions = true,
  statusFilter,
  sortOrder,
}) => {
  const formatDateSafe = (dateValue?: string | Date) => {
    if (!dateValue) return "";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
  };

  let filteredData = statusFilter
    ? data.filter((item) => item.status === statusFilter)
    : data;

  if (sortOrder) {
    filteredData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.appointment_date).getTime();
      const dateB = new Date(b.appointment_date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }

  const renderRow = (item: AppointmentItem) => {
    const patientName = `${item.patient.first_name} ${item.patient.last_name}`;
    const doctorName = item.doctor?.name ?? "";
    const doctorSpecialization = item.doctor?.specialization ?? "";

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        {/* Patient Info */}
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item.patient.img ?? undefined}
            name={patientName}
            bgColor={item.patient.colorCode ?? undefined}
          />
          <div>
            <h3 className="font-semibold uppercase">{patientName}</h3>
            <span className="text-xs md:text-sm capitalize">
              {item.patient.gender.toLowerCase()}
            </span>
          </div>
        </td>

        {/* Date & Time */}
        <td className="hidden md:table-cell">{formatDateSafe(item.appointment_date)}</td>
        <td className="hidden md:table-cell">{item.time ?? ""}</td>

        {/* Doctor Info */}
        <td className="hidden md:table-cell flex items-center gap-2 md:gap-4 py-2">
          <ProfileImage
            url={item.doctor?.img ?? undefined}
            name={doctorName}
            bgColor={item.doctor?.colorCode ?? undefined}
            textClassName="text-black"
          />
          <div>
            <h3 className="font-semibold uppercase">{doctorName}</h3>
            <span className="text-xs md:text-sm capitalize">{doctorSpecialization}</span>
          </div>
        </td>

        {/* Status */}
        <td className="hidden xl:table-cell">
          <AppointmentStatusIndicator status={item.status} />
        </td>

        {/* Actions */}
        <td>
          {showActions && userId && (
            <div className="flex items-center gap-2">
              <ViewAppointment id={item.id.toString()} />
              <AppointmentActionOptions
                userId={userId}
                patientId={item.patient_id ?? ""}
                doctorId={item.doctor_id ?? ""}
                status={item.status}
                appointmentId={item.id}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </td>
      </tr>
    );
  };

  return <Table columns={columns} renderRow={renderRow} data={filteredData} />;
};
