// types/leave.ts
import { z } from "zod";

// ==========================
// Enums
// ==========================
export const LeaveStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

export type LeaveStatus = z.infer<typeof LeaveStatusEnum>;

// ==========================
// Leave Type & Requests
// ==========================
export const LeaveTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  max_days: z.number().nullable().optional(),
});

export const LeaveRequestSchema = z
  .object({
    id: z.number().optional(),
    staff_id: z.string(),
    type_id: z.number(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    reason: z.string().optional(),
    status: LeaveStatusEnum.optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be the same or after start date",
    path: ["end_date"],
  });

export const ApprovalSchema = z.object({
  id: z.number().optional(),
  leave_id: z.number(),
  approver_id: z.string(),
  decision: LeaveStatusEnum,
  comments: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type LeaveTypeInput = z.infer<typeof LeaveTypeSchema>;
export type LeaveRequestInput = z.infer<typeof LeaveRequestSchema>;
export type ApprovalInput = z.infer<typeof ApprovalSchema>;

// ==========================
// With Relations
// ==========================
export type LeaveRequestWithRelations = {
  id: number;
  staff_id: string;
  type_id: number;
  start_date: Date;
  end_date: Date;
  reason?: string | null;
  status: LeaveStatus;
  created_at: Date;
  updated_at: Date;
  type: { id: number; name: string };
  staff: { id: string; name: string; department?: string | null };
  approvals: {
    id: number;
    approver_id: string;
    decision: LeaveStatus;
    comments?: string | null;
  }[];
};
