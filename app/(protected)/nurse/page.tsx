// app/(protected)/nurse/page.tsx
import { getRole } from "@/utils/roles";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const NurseDashboard = async () => {
  const role = await getRole();
  if (role !== "nurse") return redirect("/unauthorized");

  const user = await currentUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, Nurse {user?.firstName}
      </h1>
      <p className="text-muted-foreground">
        Your dashboard for managing vitals, patient assistance, and daily tasks.
      </p>
    </div>
  );
};

export default NurseDashboard;