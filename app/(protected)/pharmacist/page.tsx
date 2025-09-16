// app/(protected)/pharmacist/page.tsx
import { getRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const PharmacistDashboard = async () => {
  const role = await getRole();
  if (role !== "pharmacist") return redirect("/unauthorized");

  const user = await currentUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, {user?.firstName}
      </h1>
      <p className="text-muted-foreground">
        Review and dispense medications, and manage pharmacy inventory.
      </p>
    </div>
  );
};

export default PharmacistDashboard;
