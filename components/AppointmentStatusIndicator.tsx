import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@prisma/client";

const statusColor: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-600/15 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  SCHEDULED: "bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  CANCELLED: "bg-red-600/15 dark:bg-red-500/20 text-red-600 dark:text-red-400",
  COMPLETED: "bg-blue-600/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
};

interface AppointmentStatusIndicatorProps {
  status: AppointmentStatus;
}

export const AppointmentStatusIndicator = ({ status }: AppointmentStatusIndicatorProps) => {
  const colorClass = statusColor[status] ?? "bg-gray-600/15 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400";

  return (
    <p className={cn("w-fit px-2 py-1 rounded-full capitalize text-xs lg:text-sm", colorClass)}>
      {status}
    </p>
  );
};
