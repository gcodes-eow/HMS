// app/(protected)/nurse/patient-management/[patientId]/page.tsx
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getRole } from "@/utils/roles";
import db from "@/lib/db";
import { getMedicationsForPatient } from "@/utils/services/nurse";

import { PatientDetailsCard } from "@/components/appointment/PatientDetailsCard";
import MedicationHistoryTable from "@/components/tables/MedicationHistoryTable";
import { VitalSigns } from "@/components/appointment/VitalSigns";
import { AdministerMedicationForm } from "@/components/forms/AdministerMedicationForm";
import RecentAppointments from "@/components/tables/RecentAppointments";

// Use proper Next.js PageProps typing
interface PatientPageProps {
  params: { patientId: string };
}

const PatientDetailPage = async ({ params }: PatientPageProps) => {
  const role = await getRole();
  if (role !== "nurse") return redirect("/unauthorized");

  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  const patient = await db.patient.findUnique({
    where: { id: params.patientId },
  });
  if (!patient) return redirect("/404");

  const records = await getMedicationsForPatient(params.patientId);

  const latestAppointment = await db.appointment.findFirst({
    where: { patient_id: params.patientId },
    orderBy: { appointment_date: "desc" },
    include: { doctor: true },
  });

  const recentAppointments = await db.appointment.findMany({
    where: { patient_id: params.patientId },
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
            onSuccess={(record) => alert(`Medication recorded: ${record.medication}`)}
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

      <div className="space-y-4">
        <RecentAppointments data={recentAppointments} />
      </div>
    </div>
  );
};

export default PatientDetailPage;
