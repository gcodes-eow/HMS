// utils/auditLogs.ts
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// ==========================
// Zod Schema for AuditLog
// ==========================
export const AuditLogSchema = z.object({
  id: z.number().optional(),
  user_id: z.string().optional().nullable(),
  record_id: z.string(),
  action: z.string(),
  details: z.string().nullable().optional(),
  model: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type AuditLogInput = z.infer<typeof AuditLogSchema>;

// ==========================
// logAction - inserts an audit log
// ==========================
export async function logAction(log: AuditLogInput) {
  try {
    const parsedLog = AuditLogSchema.parse(log);

    await db.auditLog.create({
      data: {
        user_id: parsedLog.user_id ?? undefined,
        record_id: parsedLog.record_id,
        action: parsedLog.action,
        details: parsedLog.details ?? null,
        model: parsedLog.model,
      } as Prisma.AuditLogUncheckedCreateInput, // use Prisma type from @prisma/client
    });
  } catch (err) {
    console.error("Failed to insert audit log:", err);
  }
}

// ==========================
// Convenience helper
// ==========================
export async function logModelAction(params: {
  userId?: string;
  recordId: string;
  action: string;
  details?: string;
  model: string;
}) {
  return logAction({
    user_id: params.userId ?? undefined,
    record_id: params.recordId,
    action: params.action,
    details: params.details ?? null,
    model: params.model,
  });
}
