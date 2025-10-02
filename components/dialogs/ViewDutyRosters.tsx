// components/dialogs/ViewDutyRosters.tsx
"use client";

import { useState } from "react";
import { DutyRoster } from "@/types/rosters";
import { format } from "date-fns";
import { Button } from "../ui/Button";
import { deleteRosterAction } from "@/app/actions/rosters";
import { toast } from "sonner";

interface Props {
  roster: DutyRoster;
  open: boolean;
  onClose: () => void;
  role?: string;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

// Safe formatting for 12-hour time display
function formatShiftTime(time: string | Date | null | undefined) {
  if (!time) return "--:--";
  const d = new Date(time);
  if (isNaN(d.getTime())) return "--:--";
  return format(d, "hh:mm a");
}

// Safe formatting for 12-hour date display
function formatDateSafe(date: string | Date | null | undefined) {
  if (!date) return "----/--/--";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "----/--/--";
  return format(d, "dd-MM-yyyy");
}

export default function ViewDutyRosters({
  roster,
  open,
  onClose,
  role,
  onDeleted,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    try {
      await deleteRosterAction(roster.id);
      toast.success("Roster deleted successfully");
      onDeleted?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete roster");
    }
  };

  const isAdminOrManager =
    role?.toLowerCase() === "admin" || role?.toLowerCase() === "manager";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Duty Roster Details</h2>

        <div className="flex flex-col gap-2">
          <p>
            <strong>Date:</strong> {formatDateSafe(roster.date)}
          </p>
          <p>
            <strong>Shift:</strong> {roster.shift?.name ?? "-"} (
            {formatShiftTime(roster.start_time)} – {formatShiftTime(roster.end_time)}
            )
          </p>
          <p>
            <strong>Department:</strong> {roster.staff?.department ?? roster.doctor?.department ?? "-"}
          </p>
          <p>
            <strong>Role:</strong> {roster.staff?.role ?? (roster.doctor ? "Doctor" : "-")}
          </p>
          <p>
            <strong>Name:</strong> {roster.staff?.name ?? roster.doctor?.name ?? "-"}
          </p>
          <p>
            <strong>Status:</strong> {roster.status}
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isAdminOrManager && (
            <>
              {!confirmDelete ? (
                <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                  Delete
                </Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Confirm Delete
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
