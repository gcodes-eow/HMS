// app/actions/rosters.ts
"use server";

import prisma from "@/lib/db";
import {
  createRoster,
  getRostersPaginated,
  getRosterById,
  updateRoster,
  deleteRoster,
} from "@/utils/services/rosters";
import { RosterInput, DutyRoster } from "@/types/rosters";
import { format } from "date-fns";

// ==========================
// Helper: Safe Time Formatter
// ==========================
function safeFormatTime(time?: string | Date | null) {
  if (!time) return "--:--";
  const date = new Date(time);
  return isNaN(date.getTime()) ? "--:--" : format(date, "HH:mm");
}

// ==========================
// Map Prisma Roster → DutyRoster
// ==========================
function mapToDutyRoster(roster: any): DutyRoster {
  return {
    ...roster,
    start_time: new Date(roster.start_time), // 👈 ensure Date
    end_time: new Date(roster.end_time),     // 👈 ensure Date
    shift: {
      ...roster.shift,
      start_time: safeFormatTime(roster.shift?.start_time),
      end_time: safeFormatTime(roster.shift?.end_time),
    },
  };
}

// ==========================
// CRUD Actions
// ==========================
export async function createRosterAction(data: RosterInput): Promise<DutyRoster> {
  try {
    const roster = await createRoster(data);
    return mapToDutyRoster(roster);
  } catch (error) {
    console.error("Error creating roster:", error);
    throw error;
  }
}

export async function getRostersAction(): Promise<DutyRoster[]> {
  try {
    const paginated = await getRostersPaginated(1, 100);
    return paginated.data.map(mapToDutyRoster);
  } catch (error) {
    console.error("Error fetching rosters:", error);
    throw error;
  }
}

export async function getRosterByIdAction(id: number): Promise<DutyRoster | null> {
  try {
    const roster = await getRosterById(id);
    return roster ? mapToDutyRoster(roster) : null;
  } catch (error) {
    console.error("Error fetching roster:", error);
    throw error;
  }
}

export async function updateRosterAction(
  id: number,
  data: Partial<RosterInput>
): Promise<DutyRoster> {
  try {
    const roster = await updateRoster(id, data);
    return mapToDutyRoster(roster);
  } catch (error) {
    console.error("Error updating roster:", error);
    throw error;
  }
}

export async function deleteRosterAction(id: number): Promise<DutyRoster> {
  try {
    const roster = await deleteRoster(id);
    return mapToDutyRoster(roster);
  } catch (error) {
    console.error("Error deleting roster:", error);
    throw error;
  }
}

// ==========================
// Fetch staff, doctors, and shifts for form dropdowns
// ==========================
export async function getStaffList() {
  try {
    const staff = await prisma.staff.findMany();
    return staff.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      department: s.department ?? undefined, // map null → undefined
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function getDoctorsList() {
  try {
    const doctors = await prisma.doctor.findMany();
    return doctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialization: d.specialization,
      department: d.department ?? undefined, // map null → undefined
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export async function getShiftsList() {
  try {
    const shifts = await prisma.shift.findMany();
    return shifts.map((s) => ({
      id: s.id,
      name: s.name,
      start_time: safeFormatTime(s.start_time),
      end_time: safeFormatTime(s.end_time),
      type: s.type,
    }));
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }
}
