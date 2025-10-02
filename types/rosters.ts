// types/rosters.ts
import { z } from "zod";
import { RosterSchema } from "@/utils/services/rosters";
import { Status, ShiftType, Role } from "@prisma/client"; // ✅ use enums directly

// Input type inferred from Zod schema
export type RosterInput = z.infer<typeof RosterSchema>;

// Prisma-backed duty roster type
export interface DutyRoster {
  id: number;
  shift_id: number;
  staff_id?: string | null;
  doctor_id?: string | null;
  date: Date;
  status: Status; // ✅ enum from Prisma
  start_time: Date; // 👈 new
  end_time: Date;   // 👈 new
  created_at: Date;
  updated_at: Date;

  shift: {
    id: number;
    name: string;
    type: ShiftType; // ✅ enum from Prisma
    start_time: string;
    end_time: string;
    notes?: string | null;
  };

  staff?: {
    id: string;
    name: string;
    role: Role; // ✅ enum from Prisma
    department?: string | null;
  } | null;

  doctor?: {
    id: string;
    name: string;
    specialization: string;
    department?: string | null;
  } | null;
}
