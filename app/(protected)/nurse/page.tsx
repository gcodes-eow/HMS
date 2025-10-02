// app/(protected)/nurse/page.tsx
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles"; // ✅ align with doctor code
import { SettingsQuickLinks } from "@/components/settings/QuickLinkSettings";

const NurseDashboard = async () => {
  const isNurse = await checkRole("NURSE"); // ✅ uppercase like DOCTOR
  if (!isNurse) {
    return redirect("/unauthorized");
  }

  const user = await currentUser();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome, Nurse {user?.firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Your dashboard to manage vitals, patient assistance, and daily tasks.
        </p>
      </div>

      <div className="w-full md:w-1/2">
        <SettingsQuickLinks />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-3xl font-bold">—</h2>
          <p className="text-gray-500 text-sm">Total Patients</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-3xl font-bold">—</h2>
          <p className="text-gray-500 text-sm">Vitals Today</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-3xl font-bold">—</h2>
          <p className="text-gray-500 text-sm">Medications Administered</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-3xl font-bold">—</h2>
          <p className="text-gray-500 text-sm">Appointments Today</p>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
