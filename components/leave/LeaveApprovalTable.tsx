// components/leave/LeaveApprovalTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getLeaveRequests, updateLeaveRequest } from "@/app/actions/leave";
import { useUser } from "@clerk/nextjs";

type LeaveRequest = Awaited<ReturnType<typeof getLeaveRequests>>[number];

export default function LeaveApprovalTable() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const { user } = useUser();

  // Determine if current user can approve/reject (add manager role later)
  const canApprove = user?.publicMetadata?.role === "manager" || user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (canApprove) {
      getLeaveRequests()
        .then(setRequests)
        .catch(console.error);
    }
  }, [canApprove]);

  const handleDecision = async (id: number, decision: "APPROVED" | "REJECTED") => {
    try {
      await updateLeaveRequest(id, { status: decision });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: decision } : req
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update leave request");
    }
  };

  return (
    <div className="overflow-x-auto bg-card p-4 rounded-2xl shadow-md border border-border">
      <table className="w-full text-sm text-foreground">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="p-2">Staff</th>
            <th className="p-2">Type</th>
            <th className="p-2">Dates</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b border-border align-top">
              <td className="p-2">{req.staff?.name ?? req.staff_id}</td>
              <td className="p-2">{req.type?.name ?? "-"}</td>
              <td className="p-2">
                {new Date(req.start_date).toISOString().split("T")[0]} →{" "}
                {new Date(req.end_date).toISOString().split("T")[0]}
              </td>
              <td className="p-2">{req.reason ?? "-"}</td>
              <td className="p-2">
                {req.status}
                {req.approvals?.length ? (
                  <ul className="mt-1 text-xs text-muted-foreground">
                    {req.approvals.map((a) => (
                      <li key={a.id}>
                        {a.approver?.name ?? a.approver_id}: {a.decision}
                        {a.comments ? ` (${a.comments})` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </td>
              <td className="p-2 space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleDecision(req.id, "APPROVED")}
                  disabled={!canApprove || req.status === "APPROVED"}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDecision(req.id, "REJECTED")}
                  disabled={!canApprove || req.status === "REJECTED"}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
