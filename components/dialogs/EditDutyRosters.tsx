// components/rosters/EditDutyRosters.tsx
"use client";

import { useState, useEffect } from "react";
import { DutyRoster, RosterInput } from "@/types/rosters";
import {
  updateRosterAction,
  getStaffList,
  getDoctorsList,
  getShiftsList,
} from "@/app/actions/rosters";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/Select";
import { format } from "date-fns";
import { toast } from "sonner";

interface Props {
  roster: DutyRoster;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

interface Staff {
  id: string;
  name: string;
  role?: string;
  department?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization?: string;
  department?: string;
}

interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  type: string;
}

// Format for displaying shift times (12-hour)
function formatShiftTime(time: string | Date | null | undefined) {
  if (!time) return "--:--";
  const d = new Date(time);
  if (isNaN(d.getTime())) return "--:--";
  return format(d, "hh:mm a");
}

// Format for <input type="time"> (24-hour)
function shiftTimeToInputFormat(time: string | Date | null | undefined) {
  if (!time) return ""; // return empty string for invalid/null
  const d = new Date(time);
  if (isNaN(d.getTime())) return "";
  return format(d, "HH:mm");
}

export default function EditDutyRosters({
  roster,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [date, setDate] = useState(
    roster.date ? format(new Date(roster.date), "yyyy-MM-dd") : ""
  );
  const [shift, setShift] = useState(roster.shift_id?.toString() ?? "");
  const [role, setRole] = useState<string>(roster.staff ? "STAFF" : "DOCTOR");
  const [staffId, setStaffId] = useState<string | null>(
    roster.staff_id ?? null
  );
  const [doctorId, setDoctorId] = useState<string | null>(
    roster.doctor_id ?? null
  );
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  const [startTime, setStartTime] = useState<string>(
    shiftTimeToInputFormat(roster.start_time)
  );
  const [endTime, setEndTime] = useState<string>(
    shiftTimeToInputFormat(roster.end_time)
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setStaffList(await getStaffList());
        setDoctorsList(await getDoctorsList());
        setShifts(await getShiftsList());
      } catch (error) {
        console.error("Failed to fetch staff, doctors, or shifts", error);
      }
    }

    if (open) {
      fetchData();
      setDate(roster.date ? format(new Date(roster.date), "yyyy-MM-dd") : "");
      setShift(roster.shift_id?.toString() ?? "");
      setRole(roster.staff ? "STAFF" : "DOCTOR");
      setStaffId(roster.staff_id ?? null);
      setDoctorId(roster.doctor_id ?? null);
      setStartTime(shiftTimeToInputFormat(roster.start_time));
      setEndTime(shiftTimeToInputFormat(roster.end_time));
    }
  }, [open, roster]);

  const handleUpdate = async () => {
    if (!date || !shift || (!staffId && !doctorId) || !startTime || !endTime) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload: Partial<RosterInput> = {
      date: new Date(date),
      shift_id: parseInt(shift),
      staff_id: role === "STAFF" ? staffId ?? undefined : undefined,
      doctor_id: role === "DOCTOR" ? doctorId ?? undefined : undefined,
      start_time: new Date(`${date}T${startTime}`),
      end_time: new Date(`${date}T${endTime}`),
    };

    try {
      setLoading(true);
      await updateRosterAction(roster.id, payload);
      toast.success("Roster updated successfully");
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update roster");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Duty Roster</h2>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col">
            Date
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              required
            />
          </label>

          <div className="flex gap-2">
            <label className="flex flex-col flex-1">
              Start Time
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col flex-1">
              End Time
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="flex flex-col">
            Shift
            <Select value={shift} onValueChange={setShift}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name} ({formatShiftTime(s.start_time)} –{" "}
                    {formatShiftTime(s.end_time)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col">
            Role
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="DOCTOR">Doctor</SelectItem>
              </SelectContent>
            </Select>
          </label>

          {role === "DOCTOR" ? (
            <label className="flex flex-col">
              Doctor
              <Select value={doctorId ?? ""} onValueChange={setDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsList.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          ) : (
            <label className="flex flex-col">
              Staff
              <Select value={staffId ?? ""} onValueChange={setStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
