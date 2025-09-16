// app/(protected)/nurse/patient-management/[patientId]/page.tsx
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getRole } from "@/utils/roles";
import db from "@/lib/db";
import { getMedicationsForPatient } from "@/utils/services/nurse";
import type { JSX } from "react";

import { PatientDetailsCard } from "@/components/appointment/PatientDetailsCard";
import MedicationHistoryTable from "@/components/tables/MedicationHistoryTable";
import { VitalSigns } from "@/components/appointment/VitalSigns";
import { AdministerMedicationForm } from "@/components/forms/AdministerMedicationForm";
import RecentAppointments from "@/components/tables/RecentAppointments";

// Use flexible props typing similar to AuditLogsPage
interface PatientDetailPageProps {
  params?: Promise<Record<string, string | string[] | undefined>>;
  searchParams?: Promise<any>;
}

const PatientDetailPage = async ({
  params,
}: PatientDetailPageProps): Promise<JSX.Element> => {
  // Await the promise and default to empty object
  const resolvedParams = (await params) ?? {};
  const patientId = resolvedParams.patientId as string;

  if (!patientId) return redirect("/404");

  // Role check
  const role = await getRole();
  if (role !== "nurse") return redirect("/unauthorized");

  // Current user check
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  // Fetch patient info
  const patient = await db.patient.findUnique({ where: { id: patientId } });
  if (!patient) return redirect("/404");

  // Fetch medication history
  const records = await getMedicationsForPatient(patientId);

  // Fetch latest appointment
  const latestAppointment = await db.appointment.findFirst({
    where: { patient_id: patientId },
    orderBy: { appointment_date: "desc" },
    include: { doctor: true },
  });

  // Fetch recent appointments
  const recentAppointments = await db.appointment.findMany({
    where: { patient_id: patientId },
    orderBy: { appointment_date: "desc" },
    take: 5,
    include: { doctor: true, patient: true },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Patient Profile</h1>

      <PatientDetailsCard data={patient} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Medication History</h2>
        <MedicationHistoryTable records={records} />
      </div>

      {latestAppointment && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Administer Medication</h2>
          <AdministerMedicationForm
            patients={[
              {
                id: patient.id,
                first_name: patient.first_name,
                last_name: patient.last_name,
              },
            ]}
            onSuccess={(record) =>
              alert(`Medication recorded: ${record.medication}`)
            }
          />
        </div>
      )}

      {latestAppointment && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vital Signs</h2>
          <VitalSigns
            id={latestAppointment.id}
            patientId={patient.id}
            doctorId={latestAppointment.doctor_id}
          />
        </div>
      )}

      <RecentAppointments data={recentAppointments} />
    </div>
  );
};

export default PatientDetailPage;
