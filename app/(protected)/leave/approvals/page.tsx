// app/approved/(protected)/leave/approval/page.tsx
import LeaveApprovalTable from "@/components/leave/LeaveApprovalTable";

export default function LeaveApprovalPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">Leave Approvals</h1>
      <LeaveApprovalTable />
    </div>
  );
}
