// app/(protected)/record/appointments/page.tsx
import { AppointmentActionOptions } from "@/components/AppointmentActions";
import { AppointmentStatusIndicator } from "@/components/AppointmentStatusIndicator";
import { ProfileImage } from "@/components/ProfileImage";
import { Table } from "@/components/tables/Table";
import { ViewAppointment } from "@/components/ViewAppointment";
import { getRole } from "@/utils/roles";
import { DATA_LIMIT } from "@/utils/settings";
import { getPatientAppointments } from "@/utils/services/appointment";
import { getDoctors } from "@/utils/services/doctor";
import { getPatientFullDataById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import {
  Appointment,
  Doctor,
  Patient,
  AppointmentStatus,
} from "@prisma/client";
import { format } from "date-fns";
import { BriefcaseBusiness } from "lucide-react";
import React from "react";
import { Pagination } from "@/components/Pagination";
import { AppointmentContainer } from "@/components/AppointmentContainer";
import { AppointmentListToolbar } from "@/components/filters/AppointmentListToolbar";
import type {
  FullPatientData,
  ServiceResponse,
} from "@/utils/services/patient";

// Table columns
const columns = [
  { header: "Info", key: "name" },
  {
    header: "Date",
    key: "appointment_date",
    className: "hidden md:table-cell",
  },
  { header: "Time", key: "time", className: "hidden md:table-cell" },
  { header: "Doctor", key: "doctor", className: "hidden md:table-cell" },
  { header: "Status", key: "status", className: "hidden xl:table-cell" },
  { header: "Actions", key: "action" },
];

interface DataProps extends Appointment {
  patient: Patient;
  doctor: Doctor;
}

const formatDateSafe = (dateValue?: string | Date) => {
  if (!dateValue) return "";
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
};

const AppointmentTable = async ({
  searchParams,
  role,
  userId,
}: {
  searchParams?: { [key: string]: string | undefined };
  role: string;
  userId: string;
}) => {
  const page = searchParams?.p || "1";
  const query = searchParams?.q || "";
  const status = (searchParams?.status as AppointmentStatus) || undefined;
  const paramId = searchParams?.id;

  const queryId = role === "admin" || role === "nurse" ? paramId : userId;

  const response = await getPatientAppointments({
    page,
    search: query,
    status,
    id: queryId ?? "",
  });

  if (!response.success || !response.data || response.data.length === 0) {
    return <p className="text-center py-4">No appointments found.</p>;
  }

  const { data, totalPages, totalRecords, currentPage } = response;

  const renderRow = (item: DataProps) => {
    const patientName = `${item.patient.first_name} ${item.patient.last_name}`;
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
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
        <td className="hidden md:table-cell">
          {formatDateSafe(item.appointment_date)}
        </td>
        <td className="hidden md:table-cell">{item.time ?? ""}</td>
        <td className="hidden md:table-cell items-center py-2">
          <div className="flex items-center gap-2 md:gap-4">
            <ProfileImage
              url={item.doctor?.img ?? undefined}
              name={item.doctor?.name}
              bgColor={item.doctor?.colorCode ?? undefined}
              textClassName="text-black"
            />
            <div>
              <h3 className="font-semibold uppercase">
                {item.doctor?.name ?? ""}
              </h3>
              <span className="text-xs md:text-sm capitalize">
                {item.doctor?.specialization ?? ""}
              </span>
            </div>
          </div>
        </td>
        <td className="hidden xl:table-cell">
          <AppointmentStatusIndicator status={item.status} />
        </td>
        <td>
          <div className="flex items-center gap-2">
            <ViewAppointment id={item.id.toString()} />
            <AppointmentActionOptions
              userId={userId}
              patientId={item.patient_id ?? undefined}
              doctorId={item.doctor_id ?? undefined}
              status={item.status}
              appointmentId={item.id}
              isAdmin={role === "admin"} // ✅ added
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination
        totalRecords={totalRecords ?? 0}
        currentPage={currentPage ?? 0}
        totalPages={totalPages ?? 0}
        limit={DATA_LIMIT}
      />
    </div>
  );
};

const AppointmentsPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const [role, { userId }] = await Promise.all([getRole(), auth()]);
  const isPatient = role === "user";

  // ✅ both responses are ServiceResponse<T>
  const doctorsResponse: ServiceResponse<Doctor[]> = await getDoctors();
  const patientResponse: ServiceResponse<FullPatientData> | undefined = isPatient
    ? await getPatientFullDataById(userId ?? "")
    : searchParams?.id
    ? await getPatientFullDataById(searchParams.id)
    : undefined;

  // ✅ total appointments depends on role
  let totalAppointments = 0;
  if (isPatient) {
    totalAppointments = patientResponse?.data?.totalAppointments ?? 0;
  } else {
    const appointmentsForAdmin = await getPatientAppointments({
      page: searchParams?.p || "1",
      search: searchParams?.q || "",
      status: (searchParams?.status as AppointmentStatus) || undefined,
      id: searchParams?.id ?? "",
    });

    totalAppointments = appointmentsForAdmin.totalRecords ?? 0;
  }

  return (
    <div className="bg-white rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="hidden lg:flex items-center gap-1">
            <BriefcaseBusiness size={20} className="text-gray-500" />
            <span className="text-2xl font-semibold">{totalAppointments}</span>
            <span className="text-gray-600 text-sm xl:text-base">
              total appointments
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full lg:w-fit">
          {isPatient && patientResponse?.success && (
            <AppointmentContainer id={userId!} />
          )}
          <AppointmentListToolbar
            searchParamKey="q"
            filterParamKey="status"
            filterPlaceholder="Filter by status"
            sortParamKey="sort"
            sortOptions={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
            ]}
            patientResponse={patientResponse}
            doctorsResponse={doctorsResponse}
            role={role}
          />
        </div>
      </div>

      <div className="mt-6">
        <AppointmentTable
          searchParams={searchParams}
          role={role}
          userId={userId!}
        />
      </div>
    </div>
  );
};

export default AppointmentsPage;
