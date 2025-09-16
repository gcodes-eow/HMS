// app/(protected)/nurse/patient-management/page.tsx
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getRole } from "@/utils/roles";
import { getNursePatients } from "@/utils/services/nurse";
import PatientManagementClient from "./PatientManagementClient";
import type { JSX } from "react";

// No params needed for this static page
const PatientManagementPage = async (): Promise<JSX.Element> => {
  // Role check
  const role = await getRole();
  if (role !== "nurse") return redirect("/unauthorized");

  // Current user check
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  // Fetch patients for the nurse
  const patients = await getNursePatients(user.id);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Patient Management</h1>
      <p className="text-muted-foreground">
        Manage patients assigned to you. You can review details, update records, and track medications.
      </p>

      <PatientManagementClient patients={patients} />
    </div>
  );
};

export default PatientManagementPage;
