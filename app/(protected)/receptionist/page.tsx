// app/(protected)/receptionist/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { getRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/StatCard";
import { AppointmentChart } from "@/components/charts/AppointmentChart";
import { StatSummary } from "@/components/charts/StatSummary";
import RecentAppointments from "@/components/tables/RecentAppointments";
import { AvailableDoctors } from "@/components/AvailableDoctor";
import { getReceptionistDashboardStatistics } from "@/utils/services/receptionist";
import { Users, FileText, Briefcase } from "lucide-react";

export default async function ReceptionistDashboard() {
  const user = await currentUser();
  const role = await getRole();

  if (role !== "receptionist") return redirect("/unauthorized");

  const {
    appointmentCounts,
    totalPatients,
    totalAppointments,
    totalBilling,
    monthlyData,
    last5Appointments,
    availableDoctors,
  } = await getReceptionistDashboardStatistics();

  const cardData = [
    {
      title: "patients",
      value: totalPatients ?? 0,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Registered Patients",
    },
    {
      title: "appointments",
      value: totalAppointments ?? 0,
      icon: Briefcase,
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Total Appointments",
    },
    {
      title: "billing",
      value: totalBilling ?? 0,
      icon: FileText,
      className: "bg-green-600/15",
      iconClassName: "bg-green-600/25 text-green-600",
      note: "Total Billing",
    },
  ];

  // Transform availableDoctors to match AvailableDoctorProps
  const transformedDoctors = (availableDoctors?.doctors ?? []).map((doc) => ({
    id: doc.id,
    name: doc.name,
    specialization: doc.specialization,
    img: doc.img ?? undefined,
    colorCode: doc.colorCode ?? undefined,
    working_days: doc.working_days.map((day) => ({
      day: day.day,
      start_time: day.start_time,
      close_time: day.close_time,
    })),
  }));

  return (
    <div className="py-6 px-3 flex flex-col rounded-xl xl:flex-row gap-6">
      {/* LEFT SIDE */}
      <div className="w-full xl:w-[69%]">
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg xl:text-2xl font-semibold">
              Welcome {user?.firstName}
            </h1>
          </div>

          <div className="w-full flex flex-wrap gap-5">
            {cardData.map((el, id) => (
              <StatCard key={id} {...el} value={el.value ?? 0} link="#" />
            ))}
          </div>
        </div>

        <div className="h-[500px]">
          <AppointmentChart data={monthlyData ?? []} />
        </div>

        <div className="bg-white rounded-xl p-4 mt-8">
          <RecentAppointments data={last5Appointments ?? []} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-[450px] mb-8">
          <StatSummary
            data={appointmentCounts ?? []}
            total={totalAppointments ?? 0}
          />
        </div>
        <AvailableDoctors data={transformedDoctors} />
      </div>
    </div>
  );
}
