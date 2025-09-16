// app/(protected)/patient/page.tsx
import { AvailableDoctors } from "@/components/AvailableDoctor";
import { AppointmentChart } from "@/components/charts/AppointmentChart";
import { StatSummary } from "@/components/charts/StatSummary";
import PatientRatingContainer from "@/components/PatientRatingContainer";
import { StatCard } from "@/components/StatCard";
import RecentAppointments from "@/components/tables/RecentAppointments";
import { Button } from "@/components/ui/Button";
import { AvailableDoctorProps, PatientDashboardData } from "@/types/dataTypes";
import { getPatientDashboardStatistics } from "@/utils/services/patient";
import { currentUser } from "@clerk/nextjs/server";
import { Briefcase, BriefcaseBusiness, BriefcaseMedical } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const PatientDashboard = async () => {
  const user = await currentUser();

  // Redirect to sign-in if no user is logged in
  if (!user) {
    redirect("/sign-in");
  }

  const response = await getPatientDashboardStatistics(user.id);

  // Redirect to patient registration if user exists but no patient data found
  if (!response.success || !response.data) {
    redirect("/patient/registration");
  }

  const {
    first_name,
    totalAppointments,
    availableDoctor,
    monthlyData,
    appointmentCounts,
    last5Records,
  } = response.data as PatientDashboardData;

  const cardData = [
    {
      title: "appointments",
      value: totalAppointments,
      icon: Briefcase,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total appointments",
    },
    {
      title: "cancelled",
      value: appointmentCounts?.CANCELLED ?? 0,
      icon: Briefcase,
      className: "bg-rose-600/15",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Cancelled Appointments",
    },
    {
      title: "pending",
      value:
        (appointmentCounts?.PENDING ?? 0) + (appointmentCounts?.SCHEDULED ?? 0),
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Pending Appointments",
    },
    {
      title: "completed",
      value: appointmentCounts?.COMPLETED ?? 0,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Successfully appointments",
    },
  ];

  return (
    <div className="py-6 px-3 flex flex-col rounded-xl xl:flex-row gap-6">
      {/* LEFT */}
      <div className="w-full xl:w-[69%]">
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg xl:text-2xl font-semibold">
              Welcome {first_name || user.firstName}
            </h1>

            <div className="space-x-2">
              <Button size={"sm"}>{new Date().getFullYear()}</Button>
              <Button size="sm" variant="outline" className="hover:underline">
                <Link href="/patient/self">View Profile</Link>
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-5">
            {cardData.map((el, id) => (
              <StatCard key={id} {...el} link="#" />
            ))}
          </div>
        </div>

        <div className="h-[500px]">
          <AppointmentChart data={monthlyData} />
        </div>

        <div className="bg-white rounded-xl p-4 mt-8">
          <RecentAppointments data={last5Records} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-[450px] mb-8">
          <StatSummary data={appointmentCounts} total={totalAppointments} />
        </div>

        <AvailableDoctors data={availableDoctor as AvailableDoctorProps} />

        {/* Pass patientId to PatientRatingContainer */}
        <PatientRatingContainer patientId={user.id} data={[]} />
      </div>
    </div>
  );
};

export default PatientDashboard;
