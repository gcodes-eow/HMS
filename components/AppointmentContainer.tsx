// components/AppointmentContainer.tsx
import React from "react";
import { BookAppointmentForm } from "./forms/BookAppointment";
import { getPatientById } from "@/utils/services/patient";
import { getDoctorsForBooking } from "@/utils/services/doctor";
import { Patient, Doctor, Status, JOBTYPE, Gender } from "@/types/dataTypes";

interface AppointmentContainerProps {
  id: string;
}

export const AppointmentContainer: React.FC<AppointmentContainerProps> = async ({ id }) => {
  const { data: patient } = await getPatientById(id);
  const { data: doctors } = await getDoctorsForBooking();

  if (!patient || !doctors) {
    return <p className="text-gray-500">Unable to load booking form.</p>;
  }

  // Normalize patient
  const normalizedPatient: Patient = {
    ...patient,
    date_of_birth: patient.date_of_birth ?? new Date("2000-01-01"),
    gender: patient.gender ?? "OTHER" as Gender, // fallback if undefined
    img: patient.img ?? undefined,
    colorCode: patient.colorCode ?? undefined,
  };

  // Normalize doctors
  const normalizedDoctors: (Doctor & { availability_status: Status; type: JOBTYPE })[] = doctors.map(d => ({
    ...d,
    availability_status: d.availability_status as Status,
    type: d.type as JOBTYPE,
    img: d.img ?? undefined,
    colorCode: d.colorCode ?? undefined,
  }));

  return (
    <div>
      <BookAppointmentForm
        patient={normalizedPatient}
        doctors={normalizedDoctors}
        role="patient"
      />
    </div>
  );
};
