// components/appointment-status-indicator.tsx
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@prisma/client";

const statusColor: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-600/15 text-yellow-600",
  SCHEDULED: "bg-emerald-600/15 text-emerald-600",
  CANCELLED: "bg-red-600/15 text-red-600",
  COMPLETED: "bg-blue-600/15 text-blue-600",
};

interface AppointmentStatusIndicatorProps {
  status: AppointmentStatus;
}

export const AppointmentStatusIndicator = ({ status }: AppointmentStatusIndicatorProps) => {
  const colorClass = statusColor[status] ?? "bg-gray-600/15 text-gray-600"; // fallback

  return (
    <p
      className={cn(
        "w-fit px-2 py-1 rounded-full capitalize text-xs lg:text-sm",
        colorClass
      )}
    >
      {status}
    </p>
  );
};
