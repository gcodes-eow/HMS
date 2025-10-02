"use client";

import { AppointmentStatus } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { useRouter } from "next/navigation";
import { appointmentAction } from "@/app/actions/appointment";

interface ActionProps {
  id: string | number;
  status: string;
}

export const AppointmentAction = ({ id, status }: ActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<AppointmentStatus | "">("");
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleAction = async () => {
    try {
      setIsLoading(true);
      const newReason = reason || `Appointment has been ${selected?.toLowerCase()} on ${new Date()}`;
      const resp = await appointmentAction(id, selected as AppointmentStatus, newReason);

      if (resp.success) toast.success(resp.msg);
      else toast.error(resp.msg);

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusClasses = "text-black dark:text-white";

  return (
    <div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          disabled={status === "PENDING" || isLoading || status === "COMPLETED"}
          className={`bg-yellow-200 dark:bg-yellow-600 ${statusClasses}`}
          onClick={() => setSelected(AppointmentStatus.PENDING)}
        >
          Pending
        </Button>
        <Button
          variant="outline"
          disabled={status === "SCHEDULED" || isLoading || status === "COMPLETED"}
          className={`bg-blue-200 dark:bg-blue-600 ${statusClasses}`}
          onClick={() => setSelected(AppointmentStatus.SCHEDULED)}
        >
          Approve
        </Button>
        <Button
          variant="outline"
          disabled={status === "COMPLETED" || isLoading}
          className={`bg-emerald-200 dark:bg-emerald-600 ${statusClasses}`}
          onClick={() => setSelected(AppointmentStatus.COMPLETED)}
        >
          Completed
        </Button>
        <Button
          variant="outline"
          disabled={status === "CANCELLED" || isLoading || status === "COMPLETED"}
          className={`bg-red-200 dark:bg-red-600 ${statusClasses}`}
          onClick={() => setSelected(AppointmentStatus.CANCELLED)}
        >
          Cancel
        </Button>
      </div>

      {selected === AppointmentStatus.CANCELLED && (
        <Textarea
          disabled={isLoading}
          className="mt-4 bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark"
          placeholder="Enter reason..."
          onChange={(e) => setReason(e.target.value)}
        />
      )}

      {selected && (
        <div className="flex items-center justify-between mt-6 bg-red-100 dark:bg-red-800 p-4 rounded text-foreground dark:text-foreground-dark">
          <p>Are you sure you want to perform this action?</p>
          <Button disabled={isLoading} type="button" onClick={handleAction}>
            Yes
          </Button>
        </div>
      )}
    </div>
  );
};
