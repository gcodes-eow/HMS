// utils/auditLogs.ts
import db from "@/lib/db";
import { z } from "zod";

// Schema for AuditLog
export const AuditLogSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  record_id: z.string(),
  action: z.string(),
  details: z.string().nullable().optional(),
  model: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type AuditLogInput = z.infer<typeof AuditLogSchema>;

/**
 * logAction - inserts an audit log into the database
 */
export async function logAction(log: AuditLogInput) {
  try {
    const parsedLog = AuditLogSchema.parse(log);

    await db.auditLog.create({
      data: {
        user_id: parsedLog.user_id,
        record_id: parsedLog.record_id,
        action: parsedLog.action,
        details: parsedLog.details ?? null,
        model: parsedLog.model,
      },
    });
  } catch (err) {
    console.error("Failed to insert audit log:", err);
  }
}

/**
 * Convenience helper for generic logging
 */
export async function logModelAction(params: {
  userId: string;
  recordId: string;
  action: string;
  details?: string;
  model: string;
}) {
  return logAction({
    user_id: params.userId,
    record_id: params.recordId,
    action: params.action,
    details: params.details ?? null,
    model: params.model,
  });
}
