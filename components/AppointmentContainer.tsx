import React from "react";
import { BookAppointmentForm } from "./forms/BookAppointment";
import { getPatientById } from "@/utils/services/patient";
import { getDoctors } from "@/utils/services/doctor"; 
import type { Patient, Doctor, Gender, Status, JOBTYPE } from "@/types/dataTypes";

interface AppointmentContainerProps {
  id: string;
  patients?: Patient[];
}

export const AppointmentContainer: React.FC<AppointmentContainerProps> = async ({ id, patients }) => {
  const { data: patient } = await getPatientById(id);
  const { data: doctors } = await getDoctors(); 

  if (!patient || !doctors) 
    return <p className="text-gray-500 dark:text-gray-400">Unable to load booking form.</p>;

  const normalizedPatient: Patient = {
    ...patient,
    date_of_birth: patient.date_of_birth ?? new Date("2000-01-01"),
    gender: patient.gender ?? ("OTHER" as Gender),
    img: patient.img ?? undefined,
    colorCode: patient.colorCode ?? undefined,
  };

  const normalizedDoctors: (Doctor & { availability_status: Status; type: JOBTYPE })[] =
    doctors.map(d => ({
      ...d,
      availability_status: d.availability_status ?? "AVAILABLE",
      type: d.type ?? "GENERAL",
      img: d.img ?? undefined,
      colorCode: d.colorCode ?? undefined,
    }));

  return (
    <BookAppointmentForm
      patient={normalizedPatient}
      patients={patients ?? [normalizedPatient]}
      doctors={normalizedDoctors}
      role="patient"
    />
  );
};
