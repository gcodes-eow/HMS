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

// Utility to safely format dates
const formatDateSafe = (value: string | Date | undefined | null) => {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? "N/A" : format(date, "yyyy-MM-dd");
};

interface ParamsProps {
  params: { patientId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const PatientProfile = async ({ params, searchParams }: ParamsProps) => {
  const cat = searchParams?.cat?.toString() || "medical-history";

  let id = params.patientId;

  if (id === "self") {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated.");
    }
    id = userId;
  }

  // Fetch patient data
  const { data } = await getPatientFullDataById(id);

  // Fetch ratings data here
  const ratingsResponse = await fetch(`/api/ratings/${id}`);
  const ratingsData = await ratingsResponse.json();

  const SmallCard = ({ label, value }: { label: string; value: string }) => (
    <div className="w-full md:w-1/3">
      <span className="text-sm text-gray-500">{label}</span>
      <p className="text-sm md:text-base capitalize">{value}</p>
    </div>
  );

  return (
    <div className="bg-gray-100/60 h-full rounded-xl py-6 px-3 2xl:p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full xl:w-3/4">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <Card className="bg-white rounded-xl p-4 w-full lg:w-[30%] border-none flex flex-col items-center">
            <ProfileImage
              url={data?.img!}
              name={`${data?.first_name} ${data?.last_name}`}
              className="h-20 w-20 md:flex"
              bgColor={data?.colorCode!}
              textClassName="text-3xl"
            />
            <h1 className="font-semibold text-2xl mt-2">
              {data?.first_name} {data?.last_name}
            </h1>
            <span className="text-sm text-gray-500">{data?.email}</span>

            <div className="w-full flex items-center justify-center gap-2 mt-4">
              <div className="w-1/2 space-y-1 text-center">
                <p className="text-xl font-medium">{data?.totalAppointments}</p>
                <span className="text-xs text-gray-500">Appointments</span>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-xl p-6 w-full lg:w-[70%] border-none space-y-6">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Gender" value={data?.gender?.toLowerCase() || "N/A"} />
              <SmallCard
                label="Date of Birth"
                value={formatDateSafe(data?.date_of_birth)}
              />
              <SmallCard label="Phone Number" value={data?.phone || "N/A"} />
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Marital Status" value={data?.marital_status || "N/A"} />
              <SmallCard label="Blood Group" value={data?.blood_group || "N/A"} />
              <SmallCard label="Address" value={data?.address || "N/A"} />
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Contact Person"
                value={data?.emergency_contact_name || "N/A"}
              />
              <SmallCard
                label="Emergency Contact"
                value={data?.emergency_contact_number || "N/A"}
              />
              <SmallCard
                label="Last Visit"
                value={formatDateSafe(data?.lastVisit)}
              />
            </div>
          </Card>
        </div>

        <div className="mt-10">
          {cat === "medical-history" && (
            <MedicalHistoryContainer patientId={id} />
          )}
        </div>
      </div>

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
            <Link className="p-3 rounded-md bg-violet-100" href="?cat=payments">
              Medical Bills
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/`}>
              Dashboard
            </Link>
            <Link className="p-3 rounded-md bg-rose-100" href={`#`}>
              Lab Test & Result
            </Link>

            {params.patientId === "self" && (
              <Link
                className="p-3 rounded-md bg-black/10"
                href={`/patient/registration`}
              >
                Edit Information
              </Link>
            )}
          </div>
        </div>

        {/* Pass the patientId and ratings data to PatientRatingContainer */}
        <PatientRatingContainer patientId={id} data={ratingsData} />
      </div>
    </div>
  );
};

export default PatientProfile;
