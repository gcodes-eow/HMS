// app/(protected)/record/appointments/[id]/page.tsx
import { AppointmentTable } from "@/components/tables/AppointmentTable";
import { Pagination } from "@/components/Pagination";
import { AppointmentListToolbar } from "@/components/filters/AppointmentListToolbar";
import { getPatientAppointments } from "@/utils/services/appointment";
import { getDoctors } from "@/utils/services/doctor";
import { getPatientDashboardStatistics } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/utils/roles";
import { DATA_LIMIT } from "@/utils/settings";
import { AppointmentStatus } from "@prisma/client";
import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import { AppointmentContainer } from "@/components/AppointmentContainer";

const AppointmentTableWrapper = async ({
  searchParamsPromise,
  userId,
  role,
}: {
  searchParamsPromise?: Promise<{ [key: string]: string }>;
  userId?: string;
  role: string;
}) => {
  const searchParams = await searchParamsPromise;

  const page = Number(searchParams?.p || 1);
  const query = searchParams?.q || "";
  const statusParam = searchParams?.status;

  const statusFilter =
    statusParam &&
    statusParam.toLowerCase() !== "all" &&
    ["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"].includes(
      statusParam.toUpperCase()
    )
      ? (statusParam.toUpperCase() as AppointmentStatus)
      : undefined;

  const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
  const user_id = role === "user" ? userId : searchParams?.id;

  const response = await getPatientAppointments({
    page,
    search: query,
    status: statusFilter,
    id: user_id ?? "",
    sort,
  });

  if (!response.success || !response.data || response.data.length === 0)
    return <p>No appointments found.</p>;

  return (
    <div>
      <AppointmentTable
        data={response.data}
        userId={userId ?? undefined}
        statusFilter={statusFilter}
        sortOrder={sort}
      />
      <Pagination
        totalRecords={response.totalRecords ?? 0}
        currentPage={response.currentPage ?? 1}
        totalPages={response.totalPages ?? 1}
        limit={DATA_LIMIT}
      />
    </div>
  );
};

const AppointmentsPage = async ({ searchParams }: { searchParams?: Promise<any> }) => {
  const resolvedSearchParams = await searchParams;
  const [role, { userId }] = await Promise.all([getRole(), auth()]);
  const isPatient = role === "user";

  const doctorsResponse = await getDoctors();
  const patientResponse = isPatient
    ? await getPatientDashboardStatistics(userId ?? "")
    : resolvedSearchParams?.id
    ? await getPatientDashboardStatistics(resolvedSearchParams.id)
    : undefined;

  // ✅ Fetch total count separately
  const countResponse = await getPatientAppointments({
    page: 1,
    search: "",
    id: isPatient ? userId ?? "" : resolvedSearchParams?.id ?? "",
    sort: "newest",
  });

  const totalAppointments = countResponse?.totalRecords ?? 0;

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness size={20} />
          <span className="text-2xl font-semibold">{totalAppointments}</span>
          <span className="text-gray-600">total appointments</span>
        </div>

        <div className="flex gap-2 items-center">
          {isPatient && patientResponse?.success && (
            <AppointmentContainer id={userId ?? ""} />
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

      <AppointmentTableWrapper
        searchParamsPromise={searchParams}
        userId={userId ?? ""}
        role={role}
      />
    </div>
  );
};

export default AppointmentsPage;
