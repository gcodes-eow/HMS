// app/(protected)/nurse/patient-management/page.tsx
import { getRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getNursePatients } from "@/utils/services/nurse";
import PatientManagementClient from "./PatientManagementClient";

const PatientManagementPage = async () => {
  const role = await getRole();
  if (role !== "nurse") return redirect("/unauthorized");

  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  // 🔹 Fetch patients assigned to this nurse
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
