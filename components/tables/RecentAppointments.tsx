import Link from "next/link";
import React from "react";
import { Button } from "../ui/Button";
import { AppointmentTable } from "./AppointmentTable";
import { Appointment, DashboardAppointment } from "@/types/dataTypes";

interface RecentAppointmentsProps {
  data?: Appointment[] | DashboardAppointment[]; // make optional
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ data }) => {
  // fallback to empty array if data is undefined or null
  const safeData = Array.isArray(data) ? data : [];

  // Normalize for AppointmentTable
  const normalizedData: Appointment[] = safeData.map((appt) => ({
    ...appt,
    type: appt.type ?? "GENERAL", // fallback if type is missing
    patient: appt.patient || { first_name: "-", last_name: "-" },
    doctor: appt.doctor || { name: "-", specialization: "-" },
  }));

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Recent Appointments</h1>
        <Button asChild variant="outline">
          <Link href="/record/appointments">View All</Link>
        </Button>
      </div>

      {normalizedData.length > 0 ? (
        <AppointmentTable data={normalizedData} showActions={false} />
      ) : (
        <p className="text-gray-500 text-sm">No recent appointments found.</p>
      )}
    </div>
  );
};

export default RecentAppointments;
