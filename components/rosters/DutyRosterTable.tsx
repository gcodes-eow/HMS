// components/rosters/DutyRosterTable.tsx
"use client";

import { useState } from "react";
import { DutyRoster } from "@/types/rosters";
import EditDutyRosters from "../dialogs/EditDutyRosters";
import ViewDutyRosters from "../dialogs/ViewDutyRosters";
import { deleteRosterAction } from "@/app/actions/rosters";
import { format } from "date-fns";
import { Button } from "../ui/Button";
import { Trash2, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

interface Props {
  rosters: DutyRoster[];
  onRostersUpdated?: () => void;
  readOnly?: boolean;
}

export default function DutyRosterTable({
  rosters,
  onRostersUpdated,
  readOnly = false,
}: Props) {
  const [selectedRoster, setSelectedRoster] = useState<DutyRoster | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this roster?")) return;
    try {
      await deleteRosterAction(id);
      toast.success("Roster deleted successfully");
      onRostersUpdated?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete roster");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500 text-white";
      case "INACTIVE":
        return "bg-red-500 text-white";
      case "DORMANT":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return "----/--/--";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "----/--/--";
    return format(d, "dd-MM-yyyy");
  };

  const formatTime12 = (time: string | Date | undefined | null) => {
    if (!time) return "12:00 am";
    const d = new Date(time);
    if (isNaN(d.getTime())) return "12:00 am";
    return format(d, "hh:mm a");
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Shift</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Staff Name</th>
            <th className="p-2 text-left">Status</th>
            {!readOnly && <th className="p-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rosters.map((roster) => (
            <tr key={roster.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{formatDate(roster.date)}</td>
              <td className="p-2">
                {roster.shift?.name ?? "-"} (
                {formatTime12(roster.start_time)} –{" "}
                {formatTime12(roster.end_time)})
              </td>
              <td className="p-2">
                {roster.staff?.department ?? roster.doctor?.department ?? "-"}
              </td>
              <td className="p-2">
                {roster.staff?.role ?? (roster.doctor ? "Doctor" : "-")}
              </td>
              <td className="p-2">
                {roster.staff?.name ?? roster.doctor?.name ?? "-"}
              </td>
              <td
                className={`p-2 font-semibold ${getStatusColor(roster.status)}`}
              >
                {roster.status}
              </td>
              {!readOnly && (
                <td className="p-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedRoster(roster);
                      setViewOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedRoster(roster);
                      setEditOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(roster.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRoster && (
        <>
          {!readOnly && (
            <EditDutyRosters
              roster={selectedRoster}
              open={editOpen}
              onClose={() => setEditOpen(false)}
              onUpdated={onRostersUpdated}
            />
          )}
          <ViewDutyRosters
            roster={selectedRoster}
            open={viewOpen}
            onClose={() => setViewOpen(false)}
          />
        </>
      )}
    </div>
  );
}
