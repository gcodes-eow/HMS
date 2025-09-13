// components/AppointmentContainer.tsx
import React from "react";
import { BookAppointmentForm } from "./forms/BookAppointment"; // ✅ named import
import { getPatientById } from "@/utils/services/patient";
import { getDoctors } from "@/utils/services/doctor";

export const AppointmentContainer = async ({ id }: { id: string }) => {
  const { data } = await getPatientById(id);
  const { data: doctors } = await getDoctors();

  if (!data || !doctors) {
    return <p className="text-gray-500">Unable to load booking form.</p>;
  }

  return (
    <div>
      <BookAppointmentForm
        patient={data}
        doctors={doctors}
        role="patient"
      />
    </div>
  );
};
