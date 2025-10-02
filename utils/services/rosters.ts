// utils/services/rosters.ts
import { z } from "zod";
import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import { format } from "date-fns";

// ==========================
// Base Schema (with start/end time)
// ==========================
const RosterBaseSchema = z.object({
  id: z.number().optional(),
  shift_id: z.number(),
  staff_id: z.string().nullable().optional(),
  doctor_id: z.string().nullable().optional(),
  date: z.coerce.date(),
  status: z.nativeEnum(Status).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),

  // ⏰ Required roster-specific times
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
});

// ==========================
// Refined Schema
// ==========================
export const RosterSchema = RosterBaseSchema.refine(
  (data) => data.staff_id || data.doctor_id,
  {
    message: "Roster must have either a staff_id or doctor_id",
    path: ["staff_id"],
  }
)
  .refine((data) => !(data.staff_id && data.doctor_id), {
    message: "Roster cannot have both staff_id and doctor_id",
    path: ["staff_id"],
  })
  .refine((data) => data.date >= new Date(), {
    message: "Roster date cannot be in the past",
    path: ["date"],
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  });

export type RosterInput = z.infer<typeof RosterSchema>;

// ==========================
// Helper to map Prisma Roster → DutyRoster (12-hour time format)
// ==========================
function mapRosterDates(roster: any) {
  if (!roster) return roster;

  const startTime = roster.start_time ? format(new Date(roster.start_time), "hh:mm a") : "--:--";
  const endTime = roster.end_time ? format(new Date(roster.end_time), "hh:mm a") : "--:--";

  return {
    ...roster,
    shift: {
      ...roster.shift,
      start_time: roster.shift?.start_time ? format(new Date(roster.shift.start_time), "hh:mm a") : "--:--",
      end_time: roster.shift?.end_time ? format(new Date(roster.shift.end_time), "hh:mm a") : "--:--",
    },
    date: new Date(roster.date),
    start_time: startTime,
    end_time: endTime,
  };
}

// ==========================
// DB Service Functions
// ==========================

// Create roster
export async function createRoster(data: RosterInput) {
  const parsed = RosterSchema.parse(data);
  const roster = await prisma.roster.create({
    data: {
      shift_id: parsed.shift_id,
      staff_id: parsed.staff_id ?? null,
      doctor_id: parsed.doctor_id ?? null,
      date: parsed.date,
      start_time: parsed.start_time,
      end_time: parsed.end_time,
      status: parsed.status ?? Status.ACTIVE,
    },
    include: { shift: true, staff: true, doctor: true },
  });
  return mapRosterDates(roster);
}

// Get all rosters with pagination
export async function getRostersPaginated(
  page = 1,
  limit = 10,
  activeOnly = true
) {
  const skip = (page - 1) * limit;
  const where = activeOnly ? { status: Status.ACTIVE } : {};

  const [totalRecords, rosters] = await Promise.all([
    prisma.roster.count({ where }),
    prisma.roster.findMany({
      where,
      include: { shift: true, staff: true, doctor: true },
      orderBy: { date: "asc" },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalRecords / limit);
  const data = rosters.map(mapRosterDates);

  return { data, totalRecords, totalPages, currentPage: page, limit };
}

// Get one roster by ID
export async function getRosterById(id: number) {
  const roster = await prisma.roster.findUnique({
    where: { id },
    include: { shift: true, staff: true, doctor: true },
  });
  return roster ? mapRosterDates(roster) : null;
}

// Update roster
export async function updateRoster(id: number, data: Partial<RosterInput>) {
  const parsed = RosterBaseSchema.partial().parse(data);
  const roster = await prisma.roster.update({
    where: { id },
    data: parsed,
    include: { shift: true, staff: true, doctor: true },
  });
  return mapRosterDates(roster);
}

// Soft delete roster (mark inactive)
export async function deleteRoster(id: number) {
  const roster = await prisma.roster.update({
    where: { id },
    data: { status: Status.INACTIVE },
    include: { shift: true, staff: true, doctor: true },
  });
  return mapRosterDates(roster);
}
