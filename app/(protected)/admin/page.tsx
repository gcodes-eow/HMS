// app/(protected)/admin/page.tsx
import { AvailableDoctors } from "@/components/AvailableDoctor";
import { AppointmentChart } from "@/components/charts/AppointmentChart";
import { StatSummary } from "@/components/charts/StatSummary";
import { StatCard } from "@/components/StatCard";
import RecentAppointments from "@/components/tables/RecentAppointments";
import { Button } from "@/components/ui/Button";
import { getAdminDashboardStats } from "@/utils/services/admin";
import { BriefcaseBusiness, BriefcaseMedical, User, Users } from "lucide-react";
import React from "react";

const AdminDashboard = async () => {
  const response = await getAdminDashboardStats();

  if (!response.success || !response.data) {
    return <div>Failed to load dashboard data.</div>;
  }

  const {
    availableDoctors,
    last5Records,
    appointmentCounts,
    monthlyData,
    totalDoctors,
    totalPatient,
    totalAppointments,
  } = response.data;

  const cardData = [
    {
      title: "Patients",
      value: totalPatient ?? 0,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total patients",
      link: "/manage-patients",
    },
    {
      title: "Doctors",
      value: totalDoctors ?? 0,
      icon: User,
      className: "bg-rose-600/15",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Total doctors",
      link: "/manage-doctors",
    },
    {
      title: "Appointments",
      value: totalAppointments ?? 0,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Total appointments",
      link: "/manage-appointments",
    },
    {
      title: "Consultation",
      value: appointmentCounts?.COMPLETED ?? 0,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Total consultation",
      link: "/manage-appointments",
    },
  ];

  return (
    <div className="py-6 px-3 flex flex-col xl:flex-row rounded-xl gap-6">
      {/* LEFT */}
      <div className="w-full xl:w-[69%]">
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Statistics</h1>
            <Button size={"sm"} variant={"outline"}>
              {new Date().getFullYear()}
            </Button>
          </div>

          <div className="w-full flex flex-wrap gap-5">
            {cardData.map((el, index) => (
              <StatCard
                key={index}
                title={el.title}
                value={el.value}
                icon={el.icon}
                className={el.className}
                iconClassName={el.iconClassName}
                note={el.note}
                link={el.link}
              />
            ))}
          </div>
        </div>

        <div className="h-[500px]">
          <AppointmentChart data={monthlyData ?? []} />
        </div>

        <div className="bg-white rounded-xl p-4 mt-8">
          <RecentAppointments data={last5Records ?? []} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-[450px]">
          <StatSummary data={appointmentCounts ?? {}} total={totalAppointments ?? 0} />
        </div>

        <AvailableDoctors data={availableDoctors ?? []} />
      </div>
    </div>
  );
};

export default AdminDashboard;
