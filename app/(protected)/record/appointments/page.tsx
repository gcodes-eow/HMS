// app/(protected)/record/appointments/page.tsx
import { AppointmentContainer } from "@/components/AppointmentContainer";
import { AppointmentListToolbar } from "@/components/filters/AppointmentListToolbar";
import { AppointmentTable } from "@/components/tables/AppointmentTable";
import { Pagination } from "@/components/Pagination";
import { getRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { getPatientFullDataById, ServiceResponse } from "@/utils/services/patient";
import { getPatientAppointments } from "@/utils/services/appointment";
import { getDoctors } from "@/utils/services/doctor";
import { getAllPatients } from "@/app/actions/patient";
import { Doctor, AppointmentStatus } from "@prisma/client";
import React from "react";

import type { FullPatientData, AppointmentWithRelations, DashboardAppointment, Patient } from "@/types/dataTypes";

type RowData = AppointmentWithRelations | DashboardAppointment;

// Normalize helpers
const normalizePatient = (p: any): Patient => ({
  ...p,
  email: p.email ?? undefined,
  img: p.img ?? undefined,
  colorCode: p.colorCode ?? undefined,
});

const normalizeDoctor = (d: any) => ({
  ...d,
  img: d.img ?? undefined,
  colorCode: d.colorCode ?? undefined,
});

const AppointmentsPage = async ({ searchParams }: { searchParams?: any }) => {
  const resolvedSearchParams = await searchParams;

  const [role, { userId }] = await Promise.all([getRole(), auth()]);
  const isPatient = role === "user";

  // Fetch doctors
  const doctorsResponse: ServiceResponse<Doctor[]> = await getDoctors();
  const normalizedDoctors: Doctor[] = (doctorsResponse.data ?? []).map(normalizeDoctor);

  // Fetch all patients for admin/staff
  const allPatientsResponse = !isPatient ? await getAllPatients() : undefined;
  const allPatients: Patient[] = (allPatientsResponse?.data ?? []).map(normalizePatient);

  // Fetch patient if needed
  const patientResponse: ServiceResponse<FullPatientData> | undefined = isPatient
    ? await getPatientFullDataById(userId!)
    : resolvedSearchParams?.id
    ? await getPatientFullDataById(resolvedSearchParams.id)
    : undefined;

  const page = parseInt(resolvedSearchParams?.p || "1", 10);
  const query = resolvedSearchParams?.q || "";
  const status = (resolvedSearchParams?.status as AppointmentStatus) || undefined;
  const queryId = isPatient ? userId : resolvedSearchParams?.id;

  // Fetch appointments
  const appointmentsResponse = await getPatientAppointments({
    page: page.toString(),
    search: query,
    status,
    id: queryId ?? "",
  });

  // Normalize appointment data
  const data: RowData[] = (appointmentsResponse.data ?? []).map((appt) => ({
    ...appt,
    patient: normalizePatient(appt.patient),
    doctor: normalizeDoctor(appt.doctor),
  }));

  const totalAppointments = isPatient
    ? patientResponse?.data?.totalAppointments ?? 0
    : appointmentsResponse.totalRecords ?? 0;

  // Extract patients from appointments for patient view
  const patientsFromAppointments: Patient[] =
    (appointmentsResponse.data ?? []).map((appt) => normalizePatient(appt.patient));

  return (
    <div className="bg-white rounded-xl p-2 md:p-4 2xl:p-6">
      {/* Toolbar & Book Appointment */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-2xl font-semibold">{totalAppointments}</span>
            <span className="text-gray-600 text-sm xl:text-base">total appointments</span>
          </div>
        </div>

        <AppointmentListToolbar
          searchParamKey="q"
          filterParamKey="status"
          filterPlaceholder="Filter by status"
          sortParamKey="sort"
          sortOptions={[
            { value: "newest", label: "Newest First" },
            { value: "oldest", label: "Oldest First" },
          ]}
          patient={isPatient ? patientResponse?.data ?? undefined : undefined}
          patients={!isPatient ? allPatients : []}
          doctors={normalizedDoctors}
          role={role}
        />

        {isPatient && patientResponse?.success && (
          <AppointmentContainer id={userId!} patients={patientsFromAppointments} />
        )}
      </div>

      {/* Appointment Table */}
      <div className="mt-6">
        <AppointmentTable data={data} userId={userId!} isAdmin={role === "admin"} />
      </div>

      {/* Pagination */}
      <Pagination
        totalRecords={appointmentsResponse.totalRecords ?? 0}
        currentPage={appointmentsResponse.currentPage ?? page}
        totalPages={appointmentsResponse.totalPages ?? 1}
        limit={appointmentsResponse.limit ?? 10}
      />
    </div>
  );
};

export default AppointmentsPage;
