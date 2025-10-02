// app/(protected)/record/appointments/[id]/page.tsx
import { AppointmentDetails } from "@/components/appointment/AppointmentDetails";
import AppointmentQuickLinks from "@/components/appointment/AppointmentQuickLinks";
import { BillsContainer } from "@/components/appointment/BillsContainer";
import ChartContainer from "@/components/appointment/ChartContainer";
import { DiagnosisContainer } from "@/components/appointment/DiagnosisContainer";
import { PatientDetailsCard } from "@/components/appointment/PatientDetailsCard";
import { PaymentsContainer } from "@/components/appointment/PaymentContainer";
import { VitalSigns } from "@/components/appointment/VitalSigns";
import { MedicalHistoryContainer } from "@/components/MedicalHistoryContainer";
import { getAppointmentById } from "@/utils/services/appointment";

const AppointmentDetailsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const { id } = resolvedParams;
  const cat = (resolvedSearchParams.cat as string) || "charts";

  const response = await getAppointmentById(Number(id));

  if (!response.success || !response.data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Appointment not found.</p>
      </div>
    );
  }

  const data = response.data;

  return (
    <div className="flex p-6 flex-col-reverse lg:flex-row w-full min-h-screen gap-10">
      {/* LEFT */}
      <div className="w-full lg:w-[65%] flex flex-col gap-6">
        {cat === "charts" && <ChartContainer id={data.patient_id} />}

        {cat === "appointments" && (
          <>
            <AppointmentDetails
              id={data.id}
              patient_id={data.patient_id}
              appointment_date={data.appointment_date}
              time={data.time}
              notes={data.note ?? ""}
            />

            <VitalSigns
              id={String(data.id)}
              patientId={data.patient_id}
              doctorId={data.doctor_id}
            />
          </>
        )}

        {cat === "diagnosis" && (
          <DiagnosisContainer
            id={String(data.id)}
            patientId={data.patient_id}
            doctorId={data.doctor_id}
          />
        )}

        {cat === "medical-history" && (
          <MedicalHistoryContainer patientId={data.patient_id} />
        )}

        {cat === "billing" && <BillsContainer id={String(data.id)} />}

        {cat === "payments" && (
          <PaymentsContainer patientId={data.patient_id} />
        )}
      </div>

      {/* RIGHT */}
      <div className="flex-1 space-y-6">
        <AppointmentQuickLinks staffId={data.doctor_id} />
        <PatientDetailsCard data={data.patient} />
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
