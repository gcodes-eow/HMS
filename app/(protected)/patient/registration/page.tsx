// app/(protected)/patient/registration/page.tsx
import { NewPatient } from "@/components/NewPatient";
import { getPatientById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import React from "react";

const Registration = async () => {
  const { userId } = await auth();
  const role = await getRole();

  // Redirect receptionist to their flow
  if (role === "receptionist") {
    return redirect("/record/patients");
  }

  let data = null;

  if (userId) {
    // 👇 explicitly pass Clerk userId into a function that queries Prisma on user_id
    const result = await getPatientById({ user_id: userId });
    data = result?.data ?? null;
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-6xl w-full relative pb-10">
        <NewPatient
          data={data || undefined}
          type={data ? "update" : "create"}
          isReceptionist={false}
        />
      </div>
    </div>
  );
};

export default Registration;
