// components/leave/LeaveHistoryTable.tsx
"use client";

import { useEffect, useState } from "react";
import { getLeaveRequests } from "@/app/actions/leave";
import { useUser } from "@clerk/nextjs";

type LeaveRequest = Awaited<ReturnType<typeof getLeaveRequests>>[number];

export default function LeaveHistoryTable() {
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    getLeaveRequests()
      .then((allRequests) => {
        // Filter only leaves for logged-in staff
        const myLeaves = allRequests.filter((req) => req.staff_id === user.id);
        setHistory(myLeaves);
      })
      .catch(console.error);
  }, [user]);

  return (
    <div className="overflow-x-auto bg-card p-4 rounded-2xl shadow-md border border-border">
      <table className="w-full text-sm text-foreground">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="p-2">Leave Type</th>
            <th className="p-2">Dates</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((req) => (
            <tr key={req.id} className="border-b border-border">
              <td className="p-2">{req.type?.name ?? "-"}</td>
              <td className="p-2">
                {new Date(req.start_date).toISOString().split("T")[0]} →{" "}
                {new Date(req.end_date).toISOString().split("T")[0]}
              </td>
              <td className="p-2">{req.reason || "-"}</td>
              <td className="p-2">{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
