// components/rosters/DutyRosterForm.tsx
"use client";

import { useState, useEffect } from "react";
import { DutyRoster, RosterInput } from "@/types/rosters";
import {
  createRosterAction,
  updateRosterAction,
  getStaffList,
  getDoctorsList,
  getShiftsList,
} from "@/app/actions/rosters";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { format, addDays, parse } from "date-fns";
import { toast } from "sonner";
import { Role as EnumRole } from "@prisma/client";

// Exclude ADMIN, MANAGER, PATIENT
const roles = Object.keys(EnumRole).filter(
  (r) => r !== "ADMIN" && r !== "MANAGER" && r !== "PATIENT"
) as string[];

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

function shiftTimeToInputFormat(time?: string | Date | null) {
  if (!time) return "";
  const d = new Date(time);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(11, 16); // HH:mm
}

interface Props {
  onSuccess?: () => void;
  initialData?: DutyRoster;
  onCalendarUpdate?: (roster: DutyRoster, action: "create" | "update") => void;
}

export default function DutyRosterForm({ onSuccess, initialData, onCalendarUpdate }: Props) {
  const [date, setDate] = useState<string>(
    initialData ? format(new Date(initialData.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );
  const [shiftId, setShiftId] = useState<string>(initialData?.shift?.id?.toString() ?? "");
  const [role, setRole] = useState<string>(initialData?.staff?.role ?? roles[0]);
  const [staffId, setStaffId] = useState<string | null>(initialData?.staff?.id ?? null);
  const [doctorId, setDoctorId] = useState<string | null>(initialData?.doctor?.id ?? null);
  const [department, setDepartment] = useState<string>(
    initialData?.staff?.department ?? initialData?.doctor?.department ?? ""
  );
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  const [startTime, setStartTime] = useState<string>(
    initialData ? shiftTimeToInputFormat(initialData.start_time) : ""
  );
  const [endTime, setEndTime] = useState<string>(
    initialData ? shiftTimeToInputFormat(initialData.end_time) : ""
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setStaffList(await getStaffList());
        setDoctorsList(await getDoctorsList());
        setShifts(await getShiftsList());
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (role === "DOCTOR" && doctorId) {
      setDepartment(doctorsList.find(d => d.id === doctorId)?.department ?? "");
    } else if (role !== "DOCTOR" && staffId) {
      setDepartment(staffList.find(s => s.id === staffId)?.department ?? "");
    } else {
      setDepartment("");
    }
  }, [role, doctorId, staffId, staffList, doctorsList]);

  useEffect(() => {
    if (!shiftId) return;
    const shift = shifts.find(s => s.id === parseInt(shiftId));
    if (!shift) return;
    setStartTime(shiftTimeToInputFormat(shift.start_time));
    setEndTime(shiftTimeToInputFormat(shift.end_time));
  }, [shiftId, shifts]);

  function combineDateTime(dateStr: string, timeStr: string, reference?: Date) {
    const [hour, minute] = timeStr.split(":").map(Number);
    const d = new Date(dateStr);
    d.setHours(hour, minute, 0, 0);
    if (reference && d <= reference) return addDays(d, 1); // overnight
    return d;
  }

  const handleSubmit = async () => {
    if (!date || !shiftId || (!staffId && !doctorId) || !startTime || !endTime) {
      toast.error("Please fill all required fields.");
      return;
    }

    const start = combineDateTime(date, startTime);
    const end = combineDateTime(date, endTime, start);

    const payload: RosterInput = {
      date: new Date(date),
      shift_id: parseInt(shiftId),
      staff_id: staffId ?? undefined,
      doctor_id: doctorId ?? undefined,
      start_time: start,
      end_time: end,
    };

    try {
      setLoading(true);
      let roster: DutyRoster;
      if (initialData) {
        roster = await updateRosterAction(initialData.id, payload);
        toast.success("Roster updated successfully");
        onCalendarUpdate?.(roster, "update");
      } else {
        roster = await createRosterAction(payload);
        toast.success("Roster created successfully");
        onCalendarUpdate?.(roster, "create");
      }

      onSuccess?.();
      setDate(format(new Date(), "yyyy-MM-dd"));
      setShiftId("");
      setStaffId(null);
      setDoctorId(null);
      setRole(roles[0]);
      setDepartment("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save roster");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow bg-white w-full max-w-xl">
      <h2 className="text-lg font-semibold mb-4">{initialData ? "Edit Duty Roster" : "Create Duty Roster"}</h2>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <label className="flex flex-col flex-1">
            Date
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              required
            />
            <small className="text-gray-500">
              Selected: {format(parse(date, "yyyy-MM-dd", new Date()), "dd-MM-yyyy")}
            </small>
          </label>

          <label className="flex flex-col flex-1">
            Start Time
            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </label>

          <label className="flex flex-col flex-1">
            End Time
            <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </label>
        </div>

        <label className="flex flex-col">
          Shift
          <Select value={shiftId} onValueChange={val => setShiftId(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              {shifts.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name} ({shiftTimeToInputFormat(s.start_time)} – {shiftTimeToInputFormat(s.end_time)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col">
          Role
          <Select value={role} onValueChange={val => setRole(val)}>
            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
            <SelectContent>
              {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>

        {role === "DOCTOR" ? (
          <label className="flex flex-col">
            Doctor
            <Select value={doctorId ?? ""} onValueChange={val => setDoctorId(val)}>
              <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
              <SelectContent>
                {doctorsList.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
        ) : (
          <label className="flex flex-col">
            Staff
            <Select value={staffId ?? ""} onValueChange={val => setStaffId(val)}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>
                {staffList.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
        )}

        <label className="flex flex-col">
          Department
          <Input type="text" value={department} disabled />
        </label>

        <Button onClick={handleSubmit} disabled={loading}>
          {initialData ? "Update Roster" : "Create Roster"}
        </Button>
      </div>
    </div>
  );
}
