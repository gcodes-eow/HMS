import React from "react";
import { Table } from "./Table";
import { ProfileImage } from "../ProfileImage";
import { AppointmentStatusIndicator } from "../AppointmentStatusIndicator";
import { ViewAppointment } from "../ViewAppointment";
import { AppointmentActionOptions } from "../AppointmentActions";
import { format } from "date-fns";
import type { DashboardAppointment, AppointmentStatus } from "@/types/dataTypes";

interface AppointmentTableProps {
  data: DashboardAppointment[];
  userId?: string;
  isAdmin?: boolean;
  showActions?: boolean;
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
}) => {
  const formatDateSafe = (dateValue?: string | Date) => {
    if (!dateValue) return "";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
  };

  const renderRow = (item: DashboardAppointment) => {
    const patientName = `${item.patient.first_name} ${item.patient.last_name}`;
    const doctorName = item.doctor?.name ?? "";
    const doctorSpecialization = item.doctor?.specialization ?? "";

    return (
      <tr
        key={item.id}
        className="border-b border-border even:bg-muted text-sm hover:bg-accent dark:border-border-dark dark:even:bg-muted-dark dark:hover:bg-accent-dark"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item.patient.img ?? undefined}
            name={patientName}
            bgColor={item.patient.colorCode ?? undefined}
          />
          <div>
            <h3 className="font-semibold uppercase text-foreground dark:text-foreground-dark">{patientName}</h3>
            <span className="text-xs md:text-sm capitalize text-muted-foreground dark:text-muted-foreground-dark">
              {item.patient.gender.toLowerCase()}
            </span>
          </div>
        </td>

        <td className="hidden md:table-cell text-foreground dark:text-foreground-dark">{formatDateSafe(item.appointment_date)}</td>
        <td className="hidden md:table-cell text-foreground dark:text-foreground-dark">{item.time}</td>

        <td className="hidden md:flex items-center gap-2 md:gap-4 py-2">
          <ProfileImage
            url={item.doctor?.img ?? undefined}
            name={doctorName}
            bgColor={item.doctor?.colorCode ?? undefined}
            textClassName="text-foreground dark:text-foreground-dark"
          />
          <div>
            <h3 className="font-semibold uppercase text-foreground dark:text-foreground-dark">{doctorName}</h3>
            <span className="text-xs md:text-sm capitalize text-muted-foreground dark:text-muted-foreground-dark">{doctorSpecialization}</span>
          </div>
        </td>

        <td className="hidden xl:table-cell">
          <AppointmentStatusIndicator status={item.status as AppointmentStatus} />
        </td>

        <td>
          {showActions && userId && (
            <div className="flex items-center gap-2">
              <ViewAppointment id={item.id.toString()} />
              <AppointmentActionOptions
                userId={userId}
                patientId={item.patient_id}
                doctorId={item.doctor_id}
                status={item.status as AppointmentStatus}
                appointmentId={item.id}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </td>
      </tr>
    );
  };

  return <Table columns={columns} renderRow={renderRow} data={data} />;
};
