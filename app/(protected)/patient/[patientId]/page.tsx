// app/(protected)/patient/[patientId]/page.tsx
import { MedicalHistoryContainer } from "@/components/MedicalHistoryContainer";
import PatientRatingContainer from "@/components/PatientRatingContainer";
import { ProfileImage } from "@/components/ProfileImage";
import { Card } from "@/components/ui/Card";
import { getPatientFullDataById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

interface ParamsProps {
  params: Promise<{ patientId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Utility to safely format dates
const formatDateSafe = (value: string | Date | undefined | null) => {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? "N/A" : format(date, "yyyy-MM-dd");
};

const PatientProfile = async ({ params, searchParams }: ParamsProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const cat = (resolvedSearchParams.cat as string) || "medical-history";

  let id = resolvedParams.patientId;
  if (id === "self") {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated.");
    id = userId;
  }

  const { data: patientData } = await getPatientFullDataById(id);
  if (!patientData) return <div className="p-4">Patient data not found.</div>;

  const SmallCard = ({ label, value }: { label: string; value: string }) => (
    <div className="w-full md:w-1/3">
      <span className="text-sm text-gray-500">{label}</span>
      <p className="text-sm md:text-base capitalize">{value}</p>
    </div>
  );

  return (
    <div className="bg-gray-100/60 h-full rounded-xl py-6 px-3 2xl:p-6 flex flex-col lg:flex-row gap-6">
      {/* Left Column */}
      <div className="w-full xl:w-3/4">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <Card className="bg-white rounded-xl p-4 w-full lg:w-[30%] border-none flex flex-col items-center">
            <ProfileImage
              url={patientData.img ?? undefined}
              name={`${patientData.first_name} ${patientData.last_name}`}
              className="h-20 w-20 md:flex"
              bgColor={patientData.colorCode ?? undefined}
              textClassName="text-3xl"
            />
            <h1 className="font-semibold text-2xl mt-2">
              {patientData.first_name} {patientData.last_name}
            </h1>
            <span className="text-sm text-gray-500">{patientData.email}</span>
            <div className="w-full flex items-center justify-center gap-2 mt-4">
              <div className="w-1/2 space-y-1 text-center">
                <p className="text-xl font-medium">
                  {patientData.totalAppointments}
                </p>
                <span className="text-xs text-gray-500">Appointments</span>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-xl p-6 w-full lg:w-[70%] border-none space-y-6">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Gender"
                value={patientData.gender?.toLowerCase() ?? "N/A"}
              />
              <SmallCard
                label="Date of Birth"
                value={formatDateSafe(patientData.date_of_birth)}
              />
              <SmallCard
                label="Phone Number"
                value={patientData.phone ?? "N/A"}
              />
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Marital Status"
                value={patientData.marital_status ?? "N/A"}
              />
              <SmallCard
                label="Blood Group"
                value={patientData.blood_group ?? "N/A"}
              />
              <SmallCard
                label="Address"
                value={patientData.address ?? "N/A"}
              />
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Contact Person"
                value={patientData.emergency_contact_name ?? "N/A"}
              />
              <SmallCard
                label="Emergency Contact"
                value={patientData.emergency_contact_number ?? "N/A"}
              />
              <SmallCard
                label="Last Visit"
                value={formatDateSafe(patientData.lastVisit)}
              />
            </div>
          </Card>
        </div>

        {/* Medical History */}
        {cat === "medical-history" && <MedicalHistoryContainer patientId={id} />}
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-1/3">
        <div className="bg-white p-4 rounded-md mb-8">
          <h1 className="text-xl font-semibold">Quick Links</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-yellow-50 hover:underline"
              href={`/record/appointments?id=${id}`}
            >
              Patient&apos;s Appointments
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-50 hover:underline"
              href="?cat=medical-history"
            >
              Medical Records
            </Link>
            <Link
              className="p-3 rounded-md bg-violet-100"
              href="?cat=payments"
            >
              Medical Bills
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/`}>
              Dashboard
            </Link>
            <Link className="p-3 rounded-md bg-rose-100" href={`#`}>
              Lab Test & Result
            </Link>

            {resolvedParams.patientId === "self" && (
              <Link
                className="p-3 rounded-md bg-black/10"
                href={`/patient/registration`}
              >
                Edit Information
              </Link>
            )}
          </div>
        </div>

        {/* Ratings */}
        <PatientRatingContainer entityId={id} entityType="patient" />
      </div>
    </div>
  );
};

export default PatientProfile;
