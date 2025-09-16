// components/appointment/appointment-details.tsx
import { format } from "date-fns";
import { SmallCard } from "../SmallCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface AppointmentDetailsProps {
  id: number | string;
  patient_id: string;
  appointment_date: Date | string;
  time: string;
  status?: string;
  reason?: string;
  cancelled_by?: "patient" | "doctor" | null;
  notes?: string;
}

export const AppointmentDetails = ({
  id,
  appointment_date,
  time,
  status,
  reason,
  cancelled_by,
  notes,
}: AppointmentDetailsProps) => {
  const isCancelled = status === "CANCELLED";

  const formattedDate =
    typeof appointment_date === "string"
      ? format(new Date(appointment_date), "MMM d, yyyy")
      : format(appointment_date, "MMM d, yyyy");

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Appointment Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <SmallCard label="Appointment #" value={`#${id}`} />
          <SmallCard label="Date" value={formattedDate} />
          <SmallCard label="Time" value={time} />
        </div>

        {isCancelled && (
          <div className="bg-yellow-100 p-4 mt-4 rounded-md">
            <span className="font-semibold text-sm text-gray-800">
              This appointment has been cancelled
            </span>
            <p className="text-sm text-gray-700 mt-1">
              <strong>Reason:</strong> {reason || "No reason provided"}
            </p>
            {cancelled_by && (
              <p className="text-sm text-gray-700">
                <strong>Cancelled by:</strong> {cancelled_by === "patient" ? "Patient" : "Doctor"}
              </p>
            )}
          </div>
        )}

        <div>
          <span className="text-sm font-medium">Additional Notes</span>
          <p className="text-sm text-gray-500">{notes || "No notes"}</p>
        </div>
      </CardContent>
    </Card>
  );
};
