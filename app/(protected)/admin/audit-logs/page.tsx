// app/(protected)/admin/audit-logs/page.tsx
import db from "@/lib/db";
import { format } from "date-fns";
import { AppointmentStatus, PaymentStatus, LabTestStatus, Prisma } from "@prisma/client";
import { Pagination } from "@/components/Pagination";
import { z } from "zod";
import { AuditLogSchema } from "@/utils/auditLogs"; // <-- fixed import path

// Extend schema to include user relation
const AuditLogWithUserSchema = AuditLogSchema.extend({
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),
});

type AuditLogWithUser = z.infer<typeof AuditLogWithUserSchema>;

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const params = searchParams ?? {};

  const page = params.p ? parseInt(params.p as string, 10) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Build Prisma where clause
  const where: Prisma.AuditLogWhereInput = {};
  if (params.action) where.action = params.action as string;
  if (params.status) where.details = params.status as string;
  if (params.user) {
    where.user = { name: { contains: params.user as string, mode: "insensitive" } };
  }

  const orderBy: Prisma.AuditLogOrderByWithRelationInput = {
    created_at: params.sort === "oldest" ? "asc" : "desc",
  };

  const [totalLogs, rawLogs] = await Promise.all([
    db.auditLog.count({ where }),
    db.auditLog.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  const auditLogs: AuditLogWithUser[] = rawLogs.map((log) =>
    AuditLogWithUserSchema.parse(log)
  );

  const totalPages = Math.ceil(totalLogs / limit);

  const statuses = Array.from(
    new Set([
      ...Object.values(AppointmentStatus),
      ...Object.values(PaymentStatus),
      ...Object.values(LabTestStatus),
    ])
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Audit Logs</h1>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-2 items-center mb-6">
        <input
          name="user"
          type="text"
          placeholder="Filter by User Name"
          defaultValue={(params.user as string) ?? ""}
          className="border rounded px-2 py-1"
        />
        <input
          name="action"
          type="text"
          placeholder="Filter by Action"
          defaultValue={(params.action as string) ?? ""}
          className="border rounded px-2 py-1"
        />
        <select
          name="status"
          defaultValue={(params.status as string) ?? ""}
          className="border rounded px-2 py-1"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={(params.sort as string) ?? "newest"}
          className="border rounded px-2 py-1"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
          Apply
        </button>
      </form>

      {/* Table */}
      {auditLogs.length === 0 ? (
        <p className="text-gray-600">No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">User</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Action</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Entity</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Details / Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-600">
                    {log.created_at ? format(new Date(log.created_at), "PPpp") : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {log.user ? `${log.user.name} (${log.user.email})` : "System"}
                  </td>
                  <td className="px-4 py-2 font-medium">{log.action}</td>
                  <td className="px-4 py-2">{log.model}</td>
                  <td className="px-4 py-2 text-gray-500 max-w-xs truncate">
                    {log.details ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalRecords={totalLogs}
          currentPage={page}
          totalPages={totalPages}
          limit={limit}
        />
      )}
    </div>
  );
}
