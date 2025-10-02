import Link from "next/link";
import React from "react";
import { Button } from "../ui/Button";
import { AppointmentTable } from "./AppointmentTable";
import type { DashboardAppointment } from "@/types/dataTypes";

interface RecentAppointmentsProps {
  data?: DashboardAppointment[];
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ data }) => {
  const safeData = data ?? [];

  return (
    <div className="bg-card rounded-xl p-4 dark:bg-card-dark">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
          Recent Appointments
        </h1>
        <Button asChild variant="outline">
          <Link href="/record/appointments">View All</Link>
        </Button>
      </div>

      {safeData.length > 0 ? (
        <AppointmentTable data={safeData} showActions={false} />
      ) : (
        <p className="text-muted-foreground dark:text-muted-foreground-dark text-sm">
          No recent appointments found.
        </p>
      )}
    </div>
  );
};

export default RecentAppointments;
